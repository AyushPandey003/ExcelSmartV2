import { useState } from "react";

const MODULES = [
  {
    id: "basics", icon: "🖥️", title: "Excel Basics", badge: "b-green", badgeText: "Start Here",
    lessons: [
      {
        title: "What is Microsoft Excel?",
        content: `📗 Excel is a program made by Microsoft that lets you:
• Store data in rows and columns (like a table)
• Do math automatically
• Make charts and graphs
• Create budgets, lists, and trackers

🧱 Think of it like a very smart notebook made of boxes.

Each box is called a CELL. You can type numbers, words, or formulas in cells.

When did you use lists or tables in real life? That's what Excel does — but smarter!`,
        formula: null,
        quiz: {
          q: "What is a cell in Excel?",
          opts: ["A battery that powers Excel", "A single box where you type data", "A type of mobile phone", "A row of numbers"],
          ans: 1,
        },
      },
      {
        title: "Rows, Columns & Cells",
        content: `📏 Excel is made of a grid:

↔️ ROWS go sideways (left to right): Row 1, Row 2, Row 3...
↕️ COLUMNS go up and down: Column A, Column B, Column C...
📦 A CELL is where a row and column meet.

Example:
• Cell A1 = Column A, Row 1
• Cell B3 = Column B, Row 3
• Cell C5 = Column C, Row 5

🖱️ To select a cell, just click on it. You'll see its name (like "A1") in the top-left box called the Name Box.

Try it: Click on any cell and look at the Name Box!`,
        formula: null,
        quiz: {
          q: "What is the name of the cell at Column B, Row 4?",
          opts: ["4B", "B-4", "B4", "Row4ColB"],
          ans: 2,
        },
      },
      {
        title: "Typing & Editing Data",
        content: `✍️ To type in a cell:
1. Click the cell
2. Start typing
3. Press ENTER to confirm, or ESC to cancel

📝 To edit a cell you already typed:
• Double-click it, OR
• Press F2 key

🗑️ To delete: Click the cell → press DELETE key

✅ Useful keys:
• TAB → move to the next cell on the right
• ENTER → move down to the next row
• Arrow keys → move around

💡 Excel shows what you type in the Formula Bar (the long bar at the top).`,
        formula: null,
        quiz: {
          q: "Which key confirms what you typed in a cell?",
          opts: ["F1", "CTRL", "ENTER", "BACKSPACE"],
          ans: 2,
        },
      },
    ],
  },
  {
    id: "format", icon: "🎨", title: "Formatting", badge: "b-blue", badgeText: "Beginner",
    lessons: [
      {
        title: "Making Text Bold, Italic & Big",
        content: `✨ Formatting makes your spreadsheet easier to read!

Select a cell, then use these shortcuts:
• CTRL + B → Bold (makes text thick)
• CTRL + I → Italic (makes text lean)
• CTRL + U → Underline

🔡 To change font size:
• Look for the number "11" in the toolbar → click it → type a bigger number → press ENTER

🎨 To change text color:
• Click the A with a colored bar under it → pick a color

📌 TIP: Always make your header row (Row 1) Bold so it stands out!`,
        formula: null,
        quiz: {
          q: "Which shortcut makes text Bold?",
          opts: ["CTRL + I", "CTRL + U", "CTRL + B", "CTRL + T"],
          ans: 2,
        },
      },
      {
        title: "Formatting Numbers & Currency",
        content: `💰 Excel can display numbers in many formats:

To format a number:
1. Select the cell(s)
2. Right-click → Format Cells → Number tab

Common formats:
• Number → 1234.56 (plain number)
• Currency → ₹1,234.56 (money with symbol)
• Percentage → 85% (for scores, rates)
• Date → 01/01/2024

⚡ Quick way: Look in the toolbar for the $ % , buttons!

💡 Pro tip: Always format money columns as Currency — it adds the ₹ symbol automatically and makes it easier to read.`,
        formula: null,
        quiz: {
          q: "Which format should you use for salary amounts?",
          opts: ["Text", "Percentage", "Currency", "Date"],
          ans: 2,
        },
      },
    ],
  },
  {
    id: "formulas", icon: "𝑓𝑥", title: "Formulas", badge: "b-purple", badgeText: "Core Skill",
    lessons: [
      {
        title: "Your First Formula: SUM",
        content: `🎉 A formula in Excel starts with = (equals sign).

=SUM() adds up numbers!

Example:
• You have sales data in cells B2 to B8
• In an empty cell, type:`,
        formula: "=SUM(B2:B8)",
        formulaNote: "This adds every number from B2 to B8!",
        content2: `
The : (colon) means "from B2 to B8" — it's a range.

Other ways to use SUM:
• =SUM(10, 20, 30) → adds those 3 numbers = 60
• =SUM(A1, B1, C1) → adds 3 specific cells

💡 Click a cell, type =SUM(, then drag to select your numbers, then type ) and press ENTER!`,
        quiz: {
          q: "What does =SUM(A1:A5) do?",
          opts: ["Counts cells A1 to A5", "Adds all numbers in A1 to A5", "Finds the biggest number", "Multiplies A1 and A5"],
          ans: 1,
        },
      },
      {
        title: "AVERAGE, MIN & MAX",
        content: `📊 More useful formulas:

AVERAGE — finds the middle value:`,
        formula: "=AVERAGE(B2:B10)",
        formulaNote: "Adds all numbers then divides by how many there are",
        content2: `
MIN — finds the smallest number:`,
        formula2: "=MIN(B2:B10)",
        formulaNote2: "Useful for: lowest price, minimum score",
        content3: `
MAX — finds the biggest number:`,
        formula3: "=MAX(B2:B10)",
        formulaNote3: "Useful for: highest sale, maximum temperature",
        content4: `
💡 Real example: If your students scored 70, 85, 90, 55, 88 in column C:
• =AVERAGE(C2:C6) → 77.6
• =MIN(C2:C6) → 55
• =MAX(C2:C6) → 90`,
        quiz: {
          q: "Which formula gives you the highest number in a range?",
          opts: ["=AVERAGE()", "=MIN()", "=TOP()", "=MAX()"],
          ans: 3,
        },
      },
      {
        title: "The IF Formula",
        content: `🤔 IF checks a condition and gives different results:`,
        formula: '=IF(condition, "if true", "if false")',
        formulaNote: "If the condition is met → first answer. Otherwise → second answer.",
        content2: `
Real examples:

✅ Pass/Fail based on marks (pass = 40+):`,
        formula2: '=IF(B2>=40, "Pass", "Fail")',
        formulaNote2: "If B2 is 40 or more → shows Pass, otherwise Fail",
        content3: `
💰 Check if over budget:`,
        formula3: '=IF(C2>5000, "Over Budget", "OK")',
        formulaNote3: "If C2 is more than 5000 → shows Over Budget",
        quiz: {
          q: 'What does =IF(A1>10, "Big", "Small") return when A1 = 15?',
          opts: ["Small", "15", "Big", "Error"],
          ans: 2,
        },
      },
    ],
  },
  {
    id: "data", icon: "📋", title: "Working with Data", badge: "b-orange", badgeText: "Intermediate",
    lessons: [
      {
        title: "Sorting Your Data",
        content: `📶 Sorting arranges your data in order — A to Z, or smallest to biggest.

To sort:
1. Click anywhere inside your data
2. Click Data tab (top menu)
3. Click Sort A to Z (alphabetical) or Sort Z to A

Or sort by number:
• Sort Smallest to Largest (lowest first)
• Sort Largest to Smallest (highest first)

💡 Example: You have a list of employees and salaries. Sort by salary — largest to smallest — to quickly see who earns the most!

⚠️ TIP: Always include your header row (row 1) in the selection. Excel is smart — it usually detects it.`,
        formula: null,
        quiz: {
          q: "What tab in Excel do you click to sort data?",
          opts: ["Home", "Insert", "Data", "View"],
          ans: 2,
        },
      },
      {
        title: "Filtering Your Data",
        content: `🔍 Filter hides rows you don't need so you can focus on what matters.

To add filters:
1. Click any cell in your data
2. Click Data tab → Filter (or press CTRL+SHIFT+L)
3. Dropdown arrows appear on your headers
4. Click an arrow → choose what to show

Example: You have 100 orders. You only want to see orders from "Mumbai":
• Click the City column dropdown → uncheck "Select All" → check "Mumbai" → Click OK

Only Mumbai orders show. The rest are hidden (not deleted!)

To remove filter: Click Data → Filter again (toggle off).`,
        formula: null,
        quiz: {
          q: "When you filter data, what happens to the hidden rows?",
          opts: ["They are deleted", "They are hidden but still there", "They move to Sheet 2", "They are colored red"],
          ans: 1,
        },
      },
    ],
  },
];

export default function LearnExcel() {
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [done, setDone] = useState({});
  const [quizAnswer, setQuizAnswer] = useState(null);

  const allLessons = MODULES.flatMap((m) => m.lessons).length;
  const doneCount = Object.keys(done).length;

  function openLesson(modId, lessonIdx) {
    setActiveModule(modId);
    setActiveLesson(lessonIdx);
    setQuizAnswer(null);
  }

  function markDone() {
    const key = `${activeModule}-${activeLesson}`;
    setDone((d) => ({ ...d, [key]: true }));
    const mod = MODULES.find((m) => m.id === activeModule);
    if (mod && activeLesson < mod.lessons.length - 1) {
      setActiveLesson((l) => l + 1);
      setQuizAnswer(null);
    }
  }

  function isDone(modId, idx) {
    return !!done[`${modId}-${idx}`];
  }

  if (activeModule) {
    const mod = MODULES.find((m) => m.id === activeModule);
    const lesson = mod.lessons[activeLesson];
    const quiz = lesson.quiz;
    const isCorrect = quizAnswer === quiz.ans;

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setActiveModule(null)}>← All Modules</button>
          <span style={{ color: "var(--text2)", fontSize: 14 }}>{mod.icon} {mod.title}</span>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {/* Lesson list */}
          <div style={{ width: 210, flexShrink: 0 }}>
            <div className="card">
              <div className="label" style={{ marginBottom: 10 }}>Lessons</div>
              {mod.lessons.map((l, i) => (
                <div
                  key={i}
                  className={`step-row ${i === activeLesson ? "active" : ""} ${isDone(mod.id, i) ? "done" : ""}`}
                  onClick={() => { setActiveLesson(i); setQuizAnswer(null); }}
                >
                  <div className={`step-num ${i === activeLesson ? "active" : isDone(mod.id, i) ? "done" : ""}`}>
                    {isDone(mod.id, i) ? "✓" : i + 1}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{l.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lesson content */}
          <div style={{ flex: 1 }}>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900 }}>{lesson.title}</h2>
                <span className="badge b-green">Lesson {activeLesson + 1}</span>
              </div>
              <div className="divider" />

              <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 2, marginBottom: 10 }}>
                {lesson.content}
              </pre>

              {lesson.formula && (
                <div>
                  <div className="formula-box">{lesson.formula}</div>
                  <div style={{ fontSize: 13, color: "var(--accent2)", marginBottom: 10 }}>💡 {lesson.formulaNote}</div>
                </div>
              )}

              {lesson.content2 && (
                <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 2, marginBottom: 10 }}>{lesson.content2}</pre>
              )}
              {lesson.formula2 && (
                <div>
                  <div className="formula-box">{lesson.formula2}</div>
                  <div style={{ fontSize: 13, color: "var(--accent2)", marginBottom: 10 }}>💡 {lesson.formulaNote2}</div>
                </div>
              )}
              {lesson.content3 && (
                <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 2, marginBottom: 10 }}>{lesson.content3}</pre>
              )}
              {lesson.formula3 && (
                <div>
                  <div className="formula-box">{lesson.formula3}</div>
                  <div style={{ fontSize: 13, color: "var(--accent2)", marginBottom: 10 }}>💡 {lesson.formulaNote3}</div>
                </div>
              )}
              {lesson.content4 && (
                <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 2, marginBottom: 10 }}>{lesson.content4}</pre>
              )}

              <div className="divider" />

              {/* Quiz */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>🧠 Quick Quiz: {quiz.q}</div>
                {quiz.opts.map((opt, i) => (
                  <button
                    key={i}
                    className={`quiz-opt ${quizAnswer !== null ? (i === quiz.ans ? "correct" : quizAnswer === i ? "wrong" : "") : ""}`}
                    onClick={() => { if (quizAnswer === null) setQuizAnswer(i); }}
                    disabled={quizAnswer !== null}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                ))}
                {quizAnswer !== null && (
                  <div style={{
                    marginTop: 10, padding: "12px 16px", borderRadius: 10, fontSize: 14,
                    background: isCorrect ? "rgba(45,186,115,0.1)" : "rgba(255,123,114,0.1)",
                    border: `1px solid ${isCorrect ? "rgba(45,186,115,0.3)" : "rgba(255,123,114,0.3)"}`,
                    color: isCorrect ? "var(--accent)" : "var(--red)",
                    fontWeight: 700,
                  }}>
                    {isCorrect ? "✅ Correct! Great job!" : `❌ Not quite. The answer is: ${quiz.opts[quiz.ans]}`}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                {activeLesson > 0 && (
                  <button className="btn btn-ghost" onClick={() => { setActiveLesson(l => l - 1); setQuizAnswer(null); }}>
                    ← Previous
                  </button>
                )}
                <button className="btn btn-green" style={{ marginLeft: "auto" }} onClick={markDone}>
                  {activeLesson < mod.lessons.length - 1 ? "Next Lesson →" : "✅ Complete Module!"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>📚 Excel Lessons</h1>
        <p>Learn Excel from zero — one small, simple lesson at a time. Each lesson has a quiz to check your understanding!</p>
      </div>

      {doneCount > 0 && (
        <div className="card card-green" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 36 }}>🏆</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800 }}>Your Progress: {doneCount}/{allLessons} lessons done!</div>
            <div className="prog-bar" style={{ marginTop: 8 }}>
              <div className="prog-fill" style={{ width: `${(doneCount / allLessons) * 100}%` }} />
            </div>
          </div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "var(--accent)" }}>{Math.round((doneCount / allLessons) * 100)}%</div>
        </div>
      )}

      <div className="g2">
        {MODULES.map((mod) => {
          const doneMod = mod.lessons.filter((_, i) => isDone(mod.id, i)).length;
          return (
            <div key={mod.id} className="card" style={{ cursor: "pointer" }}
              onClick={() => openLesson(mod.id, 0)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 34 }}>{mod.icon}</div>
                <span className={`badge ${mod.badge}`}>{mod.badgeText}</span>
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, marginBottom: 8 }}>{mod.title}</h3>
              <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 14 }}>
                {mod.lessons.length} lessons
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {mod.lessons.map((l, i) => (
                  <span key={i} style={{
                    fontSize: 12, padding: "3px 10px",
                    background: isDone(mod.id, i) ? "rgba(45,186,115,0.2)" : "var(--bg3)",
                    color: isDone(mod.id, i) ? "var(--accent)" : "var(--text2)",
                    border: `1px solid ${isDone(mod.id, i) ? "rgba(45,186,115,0.3)" : "var(--border)"}`,
                    borderRadius: 99,
                  }}>
                    {isDone(mod.id, i) ? "✓ " : ""}{l.title}
                  </span>
                ))}
              </div>
              <div className="prog-bar">
                <div className="prog-fill" style={{ width: `${(doneMod / mod.lessons.length) * 100}%` }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>
                {doneMod}/{mod.lessons.length} completed
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
