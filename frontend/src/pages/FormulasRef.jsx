import { useState } from "react";

const FORMULAS = [
  // MATH
  { cat: "Math", name: "SUM", syntax: "=SUM(A1:A10)", desc: "Adds all numbers in a range", example: "=SUM(B2:B8) → Total of B2 to B8", level: "beginner" },
  { cat: "Math", name: "AVERAGE", syntax: "=AVERAGE(A1:A10)", desc: "Finds the average (mean) of numbers", example: "=AVERAGE(C2:C20) → Average score", level: "beginner" },
  { cat: "Math", name: "MIN", syntax: "=MIN(A1:A10)", desc: "Returns the smallest number", example: "=MIN(D2:D50) → Lowest price", level: "beginner" },
  { cat: "Math", name: "MAX", syntax: "=MAX(A1:A10)", desc: "Returns the largest number", example: "=MAX(D2:D50) → Highest price", level: "beginner" },
  { cat: "Math", name: "COUNT", syntax: "=COUNT(A1:A10)", desc: "Counts how many cells have numbers", example: "=COUNT(B2:B100) → How many entries", level: "beginner" },
  { cat: "Math", name: "COUNTA", syntax: "=COUNTA(A1:A10)", desc: "Counts cells that are not empty", example: "=COUNTA(A2:A200) → Count all rows", level: "beginner" },
  { cat: "Math", name: "ROUND", syntax: "=ROUND(number, digits)", desc: "Rounds a number to set decimal places", example: "=ROUND(3.14159, 2) → 3.14", level: "beginner" },
  { cat: "Math", name: "ABS", syntax: "=ABS(number)", desc: "Returns absolute (positive) value", example: "=ABS(-50) → 50", level: "beginner" },
  { cat: "Math", name: "SUMIF", syntax: "=SUMIF(range, condition, sum_range)", desc: "Adds numbers that meet a condition", example: '=SUMIF(A:A,"Mumbai",B:B) → Sum only Mumbai rows', level: "intermediate" },
  { cat: "Math", name: "COUNTIF", syntax: "=COUNTIF(range, condition)", desc: "Counts cells that meet a condition", example: '=COUNTIF(C:C,"Pass") → Count all Pass marks', level: "intermediate" },
  // LOGIC
  { cat: "Logic", name: "IF", syntax: '=IF(condition, "true", "false")', desc: "Shows one result if true, another if false", example: '=IF(B2>=40,"Pass","Fail")', level: "beginner" },
  { cat: "Logic", name: "AND", syntax: "=AND(cond1, cond2)", desc: "True only if ALL conditions are met", example: "=AND(A1>0, B1>0) → Both must be positive", level: "intermediate" },
  { cat: "Logic", name: "OR", syntax: "=OR(cond1, cond2)", desc: "True if ANY condition is met", example: '=OR(A1="Yes", B1="Yes")', level: "intermediate" },
  { cat: "Logic", name: "NOT", syntax: "=NOT(condition)", desc: "Reverses true to false or false to true", example: '=NOT(A1="")  → True if A1 is not empty', level: "intermediate" },
  { cat: "Logic", name: "IFERROR", syntax: "=IFERROR(formula, value_if_error)", desc: "Shows a custom message if formula gives error", example: '=IFERROR(A1/B1, "Cannot divide") → Handles divide by zero', level: "intermediate" },
  // TEXT
  { cat: "Text", name: "UPPER", syntax: "=UPPER(text)", desc: "Converts text to ALL CAPS", example: '=UPPER("hello") → HELLO', level: "beginner" },
  { cat: "Text", name: "LOWER", syntax: "=LOWER(text)", desc: "Converts text to all lowercase", example: '=LOWER("HELLO") → hello', level: "beginner" },
  { cat: "Text", name: "PROPER", syntax: "=PROPER(text)", desc: "Capitalizes first letter of each word", example: '=PROPER("john doe") → John Doe', level: "beginner" },
  { cat: "Text", name: "LEN", syntax: "=LEN(text)", desc: "Counts how many characters are in text", example: "=LEN(\"Hello\") → 5", level: "beginner" },
  { cat: "Text", name: "TRIM", syntax: "=TRIM(text)", desc: "Removes extra spaces from text", example: '=TRIM("  Hello  ") → Hello', level: "beginner" },
  { cat: "Text", name: "CONCATENATE", syntax: "=CONCATENATE(A1, \" \", B1)", desc: "Joins text from multiple cells", example: '=CONCATENATE(A1," ",B1) → Full Name', level: "intermediate" },
  { cat: "Text", name: "LEFT", syntax: "=LEFT(text, n)", desc: "Gets first N characters from text", example: '=LEFT("INV-001", 3) → INV', level: "intermediate" },
  { cat: "Text", name: "RIGHT", syntax: "=RIGHT(text, n)", desc: "Gets last N characters from text", example: '=RIGHT("INV-001", 3) → 001', level: "intermediate" },
  { cat: "Text", name: "MID", syntax: "=MID(text, start, length)", desc: "Gets characters from the middle of text", example: '=MID("ABCDEF", 2, 3) → BCD', level: "advanced" },
  // LOOKUP
  { cat: "Lookup", name: "VLOOKUP", syntax: "=VLOOKUP(what, table, col, 0)", desc: "Looks up a value in a table and returns info from another column", example: "=VLOOKUP(A2, D:F, 2, 0) → Find A2 in table D:F, return column 2", level: "intermediate" },
  { cat: "Lookup", name: "HLOOKUP", syntax: "=HLOOKUP(what, table, row, 0)", desc: "Like VLOOKUP but looks across rows instead of columns", example: "=HLOOKUP(A1, B1:F3, 2, 0)", level: "intermediate" },
  { cat: "Lookup", name: "INDEX", syntax: "=INDEX(range, row, col)", desc: "Returns the value at a specific row and column", example: "=INDEX(A1:C10, 3, 2) → Row 3, Column 2", level: "advanced" },
  { cat: "Lookup", name: "MATCH", syntax: "=MATCH(value, range, 0)", desc: "Returns the position of a value in a list", example: '=MATCH("Apple", A:A, 0) → Row number of Apple', level: "advanced" },
  // DATE
  { cat: "Date", name: "TODAY", syntax: "=TODAY()", desc: "Returns today's date (updates daily)", example: "=TODAY() → Shows current date", level: "beginner" },
  { cat: "Date", name: "NOW", syntax: "=NOW()", desc: "Returns current date and time", example: "=NOW() → Shows date + time", level: "beginner" },
  { cat: "Date", name: "DAY", syntax: "=DAY(date)", desc: "Gets the day number from a date", example: "=DAY(A1) → If A1 is 15-Jan-2024, returns 15", level: "beginner" },
  { cat: "Date", name: "MONTH", syntax: "=MONTH(date)", desc: "Gets the month number from a date", example: "=MONTH(A1) → Returns 1 for January", level: "beginner" },
  { cat: "Date", name: "YEAR", syntax: "=YEAR(date)", desc: "Gets the year from a date", example: "=YEAR(A1) → Returns 2024", level: "beginner" },
  { cat: "Date", name: "DATEDIF", syntax: '=DATEDIF(start, end, "Y")', desc: "Calculates difference between two dates", example: '=DATEDIF(A1, TODAY(), "Y") → Age in years', level: "intermediate" },
];

const CATS = ["All", "Math", "Logic", "Text", "Lookup", "Date"];
const LEVELS = ["All Levels", "beginner", "intermediate", "advanced"];
const LEVEL_COLORS = { beginner: "b-green", intermediate: "b-blue", advanced: "b-purple" };
const CAT_COLORS = { Math: "b-orange", Logic: "b-purple", Text: "b-blue", Lookup: "b-green", Date: "b-red" };

export default function FormulasRef() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All Levels");
  const [expanded, setExpanded] = useState(null);

  const filtered = FORMULAS.filter((f) => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || f.cat === cat;
    const matchLevel = level === "All Levels" || f.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  return (
    <div>
      <div className="page-header">
        <h1>𝑓𝑥 Formula Reference Guide</h1>
        <p>A beginner-friendly guide to Excel formulas — plain English explanations with real examples. Click any formula to expand it!</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="input"
            style={{ maxWidth: 240 }}
            placeholder="🔍 Search formulas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATS.map((c) => (
              <button key={c} className={`chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <select className="select" style={{ maxWidth: 160 }} value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
          <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--text2)" }}>
            {filtered.length} formulas
          </div>
        </div>
      </div>

      {/* Formula cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((f) => {
          const isOpen = expanded === f.name;
          return (
            <div
              key={f.name}
              className="card"
              style={{
                cursor: "pointer",
                borderColor: isOpen ? "rgba(45,186,115,0.4)" : "var(--border)",
                background: isOpen ? "rgba(45,186,115,0.04)" : "var(--card)",
                transition: "all 0.15s",
              }}
              onClick={() => setExpanded(isOpen ? null : f.name)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  fontFamily: "'Fira Code', monospace", fontSize: 15, fontWeight: 700,
                  color: "var(--accent)", minWidth: 100,
                }}>
                  {f.name}
                </div>
                <span className={`badge ${CAT_COLORS[f.cat]}`}>{f.cat}</span>
                <span className={`badge ${LEVEL_COLORS[f.level]}`}>{f.level}</span>
                <div style={{ color: "var(--text2)", fontSize: 13, flex: 1 }}>{f.desc}</div>
                <div style={{ color: "var(--text3)", fontSize: 16 }}>{isOpen ? "▲" : "▼"}</div>
              </div>

              {isOpen && (
                <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                  <div className="label" style={{ marginBottom: 6 }}>Syntax</div>
                  <div className="formula-box" style={{ marginBottom: 14 }}>{f.syntax}</div>

                  <div className="label" style={{ marginBottom: 6 }}>Real Example</div>
                  <div className="formula-box" style={{ color: "var(--accent2)" }}>{f.example}</div>

                  <div style={{ marginTop: 12, fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
                    💡 <strong style={{ color: "var(--text)" }}>{f.desc}.</strong>
                    {" "}Use this when you want to {f.desc.toLowerCase()}.
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
