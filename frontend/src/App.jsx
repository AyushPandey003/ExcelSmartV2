import { useState } from "react";
import Dashboard    from "./pages/Dashboard";
import AskExcel     from "./pages/AskExcel";
import LearnExcel   from "./pages/LearnExcel";
import ExcelGen     from "./pages/ExcelGen";
import FormulasRef  from "./pages/FormulasRef";
import UploadAnalyze from "./pages/UploadAnalyze";
import "./styles.css";

const NAV = [
  { section: "Learn Excel", items: [
    { id: "dashboard", ni: "🏠", label: "Home" },
    { id: "learn",     ni: "📚", label: "Lessons", badge: "12" },
    { id: "formulas",  ni: "𝑓𝑥", label: "Formula Guide" },
  ]},
  { section: "AI Tools", items: [
    { id: "ask",     ni: "🤖", label: "Ask ExcelBot" },
    { id: "excel",   ni: "📊", label: "Generate Excel" },
    { id: "upload",  ni: "📂", label: "Upload & Analyze", badge: "NEW" },
  ]},
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-ic">📗</div>
          <div>
            <div className="logo-name">ExcelSmart</div>
            <div className="logo-sub">AI Excel Tutor v2</div>
          </div>
        </div>
        <nav>
          {NAV.map(s => (
            <div className="nav-sec" key={s.section}>
              <div className="nav-sec-title">{s.section}</div>
              {s.items.map(n => (
                <button key={n.id} className={`nb ${page===n.id?"active":""}`} onClick={() => setPage(n.id)}>
                  <span className="ni">{n.ni}</span>
                  <span>{n.label}</span>
                  {n.badge && <span className="nbadge">{n.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sb-bottom">
          <div>🎓 Learn Excel step by step</div>
          <div>⚡ EPPlus NonCommercial</div>
          <div>🤖 Claude AI powered</div>
        </div>
      </aside>
      <main className="main">
        {page === "dashboard" && <Dashboard onNavigate={setPage} />}
        {page === "learn"     && <LearnExcel />}
        {page === "ask"       && <AskExcel />}
        {page === "excel"     && <ExcelGen />}
        {page === "formulas"  && <FormulasRef />}
        {page === "upload"    && <UploadAnalyze />}
      </main>
    </div>
  );
}
