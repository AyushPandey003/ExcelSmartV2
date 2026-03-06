import { useState, useEffect, useRef } from "react";
import ApiKeyPanel from "../components/ApiKeyPanel";
import { getUserGeminiKey, getUserGeminiModel } from "../lib/userGeminiKey";

// ── Templates ─────────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "budget", icon: "💰", label: "Monthly Budget", desc: "Income & expense tracker",
    prompt: "personal monthly budget with columns: Category (Food, Rent, Transport, Electricity, Entertainment, Savings), Budget Amount, Actual Amount, Difference. 12 realistic rows for an Indian household."
  },
  {
    id: "sales", icon: "📈", label: "Sales Tracker", desc: "Daily sales log with profit",
    prompt: "daily sales tracker with columns: Date, Product Name, Category, Quantity Sold, Unit Price, Total Sales, Cost Price, Profit. 12 rows of realistic shop sales data.",
    includeChart: true, chartType: "Column"
  },
  {
    id: "attendance", icon: "📅", label: "Attendance Sheet", desc: "Employee attendance",
    prompt: "employee attendance sheet with columns: Employee Name, Department, Date, Day, Status (P/A/L), Remarks. 15 rows for a small office."
  },
  {
    id: "inventory", icon: "📦", label: "Stock Inventory", desc: "Shop or warehouse stock",
    prompt: "grocery shop stock inventory with columns: Item Code, Item Name, Category, Stock Quantity, Minimum Stock, Unit Price, Total Value, Supplier. 12 items."
  },
  {
    id: "marks", icon: "📝", label: "Student Marks", desc: "Exam results sheet",
    prompt: "student marks sheet with columns: Student Name, Roll No, Maths, Science, English, Hindi, Social Studies, Total, Percentage, Grade. 12 students with realistic marks.",
    includeChart: true, chartType: "Bar"
  },
  {
    id: "expenses", icon: "🧾", label: "Business Expenses", desc: "Company expense report",
    prompt: "business expense report with columns: Date, Category, Description, Amount, Payment Method, Receipt No, Approved By. 15 realistic expense rows.",
    includeChart: true, chartType: "Pie"
  },
  {
    id: "emi", icon: "🏦", label: "Loan EMI Schedule", desc: "Loan repayment tracker",
    prompt: "loan EMI repayment schedule with columns: Month, Opening Balance, EMI Amount, Principal, Interest, Closing Balance. 12 months for a ₹100000 loan at 10% annual interest.",
    includeChart: true, chartType: "Area"
  },
  {
    id: "chart", icon: "📊", label: "Sales Chart Report", desc: "Data + auto chart sheet ✨",
    prompt: "monthly sales report with columns: Month, Product A Sales, Product B Sales, Product C Sales, Total Sales, Growth%. 12 months of realistic data.",
    includeChart: true, chartType: "Column"
  },
  {
    id: "payroll", icon: "💼", label: "HR Payroll", desc: "Employee salary sheet",
    prompt: "HR payroll sheet with columns: Employee ID, Employee Name, Department, Basic Salary, HRA, TA, DA, Gross Salary, PF Deduction, TDS Deduction, Net Salary. 15 employees in an Indian company.",
    includeChart: true, chartType: "Bar"
  },
  {
    id: "project", icon: "📋", label: "Project Tracker", desc: "Task & milestone tracker",
    prompt: "project task tracker with columns: Task ID, Task Name, Assigned To, Start Date, End Date, Duration(days), Status (Not Started/In Progress/Done), Priority (High/Medium/Low), Completion%. 14 realistic tasks for a software project."
  },
  {
    id: "invoice", icon: "🗒️", label: "Invoice Log", desc: "Business invoice register",
    prompt: "business invoice log with columns: Invoice No, Date, Client Name, Item Description, Quantity, Unit Price, Subtotal, GST(18%), Total Amount, Payment Status, Due Date. 12 invoices for a small business."
  },
  {
    id: "kpi", icon: "🎯", label: "KPI Dashboard", desc: "Key performance metrics",
    prompt: "business KPI dashboard with columns: Metric Name, Target, Actual, Achievement%, Status (On Track/Behind/Exceeded), Q1 Value, Q2 Value, Q3 Value, Q4 Value. 12 realistic KPIs for a sales team.",
    includeChart: true, chartType: "Column"
  },
  {
    id: "custom", icon: "✨", label: "Custom", desc: "Describe your own spreadsheet", prompt: ""
  },
];

const CHART_TYPES = [
  { id: "Column", icon: "📊", label: "Column" },
  { id: "Bar",    icon: "📉", label: "Bar" },
  { id: "Line",   icon: "📈", label: "Line" },
  { id: "Pie",    icon: "🥧", label: "Pie" },
  { id: "Area",   icon: "🏔️", label: "Area" },
];

const SYSTEM = `You are an Excel data generator. Respond ONLY with valid JSON, no markdown:
{ "title": "...", "headers": ["Col1","Col2",...], "rows": [["val",...], ...] }
Generate 10-15 realistic rows. Use Indian context when relevant. Numbers only (no ₹ symbol in data). Do not include currency symbols in numeric cells.`;

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ── Chart.js preview ─────────────────────────────────────────────────────────
function ChartPreview({ data, chartType }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    // Dynamically load Chart.js
    const loadChart = async () => {
      let Chart;
      try {
        const mod = await import("https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm");
        Chart = mod.Chart;
        mod.registerables && Chart.register(...mod.registerables);
      } catch {
        return;
      }

      // Find label column (first non-numeric enough) and numeric columns
      const { headers, rows } = data;
      const isNumericCol = (colIdx) => {
        const numericCount = rows.filter(r => !isNaN(parseFloat(r[colIdx]))).length;
        return rows.length > 0 && numericCount / rows.length > 0.6;
      };

      let labelCol = 0;
      const numericCols = [];
      for (let c = 0; c < headers.length; c++) {
        if (isNumericCol(c)) numericCols.push(c);
        else if (labelCol === 0 && numericCols.length === 0) labelCol = c;
      }
      if (numericCols.length === 0) return;

      const labels = rows.map(r => r[labelCol] ?? "");
      const COLORS = [
        "#2196F3","#4CAF50","#FF9800","#E91E63",
        "#9C27B0","#00BCD4","#FF5722","#8BC34A"
      ];

      // Destroy previous chart instance
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      const isPie = chartType === "Pie";
      const chartTypeMap = {
        Column: "bar", Bar: "bar", Line: "line", Pie: "pie", Area: "line",
      };
      const type = chartTypeMap[chartType] || "bar";

      const datasets = isPie
        ? [{
            label: headers[numericCols[0]],
            data: rows.map(r => parseFloat(r[numericCols[0]]) || 0),
            backgroundColor: COLORS.slice(0, rows.length),
            borderWidth: 1,
          }]
        : numericCols.map((colIdx, i) => ({
            label: headers[colIdx],
            data: rows.map(r => parseFloat(r[colIdx]) || 0),
            backgroundColor: COLORS[i % COLORS.length] + (type === "bar" ? "CC" : "33"),
            borderColor: COLORS[i % COLORS.length],
            borderWidth: 2,
            fill: chartType === "Area",
            tension: 0.4,
          }));

      chartInstanceRef.current = new Chart(canvasRef.current, {
        type,
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: isPie ? "right" : "bottom", labels: { color: "#ccc", font: { size: 11 } } },
            title: { display: false },
          },
          indexAxis: chartType === "Bar" ? "y" : "x",
          scales: isPie ? {} : {
            x: { ticks: { color: "#aaa", font: { size: 10 } }, grid: { color: "rgba(255,255,255,0.05)" } },
            y: { ticks: { color: "#aaa", font: { size: 10 } }, grid: { color: "rgba(255,255,255,0.08)" } },
          },
        },
      });
    };

    loadChart();
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, chartType]);

  return (
    <div style={{ position: "relative", height: 280, background: "var(--bg3)", borderRadius: 12, padding: 16 }}>
      <canvas ref={canvasRef} style={{ maxWidth: "100%", maxHeight: "100%" }} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ExcelGen() {
  const [sel, setSel]             = useState(null);
  const [custom, setCustom]       = useState("");
  const [chartType, setChartType] = useState("Column");
  const [includeChart, setIncludeChart] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [data, setData]           = useState(null);
  const [err, setErr]             = useState("");
  const [downloading, setDownloading] = useState(false);
  const [showChartPreview, setShowChartPreview] = useState(true);
  const [apiKey, setApiKey] = useState(() => getUserGeminiKey());
  const [model, setModel] = useState(() => getUserGeminiModel());

  const template = TEMPLATES.find(t => t.id === sel);

  function selectTemplate(t) {
    setSel(t.id);
    setData(null);
    setErr("");
    if (t.includeChart) { setIncludeChart(true); setChartType(t.chartType || "Column"); }
    else { setIncludeChart(false); }
  }

  async function generate() {
    if (!template) return;
    const prompt = template.id === "custom" ? custom : template.prompt;
    if (!prompt.trim()) { setErr("Please describe what you need."); return; }
    if (!apiKey) {
      setErr("Add your Gemini API key first. Your key stays in your browser and is never stored on our servers.");
      return;
    }
    setLoading(true); setErr(""); setData(null);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: "user", parts: [{ text: `Generate Excel data for: ${prompt}` }] }]
        }),
      });
      const d = await res.json();
      const raw = d.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      setData(JSON.parse(raw.replace(/```json|```/g, "").trim()));
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
      const res = await fetch(`${API_BASE}/api/excel/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${data.title || "ExcelSmart"}.xlsx`; a.click();
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
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${data.title || "data"}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const numericColCount = data
    ? data.headers.filter((_, i) => {
        const count = (data.rows || []).filter(r => !isNaN(parseFloat(r[i]))).length;
        return data.rows.length > 0 && count / data.rows.length > 0.6;
      }).length
    : 0;

  return (
    <div>
      <div className="ph">
        <h1>📊 Generate Excel Files</h1>
        <p>Pick a template → AI fills data → Download a real formatted .xlsx with optional chart sheet!</p>
      </div>

      <ApiKeyPanel onKeyChange={setApiKey} onModelChange={setModel} />

      <div style={{ display: "flex", gap: 20 }}>
        {/* Left: template picker */}
        <div style={{ width: 270, flexShrink: 0 }}>
          <div className="card">
            <div className="label" style={{ marginBottom: 12 }}>1. Pick a Template</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => selectTemplate(t)} style={{
                  background: sel === t.id ? "rgba(45,186,115,.1)" : "var(--bg3)",
                  border: `1px solid ${sel === t.id ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 10, padding: "11px 14px", cursor: "pointer",
                  textAlign: "left", color: "var(--text)", fontFamily: "inherit", transition: "all .15s",
                }}>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>
                    {t.icon} {t.label}
                    {t.includeChart && <span className="badge b-b" style={{ marginLeft: 8, fontSize: 10 }}>+Chart</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>

            {sel === "custom" && (
              <div className="fg">
                <label className="label">Describe your spreadsheet</label>
                <textarea className="textarea" value={custom} onChange={e => setCustom(e.target.value)}
                  placeholder="e.g. Weekly production log with product name, units made, workers, shift"
                  style={{ minHeight: 80, fontSize: 13 }} />
              </div>
            )}

            {/* Chart options */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginBottom: 14 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                <input type="checkbox" checked={includeChart} onChange={e => setIncludeChart(e.target.checked)}
                  style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
                📊 Add Chart Sheet
              </label>
              {includeChart && (
                <div>
                  <label className="label">Chart Type</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {CHART_TYPES.map(ct => (
                      <button key={ct.id} className={`chip ${chartType === ct.id ? "active" : ""}`}
                        onClick={() => setChartType(ct.id)}>
                        {ct.icon} {ct.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-green" style={{ width: "100%" }} onClick={generate} disabled={!sel || loading || !apiKey}>
              {loading ? "⏳ Generating..." : "✨ Generate Data"}
            </button>
          </div>
        </div>

        {/* Right: preview */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {err && (
            <div className="card card-r" style={{ marginBottom: 14 }}>❌ {err}</div>
          )}

          {!data && !loading && (
            <div className="card" style={{ textAlign: "center", padding: "70px 24px" }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>📊</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Preview Will Appear Here</h3>
              <p style={{ color: "var(--text2)", fontSize: 14 }}>Select a template and click "Generate Data"</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
                {["13 Templates", "5 Chart Types", "In-browser Preview", "Live .xlsx Download"].map(f => (
                  <span key={f} style={{ fontSize: 12, padding: "5px 12px", background: "var(--bg3)", borderRadius: 99, color: "var(--text2)", border: "1px solid var(--border)" }}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="card" style={{ textAlign: "center", padding: "70px 24px" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>⚙️</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>AI is building your data...</h3>
              <div style={{ display: "flex", justifyContent: "center" }}><div className="typing"><span /><span /><span /></div></div>
            </div>
          )}

          {data && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontSize: 19, fontWeight: 900 }}>📋 {data.title}</h2>
                  <p style={{ color: "var(--text2)", fontSize: 13 }}>
                    {data.rows?.length} rows × {data.headers?.length} columns
                    {includeChart && <span style={{ color: "var(--blue)", marginLeft: 8 }}>· {numericColCount} series · {chartType} chart</span>}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-ghost btn-sm" onClick={downloadCsv}>⬇ CSV</button>
                  <button className="btn btn-green btn-sm" onClick={downloadXlsx} disabled={downloading}>
                    {downloading ? "⏳..." : "⬇ Excel (.xlsx)"}
                  </button>
                </div>
              </div>

              {/* In-browser Chart Preview */}
              {includeChart && (
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>📊 Chart Preview</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {CHART_TYPES.map(ct => (
                        <button key={ct.id} className={`chip ${chartType === ct.id ? "active" : ""}`}
                          style={{ fontSize: 11, padding: "3px 10px" }}
                          onClick={() => setChartType(ct.id)}>
                          {ct.icon} {ct.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ChartPreview data={data} chartType={chartType} />
                  <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 8, textAlign: "center" }}>
                    Live preview · All {numericColCount} numeric column{numericColCount !== 1 ? "s" : ""} will appear as series in the Excel chart sheet
                  </p>
                </div>
              )}

              {/* Data Table */}
              <div className="xl-wrap">
                <table className="xl-table">
                  <thead>
                    <tr>
                      <th className="rn">#</th>
                      {data.headers?.map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows?.map((row, ri) => (
                      <tr key={ri}>
                        <td className="rn" style={{ fontSize: 11, padding: "6px 10px" }}>{ri + 1}</td>
                        {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {includeChart && (
                <div className="card card-b" style={{ marginTop: 14 }}>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>📊 Chart Sheet Included in Excel</div>
                  <p style={{ fontSize: 13, color: "var(--text2)" }}>
                    The downloaded .xlsx will contain a "📊 Chart" sheet with a <b style={{ color: "var(--text)" }}>{chartType} chart</b> plotting
                    all <b style={{ color: "var(--text)" }}>{numericColCount} numeric columns</b> as separate series. Open in Excel → click the "📊 Chart" tab.
                  </p>
                </div>
              )}

              <div className="card card-b" style={{ marginTop: 14 }}>
                <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7 }}>
                  💡 <b style={{ color: "var(--text)" }}>Excel (.xlsx)</b> uses EPPlus 7 (NonCommercial) — fully formatted with title row, auto-totals, freeze headers, Excel table with filters{includeChart ? ", and a chart sheet" : ""}.
                  CSV works without backend. Start backend: <code style={{ background: "var(--bg3)", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>cd backend &amp;&amp; dotnet run</code>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
