import { useState } from "react";

const TEMPLATES = [
  { id:"budget",    icon:"💰", label:"Monthly Budget",      desc:"Income & expense tracker",
    prompt:"personal monthly budget with columns: Category (Food, Rent, Transport, Electricity, Entertainment, Savings), Budget Amount, Actual Amount, Difference. 12 realistic rows for an Indian household." },
  { id:"sales",     icon:"📈", label:"Sales Tracker",       desc:"Daily sales log with profit",
    prompt:"daily sales tracker with columns: Date, Product Name, Category, Quantity Sold, Unit Price, Total Sales, Cost Price, Profit. 12 rows of realistic shop sales data." },
  { id:"attendance",icon:"📅", label:"Attendance Sheet",    desc:"Employee attendance",
    prompt:"employee attendance sheet with columns: Employee Name, Department, Date, Day, Status (P/A/L), Remarks. 15 rows for a small office." },
  { id:"inventory", icon:"📦", label:"Stock Inventory",     desc:"Shop or warehouse stock",
    prompt:"grocery shop stock inventory with columns: Item Code, Item Name, Category, Stock Quantity, Minimum Stock, Unit Price, Total Value, Supplier. 12 items." },
  { id:"marks",     icon:"📝", label:"Student Marks",       desc:"Exam results sheet",
    prompt:"student marks sheet with columns: Student Name, Roll No, Maths, Science, English, Hindi, Social Studies, Total, Percentage, Grade. 12 students with realistic marks." },
  { id:"expenses",  icon:"🧾", label:"Business Expenses",   desc:"Company expense report",
    prompt:"business expense report with columns: Date, Category, Description, Amount, Payment Method, Receipt No, Approved By. 15 realistic expense rows." },
  { id:"emi",       icon:"🏦", label:"Loan EMI Schedule",   desc:"Loan repayment tracker",
    prompt:"loan EMI repayment schedule with columns: Month, Opening Balance, EMI Amount, Principal, Interest, Closing Balance. 12 months for a ₹100000 loan at 10% annual interest." },
  { id:"chart",     icon:"📊", label:"Sales Chart Report",  desc:"Data + auto chart sheet ✨ NEW",
    prompt:"monthly sales report with columns: Month, Product A Sales, Product B Sales, Product C Sales, Total Sales, Growth%. 12 months of realistic data.",
    includeChart: true, chartType: "Column" },
  { id:"custom",    icon:"✨", label:"Custom",               desc:"Describe your own spreadsheet", prompt:"" },
];

const CHART_TYPES = ["Column","Bar","Line","Pie"];

const SYSTEM = `You are an Excel data generator. Respond ONLY with valid JSON, no markdown:
{ "title": "...", "headers": ["Col1","Col2",...], "rows": [["val",...], ...] }
Generate 8-15 realistic rows. Use Indian context when relevant. Numbers only (no ₹ symbol in data).`;

export default function ExcelGen() {
  const [sel, setSel]       = useState(null);
  const [custom, setCustom] = useState("");
  const [chartType, setChartType] = useState("Column");
  const [includeChart, setIncludeChart] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [data, setData]         = useState(null);
  const [err, setErr]           = useState("");
  const [downloading, setDownloading] = useState(false);

  const template = TEMPLATES.find(t => t.id === sel);

  function selectTemplate(t) {
    setSel(t.id);
    setData(null);
    setErr("");
    if (t.includeChart) { setIncludeChart(true); setChartType(t.chartType || "Column"); }
  }

  async function generate() {
    if (!template) return;
    const prompt = template.id === "custom" ? custom : template.prompt;
    if (!prompt.trim()) { setErr("Please describe what you need."); return; }
    setLoading(true); setErr(""); setData(null);

    const apiKey = import.meta.env.VITE_GEMINI_KEY || "";
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: "user", parts: [{ text: `Generate Excel data for: ${prompt}` }] }]
        }),
      });
      const d = await res.json();
      const raw = d.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      setData(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch {
      setErr("Could not generate data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadXlsx() {
    if (!data) return;
    setDownloading(true);
    try {
      const body = { ...data, includeChart, chartType };
      const res = await fetch("http://localhost:5000/api/excel/generate", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href=url; a.download=`${data.title||"ExcelSmart"}.xlsx`; a.click();
      URL.revokeObjectURL(url);
    } catch {
      downloadCsv();
    } finally {
      setDownloading(false);
    }
  }

  function downloadCsv() {
    if (!data) return;
    const rows = [data.headers, ...data.rows];
    const csv = rows.map(r => r.map(c=>`"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`${data.title||"data"}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="ph">
        <h1>📊 Generate Excel Files</h1>
        <p>Pick a template → AI fills data → Backend builds a real formatted .xlsx with optional chart sheet!</p>
      </div>

      <div style={{display:"flex",gap:20}}>
        {/* Left: template picker */}
        <div style={{width:270,flexShrink:0}}>
          <div className="card">
            <div className="label" style={{marginBottom:12}}>1. Pick a Template</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
              {TEMPLATES.map(t=>(
                <button key={t.id} onClick={()=>selectTemplate(t)} style={{
                  background: sel===t.id ? "rgba(45,186,115,.1)" : "var(--bg3)",
                  border:`1px solid ${sel===t.id?"var(--accent)":"var(--border)"}`,
                  borderRadius:10,padding:"11px 14px",cursor:"pointer",
                  textAlign:"left",color:"var(--text)",fontFamily:"inherit",transition:"all .15s",
                }}>
                  <div style={{fontWeight:800,fontSize:13}}>
                    {t.icon} {t.label}
                    {t.includeChart && <span className="badge b-b" style={{marginLeft:8,fontSize:10}}>+Chart</span>}
                  </div>
                  <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>{t.desc}</div>
                </button>
              ))}
            </div>

            {sel==="custom" && (
              <div className="fg">
                <label className="label">Describe your spreadsheet</label>
                <textarea className="textarea" value={custom} onChange={e=>setCustom(e.target.value)}
                  placeholder="e.g. Weekly production log with product name, units made, workers, shift" style={{minHeight:80,fontSize:13}}/>
              </div>
            )}

            {/* Chart options */}
            <div style={{borderTop:"1px solid var(--border)",paddingTop:14,marginBottom:14}}>
              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:14,fontWeight:700,marginBottom:10}}>
                <input type="checkbox" checked={includeChart} onChange={e=>setIncludeChart(e.target.checked)}
                  style={{accentColor:"var(--accent)",width:16,height:16}}/>
                📊 Add Chart Sheet
              </label>
              {includeChart && (
                <div>
                  <label className="label">Chart Type</label>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {CHART_TYPES.map(ct=>(
                      <button key={ct} className={`chip ${chartType===ct?"active":""}`}
                        onClick={()=>setChartType(ct)}>
                        {ct==="Column"?"📊":ct==="Bar"?"📉":ct==="Line"?"📈":"🥧"} {ct}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-green" style={{width:"100%"}} onClick={generate} disabled={!sel||loading}>
              {loading ? "⏳ Generating..." : "✨ Generate Data"}
            </button>
          </div>
        </div>

        {/* Right: preview */}
        <div style={{flex:1,minWidth:0}}>
          {err && (
            <div className="card card-r" style={{marginBottom:14}}>❌ {err}</div>
          )}

          {!data && !loading && (
            <div className="card" style={{textAlign:"center",padding:"70px 24px"}}>
              <div style={{fontSize:56,marginBottom:14}}>📊</div>
              <h3 style={{fontSize:18,fontWeight:800,marginBottom:8}}>Preview Will Appear Here</h3>
              <p style={{color:"var(--text2)",fontSize:14}}>Select a template and click "Generate Data"</p>
            </div>
          )}

          {loading && (
            <div className="card" style={{textAlign:"center",padding:"70px 24px"}}>
              <div style={{fontSize:48,marginBottom:14}}>⚙️</div>
              <h3 style={{fontSize:18,fontWeight:800,marginBottom:12}}>AI is building your data...</h3>
              <div style={{display:"flex",justifyContent:"center"}}><div className="typing"><span/><span/><span/></div></div>
            </div>
          )}

          {data && (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <h2 style={{fontSize:19,fontWeight:900}}>📋 {data.title}</h2>
                  <p style={{color:"var(--text2)",fontSize:13}}>
                    {data.rows?.length} rows × {data.headers?.length} columns
                    {includeChart && <span style={{color:"var(--blue)",marginLeft:8}}>+ {chartType} Chart Sheet</span>}
                  </p>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-ghost btn-sm" onClick={downloadCsv}>⬇ CSV</button>
                  <button className="btn btn-green btn-sm" onClick={downloadXlsx} disabled={downloading}>
                    {downloading?"⏳...":"⬇ Excel (.xlsx)"}
                  </button>
                </div>
              </div>

              <div className="xl-wrap">
                <table className="xl-table">
                  <thead>
                    <tr>
                      <th className="rn">#</th>
                      {data.headers?.map((h,i)=><th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows?.map((row,ri)=>(
                      <tr key={ri}>
                        <td className="rn" style={{fontSize:11,padding:"6px 10px"}}>{ri+1}</td>
                        {row.map((cell,ci)=><td key={ci}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {includeChart && (
                <div className="card card-b" style={{marginTop:14}}>
                  <div style={{fontWeight:800,marginBottom:6}}>📊 Chart Sheet Included</div>
                  <p style={{fontSize:13,color:"var(--text2)"}}>
                    The downloaded .xlsx will contain a second sheet called "📊 Chart" with a <b style={{color:"var(--text)"}}>{chartType} chart</b> built from your data. 
                    Open in Excel and click the "📊 Chart" tab to view it!
                  </p>
                </div>
              )}

              <div className="card card-b" style={{marginTop:14}}>
                <p style={{fontSize:12,color:"var(--text2)",lineHeight:1.7}}>
                  💡 <b style={{color:"var(--text)"}}>Excel (.xlsx)</b> uses EPPlus 7 (NonCommercial) — fully formatted with title row, auto-totals, freeze headers, Excel table with filters{includeChart?", and a chart sheet":""}.
                  CSV works without backend. Start backend: <code style={{background:"var(--bg3)",padding:"2px 6px",borderRadius:4,fontSize:11}}>cd backend && dotnet run</code>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
