export default function Dashboard({ onNavigate }) {
  const stats = [
    { icon:"📚", label:"Lessons",    val:"12",  color:"#2dba73", bg:"rgba(45,186,115,.15)" },
    { icon:"𝑓𝑥", label:"Formulas",   val:"40+", color:"#58a6ff", bg:"rgba(88,166,255,.15)" },
    { icon:"🤖", label:"AI Tutor",   val:"24/7",color:"#bc8cff", bg:"rgba(188,140,255,.15)" },
    { icon:"📂", label:"File Analyzer",val:"NEW",color:"#f0883e", bg:"rgba(240,136,62,.15)" },
  ];

  const features = [
    { id:"learn",   icon:"📚", title:"Step-by-Step Lessons",    badge:"b-g", bt:"12 Lessons",
      desc:"Learn Excel from scratch — cells, formulas, sorting, filtering — one tiny step at a time with quizzes.",
      color:"var(--accent)" },
    { id:"ask",     icon:"🤖", title:"Ask ExcelBot (AI)",        badge:"b-p", bt:"AI Powered",
      desc:"Ask any Excel question in plain words. The AI replies simply with real formulas and examples.",
      color:"var(--purple)" },
    { id:"excel",   icon:"📊", title:"Generate Excel Files",     badge:"b-o", bt:"EPPlus + Charts",
      desc:"Pick a template, AI fills the data, backend builds a real .xlsx with charts, totals and formatting.",
      color:"var(--orange)" },
    { id:"upload",  icon:"📂", title:"Upload & Analyze",         badge:"b-b", bt:"NEW ✨",
      desc:"Upload your own Excel file. AI detects formula errors, explains them, lets you ask questions about your data.",
      color:"var(--blue)" },
    { id:"formulas",icon:"𝑓𝑥", title:"Formula Reference",        badge:"b-y", bt:"40+ Formulas",
      desc:"Searchable guide to every essential Excel formula — plain-English explanations with real examples.",
      color:"var(--yellow)" },
  ];

  return (
    <div>
      <div className="ph">
        <h1>📗 Welcome to ExcelSmart v2!</h1>
        <p>Your friendly AI tutor for Microsoft Excel — learn, generate, upload, analyze, and ask anything!</p>
      </div>

      <div className="g4" style={{marginBottom:28}}>
        {stats.map(s => (
          <div className="stat" key={s.label}>
            <div className="stat-ic" style={{background:s.bg,color:s.color}}>{s.icon}</div>
            <div><div className="stat-val" style={{color:s.color}}>{s.val}</div><div className="stat-lbl">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="g2" style={{marginBottom:20}}>
        {features.map(f => (
          <div key={f.id} className="card" style={{cursor:"pointer",transition:"all .2s",borderColor:"transparent"}}
            onClick={() => onNavigate(f.id)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=f.color;e.currentTarget.style.transform="translateY(-3px)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.transform="none"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{fontSize:34}}>{f.icon}</div>
              <span className={`badge ${f.badge}`}>{f.bt}</span>
            </div>
            <h3 style={{fontSize:16,fontWeight:800,marginBottom:7}}>{f.title}</h3>
            <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.7,marginBottom:14}}>{f.desc}</p>
            <button className="btn btn-ghost btn-sm" style={{width:"100%"}}>Open →</button>
          </div>
        ))}
      </div>

      <div className="card card-g">
        <div style={{fontWeight:800,marginBottom:8,fontSize:15}}>💡 Where should I start?</div>
        <div style={{color:"var(--text2)",fontSize:13,lineHeight:2.2}}>
          <b style={{color:"var(--text)"}}>Brand new to Excel?</b> → <span style={{color:"var(--accent)",cursor:"pointer",fontWeight:700}} onClick={()=>onNavigate("learn")}>📚 Start Lessons</span><br/>
          <b style={{color:"var(--text)"}}>Have a question?</b> → <span style={{color:"var(--purple)",cursor:"pointer",fontWeight:700}} onClick={()=>onNavigate("ask")}>🤖 Ask ExcelBot</span><br/>
          <b style={{color:"var(--text)"}}>Need a spreadsheet?</b> → <span style={{color:"var(--orange)",cursor:"pointer",fontWeight:700}} onClick={()=>onNavigate("excel")}>📊 Generate Excel</span><br/>
          <b style={{color:"var(--text)"}}>Got an existing file?</b> → <span style={{color:"var(--blue)",cursor:"pointer",fontWeight:700}} onClick={()=>onNavigate("upload")}>📂 Upload & Analyze</span>
        </div>
      </div>
    </div>
  );
}
