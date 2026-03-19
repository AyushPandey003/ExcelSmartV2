import { useState, useRef, useCallback } from "react";
import ApiKeyPanel from "../components/ApiKeyPanel";
import { getUserGeminiKey, getUserGeminiModel } from "../lib/userGeminiKey";

const EXCEL_AI_SYSTEM = `You are ExcelBot — an expert Excel tutor helping a beginner user understand their own spreadsheet.

The user has uploaded an Excel file. You have been given context about that file (headers, sample data, detected errors, formulas found).

YOUR JOB:
1. Answer questions about THEIR specific spreadsheet data
2. Explain any errors found (#REF!, #VALUE!, #DIV/0!, etc.) clearly and simply
3. Suggest the correct formula to fix errors
4. Help them manipulate or analyze their data
5. Suggest useful formulas for their specific column names

RULES:
- Use the spreadsheet context provided to give SPECIFIC, RELEVANT answers
- Use very simple language — beginner users
- Show exact formulas using their actual column names when possible
- When explaining errors, always show the FIX too
- Use emojis and bullet points
- Keep answers to 5–8 lines unless they ask for more`;

export default function UploadAnalyze() {
  const [drag, setDrag]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis]   = useState(null);
  const [error, setError]     = useState("");
  const [activeTab, setActiveTab] = useState("data");
  const [msgs, setMsgs]       = useState([]);
  const [input, setInput]     = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => getUserGeminiKey());
  const [model, setModel] = useState(() => getUserGeminiModel());
  const [modifyPrompt, setModifyPrompt] = useState("");
  const [modifying, setModifying] = useState(false);
  const [modifiedData, setModifiedData] = useState(null);
  const fileRef = useRef(null);
  const chatRef = useRef(null);

  // ── Upload ──────────────────────────────────────────────────────────────────
  async function handleFile(file) {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx","xls","csv"].includes(ext)) {
      setError("Only .xlsx, .xls, and .csv files are supported."); return;
    }
    setUploading(true); setError(""); setAnalysis(null); setMsgs([]);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/excel/upload", { method:"POST", body:fd });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Analysis failed."); return; }
      setAnalysis(data);
      setActiveTab(data.issues?.length > 0 ? "issues" : "data");
      // Seed AI with welcome + context
      setMsgs([{
        role:"ai",
        text:`✅ I've analyzed your file **${data.fileName}**!\n\n📊 Sheet: "${data.activeSheet}" | ${data.totalRows} rows × ${data.totalCols} columns\n📋 Columns: ${data.headers.join(", ")}\n${data.issues?.length > 0 ? `⚠️ I found ${data.issues.length} issue(s) in your spreadsheet — check the Issues tab!\n` : "✅ No errors detected!\n"}\nYou can now ask me anything about your spreadsheet. For example:\n• "Explain the errors"\n• "How do I sum the ${data.headers[1] || "Amount"} column?"\n• "What formula shows me the average of ${data.headers[1] || "values"}?"\n\nWhat would you like to know? 😊`,
      }]);
    } catch {
      setError("Could not connect to backend. Make sure it's running on http://localhost:5000");
    } finally {
      setUploading(false);
    }
  }

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  // ── AI Chat ─────────────────────────────────────────────────────────────────
  async function sendAI(text) {
    const q = text || input.trim();
    if (!q) return;

    if (!apiKey) {
      setMsgs(m => [...m, {
        role: "ai",
        text: "🔐 Add your Gemini API key first. Your key stays in this browser tab and is never stored on our servers.",
      }]);
      return;
    }

    setInput("");
    setMsgs(m => [...m, { role:"user", text:q }]);
    setAiLoading(true);
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior:"smooth" }), 50);

    // Build context string from analysis
    const ctx = analysis ? buildContext(analysis) : "";
    const systemWithCtx = EXCEL_AI_SYSTEM + (ctx ? `\n\nSPREADSHEET CONTEXT:\n${ctx}` : "");

    try {
      const history = msgs.map(m => ({ role: m.role==="ai"?"model":"user", parts: [{ text: m.text }] }));
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemWithCtx }] },
          contents:[...history, { role: "user", parts: [{ text: q }] }]
        }),
      });
      const d = await res.json();
      const reply = d.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I had trouble. Please try again.";
      setMsgs(m => [...m, { role:"ai", text:reply }]);
    } catch {
      setMsgs(m => [...m, { role:"ai", text:"❌ Connection error. Please try again." }]);
    } finally {
      setAiLoading(false);
      setTimeout(() => chatRef.current?.scrollTo({ top:99999, behavior:"smooth" }), 100);
    }
  }

  function buildContext(a) {
    let s = `File: ${a.fileName}\nSheet: ${a.activeSheet} | Rows: ${a.totalRows} | Cols: ${a.totalCols}\n`;
    s += `Headers: ${a.headers.join(", ")}\n`;
    if (a.formulas?.length) s += `Formulas: ${a.formulas.slice(0,8).join(" | ")}\n`;
    if (a.issues?.length) s += `Errors: ${a.issues.slice(0,8).map(i=>`${i.cell}=${i.value}(${i.description})`).join("; ")}\n`;
    s += `Stats: Sum=${a.stats?.sum}, Avg=${a.stats?.average}, Min=${a.stats?.min}, Max=${a.stats?.max}\n`;
    if (a.rows?.length) s += `Sample rows:\n${a.rows.slice(0,5).map(r=>r.join(" | ")).join("\n")}`;
    return s;
  }

  // ── Modify with AI ─────────────────────────────────────────────────────────
  async function modifyWithAI() {
    if (!modifyPrompt.trim() || !analysis || !apiKey) return;
    setModifying(true);
    setModifiedData(null);
    const ctx = buildContext(analysis);
    const sysPrompt = `You are an Excel data modifier. The user has uploaded a spreadsheet and wants to modify it.\n\nSPREADSHEET CONTEXT:\n${ctx}\n\nThe user will describe what changes they want. Respond ONLY with valid JSON:\n{ "title": "Modified - original title", "headers": ["Col1","Col2",...], "rows": [["val",...], ...] }\n\nApply the user's requested changes to the data. Keep the same structure unless they ask to add/remove columns. Use realistic data.`;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: sysPrompt }] },
          contents: [{ role: "user", parts: [{ text: modifyPrompt }] }]
        }),
      });
      const d = await res.json();
      const raw = d.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      setModifiedData(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch {
      setMsgs(m => [...m, { role: "ai", text: "❌ Could not generate modified data. Please try again." }]);
    } finally {
      setModifying(false);
    }
  }

  function downloadModifiedCsv() {
    if (!modifiedData) return;
    const rows = [modifiedData.headers, ...modifiedData.rows];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${modifiedData.title || "modified"}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadModifiedXlsx() {
    if (!modifiedData) return;
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/excel/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modifiedData),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${modifiedData.title || "Modified"}.xlsx`; a.click();
      URL.revokeObjectURL(url);
    } catch {
      downloadModifiedCsv();
    }
  }

  // ── Quick prompts based on file ──────────────────────────────────────────────
  const quickPrompts = analysis ? [
    `Explain all the errors in my file`,
    `How do I SUM the ${analysis.headers[1] || "Amount"} column?`,
    `What formula calculates the average of ${analysis.headers[1] || "values"}?`,
    `How do I find the highest value in ${analysis.headers[1] || "my data"}?`,
    `How do I use VLOOKUP with my columns: ${analysis.headers.slice(0,3).join(", ")}?`,
    `How do I filter this data by ${analysis.headers[0] || "column"}?`,
  ] : [];

  // ── Error type color ─────────────────────────────────────────────────────────
  const errColor = (v) => {
    if (["#REF!","#VALUE!","#DIV/0!","#NAME?","#NUM!"].includes(v)) return "var(--red)";
    if (v === "#N/A") return "var(--orange)";
    return "var(--yellow)";
  };

  return (
    <div>
      <div className="ph">
        <h1>📂 Upload & Analyze Your Excel File</h1>
        <p>Upload any .xlsx or .csv file — the AI will analyze it, find errors, and answer questions about your specific data!</p>
      </div>

      <ApiKeyPanel onKeyChange={setApiKey} onModelChange={setModel} />

      {/* Drop zone */}
      {!analysis && (
        <div
          className={`drop-zone ${drag ? "drag":""}`}
          onDragOver={e=>{e.preventDefault();setDrag(true)}}
          onDragLeave={()=>setDrag(false)}
          onDrop={onDrop}
          onClick={()=>fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv"
            onChange={e=>handleFile(e.target.files[0])} />
          <div style={{fontSize:52,marginBottom:14}}>{uploading ? "⏳":"📂"}</div>
          <h3 style={{fontSize:18,fontWeight:800,marginBottom:8}}>
            {uploading ? "Analyzing your file..." : "Drop your Excel file here"}
          </h3>
          <p style={{color:"var(--text2)",fontSize:14}}>
            {uploading ? "Please wait..." : "or click to browse — supports .xlsx, .xls, .csv (max 10 MB)"}
          </p>
          {!uploading && (
            <button className="btn btn-blue" style={{marginTop:20}} onClick={e=>{e.stopPropagation();fileRef.current?.click()}}>
              📂 Choose File
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="card card-r" style={{marginTop:16}}>
          ❌ {error}
          {analysis && <button className="btn btn-ghost btn-sm" style={{marginLeft:12}} onClick={()=>{setAnalysis(null);setError("")}}>Upload New File</button>}
        </div>
      )}

      {/* Results */}
      {analysis && (
        <div>
          {/* File summary bar */}
          <div className="card" style={{marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <div style={{fontSize:32}}>📗</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:16}}>{analysis.fileName}</div>
              <div style={{color:"var(--text2)",fontSize:13}}>
                Sheet: <b style={{color:"var(--accent)"}}>{analysis.activeSheet}</b> &nbsp;·&nbsp;
                {analysis.totalRows} rows &nbsp;·&nbsp; {analysis.totalCols} columns &nbsp;·&nbsp;
                {analysis.stats?.errorCells > 0
                  ? <span style={{color:"var(--red)"}}>⚠️ {analysis.stats.errorCells} errors</span>
                  : <span style={{color:"var(--accent)"}}>✅ No errors</span>}
              </div>
            </div>
            {/* Stats pills */}
            {analysis.stats?.sum != null && (
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[
                  {l:"Sum",   v:analysis.stats.sum},
                  {l:"Avg",   v:analysis.stats.average},
                  {l:"Min",   v:analysis.stats.min},
                  {l:"Max",   v:analysis.stats.max},
                ].map(s=>(
                  <div key={s.l} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:10,padding:"6px 14px",textAlign:"center"}}>
                    <div style={{fontSize:11,color:"var(--text3)",fontWeight:800,textTransform:"uppercase"}}>{s.l}</div>
                    <div style={{fontSize:15,fontWeight:800,color:"var(--accent)"}}>{s.v?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
            <button className="btn btn-ghost btn-sm" onClick={()=>{setAnalysis(null);setMsgs([]);setError("")}}>
              Upload New File
            </button>
          </div>

          <div style={{display:"flex",gap:20}}>
            {/* Left panel: tabs */}
            <div style={{flex:1,minWidth:0}}>
              {/* Tab bar */}
              <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                {[
                  {id:"data",    label:`📋 Data Preview (${Math.min(analysis.rows.length, 200)} rows)`},
                  {id:"issues",  label:`⚠️ Issues (${analysis.issues?.length||0})`, red: analysis.issues?.length > 0},
                  {id:"formulas",label:`𝑓𝑥 Formulas (${analysis.formulas?.length||0})`},
                  {id:"columns", label:"📊 Columns"},
                  {id:"modify",  label:"🔄 Modify & Export"},
                  {id:"insights", label:"💡 AI Insights"},
                ].map(t=>(
                  <button key={t.id}
                    className={`btn btn-sm ${activeTab===t.id?"btn-green":"btn-ghost"}`}
                    style={t.red && activeTab!==t.id ? {borderColor:"var(--red)",color:"var(--red)"} : {}}
                    onClick={()=>setActiveTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Data tab */}
              {activeTab==="data" && (
                <div className="xl-wrap">
                  <table className="xl-table">
                    <thead>
                      <tr>
                        <th className="rn">#</th>
                        {analysis.headers.map((h,i)=><th key={i}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.rows.map((row,ri)=>(
                        <tr key={ri}>
                          <td className="rn" style={{fontSize:11,padding:"6px 10px"}}>{ri+1}</td>
                          {row.map((cell,ci)=>(
                            <td key={ci} className={["#REF!","#VALUE!","#DIV/0!","#NAME?","#N/A","#NULL!","#NUM!","######"].includes(cell)?"err":""}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Issues tab */}
              {activeTab==="issues" && (
                <div>
                  {analysis.issues?.length === 0 ? (
                    <div className="card card-g" style={{textAlign:"center",padding:"40px 24px"}}>
                      <div style={{fontSize:48,marginBottom:12}}>✅</div>
                      <h3 style={{fontWeight:800,marginBottom:6}}>No Errors Found!</h3>
                      <p style={{color:"var(--text2)",fontSize:14}}>Your spreadsheet is clean.</p>
                    </div>
                  ) : (
                    <>
                      <div style={{marginBottom:14,fontSize:13,color:"var(--text2)"}}>
                        Found <b style={{color:"var(--red)"}}>{analysis.issues.length}</b> issue(s). Click "Ask AI" to get help fixing any of them!
                      </div>
                      {analysis.issues.map((iss,i)=>(
                        <div key={i} className="issue-item err">
                          <div style={{flex:0}}>
                            <div style={{background:"rgba(255,123,114,.2)",borderRadius:8,padding:"6px 10px",textAlign:"center",minWidth:60}}>
                              <div style={{fontSize:11,color:"var(--text3)",fontWeight:800}}>CELL</div>
                              <div style={{fontFamily:"'Fira Code',monospace",fontWeight:700,color:"var(--red)",fontSize:14}}>{iss.cell}</div>
                            </div>
                          </div>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                              <span className="issue-code" style={{color:errColor(iss.value)}}>{iss.value}</span>
                              <span className="badge b-r">Error</span>
                            </div>
                            <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6}}>{iss.description}</div>
                          </div>
                          <button className="btn btn-ghost btn-sm"
                            onClick={()=>sendAI(`Explain the ${iss.value} error in cell ${iss.cell} and how to fix it`)}>
                            🤖 Fix with AI
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Formulas tab */}
              {activeTab==="formulas" && (
                <div>
                  {analysis.formulas?.length === 0 ? (
                    <div className="card" style={{textAlign:"center",padding:"40px 24px"}}>
                      <div style={{fontSize:48,marginBottom:12}}>𝑓𝑥</div>
                      <p style={{color:"var(--text2)"}}>No formulas found in this sheet.</p>
                    </div>
                  ) : (
                    analysis.formulas.map((f,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                        <div className="fbox" style={{flex:1,margin:0}}>{f}</div>
                        <button className="btn btn-ghost btn-sm"
                          onClick={()=>sendAI(`Explain this formula: ${f}`)}>
                          🤖 Explain
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Columns tab */}
              {activeTab==="columns" && (
                <div className="g2">
                  {analysis.headers.map((h,i)=>(
                    <div key={i} className="card" style={{cursor:"pointer"}}
                      onClick={()=>sendAI(`What useful Excel formulas can I use with the "${h}" column?`)}>
                      <div style={{fontSize:24,marginBottom:8}}>📋</div>
                      <div style={{fontWeight:800,marginBottom:4}}>{h}</div>
                      <div style={{fontSize:12,color:"var(--text2)"}}>Column {String.fromCharCode(65+i)}</div>
                      <div style={{marginTop:10,fontSize:12,color:"var(--blue)"}}>Click → Ask AI about this column</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modify & Export tab */}
              {activeTab==="modify" && (
                <div>
                  <div className="card" style={{marginBottom:16}}>
                    <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>🔄 Describe Your Changes</div>
                    <p style={{color:"var(--text2)",fontSize:13,marginBottom:14,lineHeight:1.7}}>
                      Tell the AI what modifications you want. It will generate a new version of your data that you can download.
                    </p>
                    <textarea className="textarea" value={modifyPrompt} onChange={e=>setModifyPrompt(e.target.value)}
                      placeholder={"Examples:\n• Add a Percentage column calculated from Total/Max\n• Sort rows by the Amount column descending\n• Add 5 more rows with similar data\n• Convert all dates to DD-MMM-YYYY format\n• Add a Status column: 'High' if Amount>5000, else 'Normal'"}
                      style={{minHeight:100,fontSize:13,marginBottom:12}} />
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
                      {[
                        "Add a Total row at the bottom",
                        "Add a Percentage column",
                        "Add 10 more rows with similar data",
                        `Sort by ${analysis?.headers[1] || "Amount"} descending`,
                        "Add a Status column based on values",
                      ].map((s,i)=>(
                        <button key={i} className="chip" onClick={()=>setModifyPrompt(s)} style={{fontSize:11}}>{s}</button>
                      ))}
                    </div>
                    <button className="btn btn-blue" onClick={modifyWithAI} disabled={modifying||!modifyPrompt.trim()||!apiKey} style={{width:"100%"}}>
                      {modifying ? "⏳ AI is modifying..." : "🔄 Generate Modified Version"}
                    </button>
                  </div>

                  {modifiedData && (
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <div>
                          <h3 style={{fontSize:16,fontWeight:800}}>{modifiedData.title}</h3>
                          <p style={{color:"var(--text2)",fontSize:12}}>{modifiedData.rows?.length} rows × {modifiedData.headers?.length} columns</p>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button className="btn btn-ghost btn-sm" onClick={downloadModifiedCsv}>⬇ CSV</button>
                          <button className="btn btn-green btn-sm" onClick={downloadModifiedXlsx}>⬇ Excel (.xlsx)</button>
                        </div>
                      </div>
                      <div className="xl-wrap">
                        <table className="xl-table">
                          <thead>
                            <tr>
                              <th className="rn">#</th>
                              {modifiedData.headers?.map((h,i)=><th key={i}>{h}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {modifiedData.rows?.map((row,ri)=>(
                              <tr key={ri}>
                                <td className="rn" style={{fontSize:11,padding:"6px 10px"}}>{ri+1}</td>
                                {row.map((cell,ci)=><td key={ci}>{cell}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Insights tab */}
              {activeTab==="insights" && (
                <div>
                  <div className="card" style={{marginBottom:16}}>
                    <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>💡 Quick AI Insights</div>
                    <p style={{color:"var(--text2)",fontSize:13,marginBottom:14}}>
                      Click any insight to get AI analysis of your data.
                    </p>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {[
                        {icon:"📊", text:"Summarize this spreadsheet in 5 bullet points"},
                        {icon:"🔍", text:"What patterns or trends do you see in this data?"},
                        {icon:"⚠️", text:"What potential data quality issues do you notice?"},
                        {icon:"💡", text:"Suggest 5 useful formulas I should add to this spreadsheet"},
                        {icon:"📈", text:"If this were a report, what charts would best visualize this data?"},
                        {icon:"🧮", text:"Calculate key statistics and summarize the numeric columns"},
                        {icon:"🔄", text:"How could I restructure this data to make it more useful?"},
                        {icon:"📋", text:"Create a pivot table summary suggestion for this data"},
                      ].map((item,i)=>(
                        <button key={i} className="btn btn-ghost"
                          style={{textAlign:"left",justifyContent:"flex-start",gap:12,fontSize:13,whiteSpace:"normal",lineHeight:1.5}}
                          onClick={()=>sendAI(item.text)} disabled={aiLoading || !apiKey}>
                          <span style={{fontSize:18}}>{item.icon}</span>
                          <span>{item.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {analysis?.stats && (
                    <div className="card">
                      <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>📊 Cell Statistics</div>
                      <div className="g3">
                        {[
                          {label:"Numeric Cells",  val:analysis.stats.numericCells,  color:"var(--accent)"},
                          {label:"Text Cells",     val:analysis.stats.textCells,     color:"var(--blue)"},
                          {label:"Empty Cells",    val:analysis.stats.emptyCells,    color:"var(--text3)"},
                          {label:"Formula Cells",  val:analysis.stats.formulaCells,  color:"var(--purple)"},
                          {label:"Error Cells",    val:analysis.stats.errorCells,    color:"var(--red)"},
                          {label:"Total Formulas", val:analysis.formulas?.length||0, color:"var(--orange)"},
                        ].map(s=>(
                          <div key={s.label} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 16px",textAlign:"center"}}>
                            <div style={{fontSize:24,fontWeight:900,color:s.color}}>{s.val ?? 0}</div>
                            <div style={{fontSize:11,color:"var(--text2)",marginTop:4,fontWeight:700}}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: AI Chat */}
            <div style={{width:330,flexShrink:0}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:10,color:"var(--text2)",textTransform:"uppercase",letterSpacing:".06em"}}>
                🤖 Ask About Your File
              </div>

              <div className="chat-wrap" style={{height:400}}>
                <div className="chat-msgs" ref={chatRef}>
                  {msgs.map((m,i)=>(
                    <div key={i} className={`msg ${m.role==="user"?"user":""}`}>
                      <div className={`msg-av ${m.role}`}>{m.role==="ai"?"📗":"👤"}</div>
                      <div className={`msg-bub ${m.role==="ai"?"ai":""}`}>
                        <pre>{m.text}</pre>
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="msg">
                      <div className="msg-av ai">📗</div>
                      <div className="msg-bub ai"><div className="typing"><span/><span/><span/></div></div>
                    </div>
                  )}
                </div>
                <div className="chat-input-row">
                  <input className="input" value={input}
                    onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAI()}}}
                    placeholder={apiKey ? "Ask about your file..." : "Add your API key to chat about this file"}
                    disabled={aiLoading || !apiKey}
                    style={{fontSize:13}}
                  />
                  <button className="btn btn-green btn-sm" onClick={()=>sendAI()} disabled={aiLoading||!input.trim()||!apiKey}>
                    Ask
                  </button>
                </div>
              </div>

              {/* Quick prompts */}
              {quickPrompts.length > 0 && (
                <div style={{marginTop:12}}>
                  <div style={{fontSize:11,fontWeight:800,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>
                    Quick Questions
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {quickPrompts.map((p,i)=>(
                      <button key={i} className="btn btn-ghost btn-sm"
                        style={{textAlign:"left",justifyContent:"flex-start",fontSize:12,whiteSpace:"normal",lineHeight:1.4}}
                        onClick={()=>sendAI(p)} disabled={aiLoading || !apiKey}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Before upload help */}
      {!analysis && !uploading && (
        <div style={{marginTop:24}}>
          <div className="g2" style={{marginBottom:16}}>
            <div className="card card-g">
              <div style={{fontWeight:800,marginBottom:10,fontSize:15}}>✅ What This Tool Does</div>
              <ul style={{color:"var(--text2)",fontSize:13,lineHeight:2.2,paddingLeft:18}}>
                <li>Reads your Excel file and shows a data preview</li>
                <li>Detects formula errors like #REF!, #DIV/0!, #VALUE!</li>
                <li>Lists all formulas used in your spreadsheet</li>
                <li>Gives AI-powered explanations and fix suggestions</li>
                <li>Lets you ask questions about YOUR specific data</li>
                <li>Suggests useful formulas for your column names</li>
              </ul>
            </div>
            <div className="card card-b">
              <div style={{fontWeight:800,marginBottom:10,fontSize:15}}>💡 How to Use</div>
              <div style={{fontSize:13,color:"var(--text2)",lineHeight:2.2}}>
                1️⃣ Upload your .xlsx or .csv file<br/>
                2️⃣ Check the <b style={{color:"var(--text)"}}>Data Preview</b> tab<br/>
                3️⃣ Check <b style={{color:"var(--red)"}}>Issues</b> tab for any errors<br/>
                4️⃣ Click <b style={{color:"var(--text)"}}>🤖 Fix with AI</b> on any error<br/>
                5️⃣ Use <b style={{color:"var(--blue)"}}>🔄 Modify & Export</b> to transform data<br/>
                6️⃣ Check <b style={{color:"var(--purple)"}}>💡 AI Insights</b> for smart analysis
              </div>
            </div>
          </div>
          <div className="g2">
            <div className="card card-y">
              <div style={{fontWeight:800,marginBottom:10,fontSize:15}}>🔄 Modify & Export (NEW)</div>
              <div style={{fontSize:13,color:"var(--text2)",lineHeight:2.2}}>
                After uploading, use the <b style={{color:"var(--text)"}}>Modify & Export</b> tab to:<br/>
                • Add new columns with calculated values<br/>
                • Sort or filter your data differently<br/>
                • Add more rows with similar patterns<br/>
                • Transform and download as .xlsx or .csv<br/>
                • AI understands your data context automatically
              </div>
            </div>
            <div className="card" style={{borderColor:"rgba(188,140,255,.3)",background:"rgba(188,140,255,.05)"}}>
              <div style={{fontWeight:800,marginBottom:10,fontSize:15}}>📂 Supported Formats</div>
              <div style={{fontSize:13,color:"var(--text2)",lineHeight:2.2}}>
                • <b style={{color:"var(--text)"}}>.xlsx</b> — Modern Excel files (recommended)<br/>
                • <b style={{color:"var(--text)"}}>.xls</b> — Legacy Excel 97-2003 files<br/>
                • <b style={{color:"var(--text)"}}>.csv</b> — Comma-separated values<br/>
                • Maximum file size: <b style={{color:"var(--text)"}}>10 MB</b><br/>
                • All sheets are detected — you can switch between them
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
