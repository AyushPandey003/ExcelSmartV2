import { useState, useRef, useEffect } from "react";

const SYSTEM = `You are "ExcelBot" — a friendly, patient AI tutor who ONLY helps people learn Microsoft Excel.
Users are beginners. RULES:
- Only answer Excel questions. If asked anything else, gently redirect.
- Use VERY simple language.
- Always give a real Excel formula when relevant, using =formula() syntax.
- Use emojis and short bullet points.
- Keep answers to 4-6 lines max, then offer to go deeper.
- Be warm, encouraging, never condescending.
- If they describe a problem, give the exact formula to solve it.
- End most answers with a follow-up offer.`;

const SUGGESTIONS = [
  "What is a cell in Excel? 📦",
  "How do I add numbers in a column? ➕",
  "What does the SUM formula do? 𝑓𝑥",
  "How do I make a budget spreadsheet? 💰",
  "What is VLOOKUP and when do I use it? 🔍",
  "How do I make a chart from my data? 📈",
  "How do I freeze the top row? 🔒",
  "What does #REF! error mean? ❌",
  "How do I use COUNTIF? 🔢",
  "What is the difference between SUM and SUMIF? ➕",
];

export default function AskExcel() {
  const [msgs, setMsgs] = useState([{
    role:"ai",
    text:"👋 Hi! I'm ExcelBot — your personal Excel tutor!\n\nI can help you:\n• Learn Excel from scratch 📚\n• Understand formulas 𝑓𝑥\n• Fix errors in your spreadsheet ❌\n• Build budgets, trackers, and more 📊\n\nWhat Excel question do you have today? 😊",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  async function send(text) {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    setMsgs(m=>[...m,{role:"user",text:q}]);
    setLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_KEY || "";
    try {
      const history = msgs.map(m=>({ role:m.role==="ai"?"model":"user", parts:[{text:m.text}] }));
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents:[...history,{role:"user", parts:[{text:q}]}]
        }),
      });
      const d = await res.json();
      const reply = d.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, try again!";
      setMsgs(m=>[...m,{role:"ai",text:reply}]);
    } catch { setMsgs(m=>[...m,{role:"ai",text:"😔 Connection error. Please try again!"}]); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div className="ph">
        <h1>🤖 Ask ExcelBot</h1>
        <p>Ask any Excel question in plain, simple words — I'll explain it like a friendly teacher with real formulas!</p>
      </div>

      <div style={{display:"flex",gap:20}}>
        <div style={{flex:1,minWidth:0}}>
          <div className="chat-wrap">
            <div className="chat-msgs">
              {msgs.map((m,i)=>(
                <div key={i} className={`msg ${m.role==="user"?"user":""}`}>
                  <div className={`msg-av ${m.role}`}>{m.role==="ai"?"📗":"👤"}</div>
                  <div className={`msg-bub ${m.role==="ai"?"ai":""}`}><pre>{m.text}</pre></div>
                </div>
              ))}
              {loading&&<div className="msg"><div className="msg-av ai">📗</div><div className="msg-bub ai"><div className="typing"><span/><span/><span/></div></div></div>}
              <div ref={bottomRef}/>
            </div>
            <div className="chat-input-row">
              <input className="input" value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}}
                placeholder="Ask any Excel question..." disabled={loading}/>
              <button className="btn btn-green" onClick={()=>send()} disabled={loading||!input.trim()}>Ask 🚀</button>
            </div>
          </div>
        </div>

        <div style={{width:210,flexShrink:0}}>
          <div className="card" style={{marginBottom:14}}>
            <div className="label" style={{marginBottom:10}}>💡 Try Asking</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {SUGGESTIONS.map(s=>(
                <button key={s} className="btn btn-ghost btn-sm"
                  style={{textAlign:"left",justifyContent:"flex-start",fontSize:12,whiteSpace:"normal",lineHeight:1.4}}
                  onClick={()=>send(s)} disabled={loading}>{s}</button>
              ))}
            </div>
          </div>
          <div className="card card-g">
            <div style={{fontSize:12,fontWeight:800,color:"var(--accent)",marginBottom:8}}>🎯 TIPS</div>
            <ul style={{fontSize:12,color:"var(--text2)",lineHeight:2,paddingLeft:14}}>
              <li>Ask in simple words</li>
              <li>Describe your data</li>
              <li>Say what you want to do</li>
              <li>Ask "show me an example"</li>
              <li>Upload a file for specific help</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
