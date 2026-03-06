import { useState } from "react";

const FORMULAS = [
  // ── Math ─────────────────────────────────────────────────────────────────────
  { cat: "Math", name: "SUM",         syntax: "=SUM(A1:A10)",                          desc: "Adds all numbers in a range",                     example: "=SUM(B2:B8) → Total of B2 to B8",           level: "beginner" },
  { cat: "Math", name: "AVERAGE",     syntax: "=AVERAGE(A1:A10)",                      desc: "Finds the average (mean) of numbers",             example: "=AVERAGE(C2:C20) → Average score",          level: "beginner" },
  { cat: "Math", name: "MIN",         syntax: "=MIN(A1:A10)",                          desc: "Returns the smallest number",                     example: "=MIN(D2:D50) → Lowest price",               level: "beginner" },
  { cat: "Math", name: "MAX",         syntax: "=MAX(A1:A10)",                          desc: "Returns the largest number",                      example: "=MAX(D2:D50) → Highest price",              level: "beginner" },
  { cat: "Math", name: "COUNT",       syntax: "=COUNT(A1:A10)",                        desc: "Counts how many cells have numbers",              example: "=COUNT(B2:B100) → How many entries",        level: "beginner" },
  { cat: "Math", name: "COUNTA",      syntax: "=COUNTA(A1:A10)",                       desc: "Counts cells that are not empty",                 example: "=COUNTA(A2:A200) → Count all rows",         level: "beginner" },
  { cat: "Math", name: "ROUND",       syntax: "=ROUND(number, digits)",                desc: "Rounds a number to set decimal places",           example: "=ROUND(3.14159, 2) → 3.14",                level: "beginner" },
  { cat: "Math", name: "ROUNDUP",     syntax: "=ROUNDUP(number, digits)",              desc: "Always rounds a number up",                       example: "=ROUNDUP(2.1, 0) → 3",                     level: "beginner" },
  { cat: "Math", name: "ROUNDDOWN",   syntax: "=ROUNDDOWN(number, digits)",            desc: "Always rounds a number down",                     example: "=ROUNDDOWN(2.9, 0) → 2",                   level: "beginner" },
  { cat: "Math", name: "ABS",         syntax: "=ABS(number)",                          desc: "Returns absolute (positive) value",               example: "=ABS(-50) → 50",                            level: "beginner" },
  { cat: "Math", name: "MOD",         syntax: "=MOD(number, divisor)",                 desc: "Returns the remainder after division",            example: "=MOD(10, 3) → 1",                           level: "intermediate" },
  { cat: "Math", name: "INT",         syntax: "=INT(number)",                          desc: "Rounds down to the nearest integer",              example: "=INT(4.9) → 4",                             level: "beginner" },
  { cat: "Math", name: "SUMIF",       syntax: "=SUMIF(range, condition, sum_range)",   desc: "Adds numbers that meet a condition",              example: '=SUMIF(A:A,"Mumbai",B:B) → Sum Mumbai rows', level: "intermediate" },
  { cat: "Math", name: "SUMIFS",      syntax: "=SUMIFS(sum_range, range1, crit1, ...)", desc: "Adds numbers meeting multiple conditions",      example: '=SUMIFS(C:C,A:A,"Delhi",B:B,"Q1")',         level: "intermediate" },
  { cat: "Math", name: "COUNTIF",     syntax: "=COUNTIF(range, condition)",            desc: "Counts cells that meet a condition",              example: '=COUNTIF(C:C,"Pass") → Count all Pass marks', level: "intermediate" },
  { cat: "Math", name: "COUNTIFS",    syntax: "=COUNTIFS(range1, crit1, range2, crit2)", desc: "Counts cells meeting multiple conditions",    example: '=COUNTIFS(A:A,"Delhi",B:B,">1000")',        level: "intermediate" },
  { cat: "Math", name: "SUMPRODUCT",  syntax: "=SUMPRODUCT(array1, array2)",           desc: "Multiplies arrays and sums the products",        example: "=SUMPRODUCT(B2:B10, C2:C10) → Total revenue", level: "advanced" },
  { cat: "Math", name: "POWER",       syntax: "=POWER(number, power)",                 desc: "Raises a number to a power",                     example: "=POWER(2, 10) → 1024",                      level: "beginner" },
  { cat: "Math", name: "SQRT",        syntax: "=SQRT(number)",                         desc: "Returns the square root",                        example: "=SQRT(81) → 9",                             level: "beginner" },

  // ── Logic ────────────────────────────────────────────────────────────────────
  { cat: "Logic", name: "IF",         syntax: '=IF(condition, "true", "false")',        desc: "Shows one result if true, another if false",      example: '=IF(B2>=40,"Pass","Fail")',                  level: "beginner" },
  { cat: "Logic", name: "IFS",        syntax: '=IFS(cond1,"val1", cond2,"val2", ...)', desc: "Tests multiple conditions (Excel 2019+)",         example: '=IFS(B2>=90,"A",B2>=75,"B",TRUE,"C")',      level: "intermediate" },
  { cat: "Logic", name: "AND",        syntax: "=AND(cond1, cond2)",                    desc: "True only if ALL conditions are met",             example: "=AND(A1>0, B1>0) → Both must be positive",  level: "intermediate" },
  { cat: "Logic", name: "OR",         syntax: "=OR(cond1, cond2)",                     desc: "True if ANY condition is met",                    example: '=OR(A1="Yes", B1="Yes")',                   level: "intermediate" },
  { cat: "Logic", name: "NOT",        syntax: "=NOT(condition)",                        desc: "Reverses true to false or false to true",         example: '=NOT(A1="") → True if A1 is not empty',    level: "intermediate" },
  { cat: "Logic", name: "IFERROR",    syntax: "=IFERROR(formula, value_if_error)",      desc: "Shows a custom message if formula gives error",   example: '=IFERROR(A1/B1,"N/A") → Handles divide by zero', level: "intermediate" },
  { cat: "Logic", name: "IFNA",       syntax: "=IFNA(formula, value_if_na)",            desc: "Returns custom value if formula gives #N/A",     example: '=IFNA(VLOOKUP(A2,D:E,2,0),"Not Found")',   level: "intermediate" },
  { cat: "Logic", name: "SWITCH",     syntax: "=SWITCH(expr, val1, res1, val2, res2, default)", desc: "Match a value against a list (like a lookup)", example: '=SWITCH(A1,1,"Jan",2,"Feb",3,"Mar","?")', level: "advanced" },

  // ── Text ─────────────────────────────────────────────────────────────────────
  { cat: "Text", name: "UPPER",       syntax: "=UPPER(text)",                          desc: "Converts text to ALL CAPS",                      example: '=UPPER("hello") → HELLO',                   level: "beginner" },
  { cat: "Text", name: "LOWER",       syntax: "=LOWER(text)",                          desc: "Converts text to all lowercase",                  example: '=LOWER("HELLO") → hello',                   level: "beginner" },
  { cat: "Text", name: "PROPER",      syntax: "=PROPER(text)",                         desc: "Capitalizes first letter of each word",           example: '=PROPER("john doe") → John Doe',            level: "beginner" },
  { cat: "Text", name: "LEN",         syntax: "=LEN(text)",                            desc: "Counts how many characters are in text",         example: '=LEN("Hello") → 5',                         level: "beginner" },
  { cat: "Text", name: "TRIM",        syntax: "=TRIM(text)",                           desc: "Removes extra spaces from text",                  example: '=TRIM("  Hello  ") → Hello',                level: "beginner" },
  { cat: "Text", name: "CONCATENATE", syntax: '=CONCATENATE(A1, " ", B1)',             desc: "Joins text from multiple cells",                  example: '=CONCATENATE(A1," ",B1) → Full Name',       level: "beginner" },
  { cat: "Text", name: "TEXTJOIN",    syntax: '=TEXTJOIN(", ", TRUE, A1:A10)',         desc: "Joins a range of text with a delimiter",         example: '=TEXTJOIN(", ",TRUE,A2:A10) → "a, b, c"',  level: "intermediate" },
  { cat: "Text", name: "LEFT",        syntax: "=LEFT(text, n)",                        desc: "Gets first N characters from text",              example: '=LEFT("INV-001", 3) → INV',                 level: "intermediate" },
  { cat: "Text", name: "RIGHT",       syntax: "=RIGHT(text, n)",                       desc: "Gets last N characters from text",               example: '=RIGHT("INV-001", 3) → 001',                level: "intermediate" },
  { cat: "Text", name: "MID",         syntax: "=MID(text, start, length)",             desc: "Gets characters from the middle of text",        example: '=MID("ABCDEF", 2, 3) → BCD',               level: "advanced" },
  { cat: "Text", name: "SUBSTITUTE",  syntax: '=SUBSTITUTE(text, "old", "new")',       desc: "Replaces specific text within a string",         example: '=SUBSTITUTE(A1,"-","_") → Replace hyphens', level: "intermediate" },
  { cat: "Text", name: "FIND",        syntax: '=FIND("char", text)',                   desc: "Returns position of text within a string (case-sensitive)", example: '=FIND("@","user@mail.com") → 5', level: "advanced" },
  { cat: "Text", name: "TEXT",        syntax: '=TEXT(value, "format")',                desc: "Converts a number to formatted text",            example: '=TEXT(1234.5,"₹#,##0.00") → ₹1,234.50',  level: "intermediate" },
  { cat: "Text", name: "VALUE",       syntax: "=VALUE(text)",                          desc: "Converts text that looks like a number to a number", example: '=VALUE("1,234") → 1234',                level: "intermediate" },

  // ── Lookup ───────────────────────────────────────────────────────────────────
  { cat: "Lookup", name: "VLOOKUP",   syntax: "=VLOOKUP(what, table, col, 0)",        desc: "Looks up a value in a table by column",          example: "=VLOOKUP(A2, D:F, 2, 0) → Find A2 in D:F, return col 2", level: "intermediate" },
  { cat: "Lookup", name: "HLOOKUP",   syntax: "=HLOOKUP(what, table, row, 0)",        desc: "Like VLOOKUP but looks across rows",             example: "=HLOOKUP(A1, B1:F3, 2, 0)",                level: "intermediate" },
  { cat: "Lookup", name: "XLOOKUP",   syntax: "=XLOOKUP(lookup, lookup_array, return_array)", desc: "Modern replacement for VLOOKUP (Excel 365)", example: '=XLOOKUP(A2,D:D,E:E,"Not Found")',       level: "intermediate" },
  { cat: "Lookup", name: "INDEX",     syntax: "=INDEX(range, row, col)",              desc: "Returns the value at a specific row and column", example: "=INDEX(A1:C10, 3, 2) → Row 3, Column 2",   level: "advanced" },
  { cat: "Lookup", name: "MATCH",     syntax: "=MATCH(value, range, 0)",              desc: "Returns the position of a value in a list",     example: '=MATCH("Apple", A:A, 0) → Row of Apple',   level: "advanced" },
  { cat: "Lookup", name: "CHOOSE",    syntax: "=CHOOSE(index, val1, val2, ...)",      desc: "Returns one of several values based on index",   example: '=CHOOSE(2,"Jan","Feb","Mar") → Feb',        level: "intermediate" },
  { cat: "Lookup", name: "OFFSET",    syntax: "=OFFSET(ref, rows, cols, height, width)", desc: "Returns a range offset from a reference",   example: "=OFFSET(A1, 2, 3) → Cell D3",              level: "advanced" },
  { cat: "Lookup", name: "INDIRECT",  syntax: '=INDIRECT("A1")',                      desc: "Returns the value of a cell referenced by text", example: '=INDIRECT("Sheet2!B5") → Value in Sheet2', level: "advanced" },

  // ── Date ─────────────────────────────────────────────────────────────────────
  { cat: "Date", name: "TODAY",       syntax: "=TODAY()",                              desc: "Returns today's date (updates daily)",           example: "=TODAY() → Shows current date",             level: "beginner" },
  { cat: "Date", name: "NOW",         syntax: "=NOW()",                                desc: "Returns current date and time",                  example: "=NOW() → Shows date + time",                level: "beginner" },
  { cat: "Date", name: "DAY",         syntax: "=DAY(date)",                            desc: "Gets the day number from a date",               example: "=DAY(A1) → If A1 is 15-Jan-2024, returns 15", level: "beginner" },
  { cat: "Date", name: "MONTH",       syntax: "=MONTH(date)",                          desc: "Gets the month number from a date",             example: "=MONTH(A1) → Returns 1 for January",        level: "beginner" },
  { cat: "Date", name: "YEAR",        syntax: "=YEAR(date)",                           desc: "Gets the year from a date",                     example: "=YEAR(A1) → Returns 2024",                  level: "beginner" },
  { cat: "Date", name: "DATE",        syntax: "=DATE(year, month, day)",               desc: "Creates a date from year, month, day",          example: "=DATE(2024, 3, 15) → 15-Mar-2024",          level: "beginner" },
  { cat: "Date", name: "DATEDIF",     syntax: '=DATEDIF(start, end, "Y")',             desc: "Calculates difference between two dates",       example: '=DATEDIF(A1,TODAY(),"Y") → Age in years',  level: "intermediate" },
  { cat: "Date", name: "NETWORKDAYS", syntax: "=NETWORKDAYS(start, end)",              desc: "Counts working days between two dates (excl. weekends)", example: "=NETWORKDAYS(A1,B1) → Working days", level: "intermediate" },
  { cat: "Date", name: "WORKDAY",     syntax: "=WORKDAY(start, days)",                 desc: "Returns a date after N working days",           example: "=WORKDAY(TODAY(), 5) → 5 working days from today", level: "intermediate" },
  { cat: "Date", name: "EDATE",       syntax: "=EDATE(start, months)",                 desc: "Returns date N months before or after",         example: "=EDATE(A1, 3) → 3 months after date in A1", level: "intermediate" },
  { cat: "Date", name: "EOMONTH",     syntax: "=EOMONTH(start, months)",               desc: "Returns the last day of a month",               example: "=EOMONTH(TODAY(), 0) → Last day of current month", level: "intermediate" },
  { cat: "Date", name: "WEEKDAY",     syntax: "=WEEKDAY(date, 2)",                     desc: "Returns day of week (1=Mon with type 2)",       example: "=WEEKDAY(TODAY(), 2) → 1=Mon, 7=Sun",      level: "intermediate" },
  { cat: "Date", name: "TEXT (Date)", syntax: '=TEXT(A1,"dd-mmm-yyyy")',               desc: "Format a date as readable text",                example: '=TEXT(TODAY(),"dd-mmm-yyyy") → "06-Mar-2026"', level: "beginner" },

  // ── Financial ────────────────────────────────────────────────────────────────
  { cat: "Financial", name: "PMT",    syntax: "=PMT(rate, nper, pv)",                  desc: "Calculates fixed loan EMI payment",              example: "=PMT(10%/12, 12*5, -500000) → Monthly EMI for ₹5L loan", level: "intermediate" },
  { cat: "Financial", name: "PV",     syntax: "=PV(rate, nper, pmt)",                  desc: "Present value — what a future amount is worth today", example: "=PV(8%/12, 60, -10000) → Loan amount for ₹10K EMI", level: "advanced" },
  { cat: "Financial", name: "FV",     syntax: "=FV(rate, nper, pmt)",                  desc: "Future value — what an investment grows to",    example: "=FV(8%/12, 60, -5000) → SIP maturity after 5 years", level: "advanced" },
  { cat: "Financial", name: "RATE",   syntax: "=RATE(nper, pmt, pv)",                  desc: "Calculates the interest rate per period",       example: "=RATE(12, -10000, 100000)*12 → Annual rate",level: "advanced" },
  { cat: "Financial", name: "NPER",   syntax: "=NPER(rate, pmt, pv)",                  desc: "Number of periods to pay off a loan",           example: "=NPER(10%/12, -10000, 500000) → Months to pay off", level: "advanced" },
  { cat: "Financial", name: "NPV",    syntax: "=NPV(rate, value1, value2, ...)",        desc: "Net present value of an investment",            example: "=NPV(10%, B2:B7) → Value of future cash flows", level: "advanced" },
  { cat: "Financial", name: "IRR",    syntax: "=IRR(values)",                           desc: "Internal rate of return for cash flows",        example: "=IRR(B2:B8) → Return rate of an investment", level: "advanced" },
  { cat: "Financial", name: "IPMT",   syntax: "=IPMT(rate, per, nper, pv)",             desc: "Interest portion of a specific loan payment",   example: "=IPMT(10%/12, 3, 60, -500000) → Interest in month 3", level: "advanced" },
  { cat: "Financial", name: "PPMT",   syntax: "=PPMT(rate, per, nper, pv)",             desc: "Principal portion of a specific loan payment",  example: "=PPMT(10%/12, 3, 60, -500000) → Principal in month 3", level: "advanced" },

  // ── Statistical ──────────────────────────────────────────────────────────────
  { cat: "Statistical", name: "MEDIAN",      syntax: "=MEDIAN(A1:A10)",     desc: "Returns the middle value in a dataset",                  example: "=MEDIAN(B2:B20) → Middle salary",          level: "beginner" },
  { cat: "Statistical", name: "MODE",        syntax: "=MODE(A1:A10)",       desc: "Returns the most frequently occurring value",            example: "=MODE(C2:C50) → Most common score",        level: "beginner" },
  { cat: "Statistical", name: "STDEV",       syntax: "=STDEV(A1:A10)",      desc: "Standard deviation — how spread out the data is",       example: "=STDEV(D2:D30) → Variation in test scores", level: "intermediate" },
  { cat: "Statistical", name: "VAR",         syntax: "=VAR(A1:A10)",        desc: "Variance of a dataset (square of std deviation)",       example: "=VAR(B2:B20)",                              level: "intermediate" },
  { cat: "Statistical", name: "PERCENTILE",  syntax: "=PERCENTILE(array, k)", desc: "Returns the k-th percentile (0-1) of a dataset",     example: "=PERCENTILE(B2:B50, 0.9) → 90th percentile", level: "intermediate" },
  { cat: "Statistical", name: "RANK",        syntax: "=RANK(number, ref, 0)", desc: "Returns the rank of a number in a list (0=descending)", example: "=RANK(B2, B$2:B$20, 0) → Rank in class", level: "intermediate" },
  { cat: "Statistical", name: "LARGE",       syntax: "=LARGE(array, k)",    desc: "Returns the k-th largest value",                        example: "=LARGE(B2:B20, 2) → 2nd highest sales",   level: "intermediate" },
  { cat: "Statistical", name: "SMALL",       syntax: "=SMALL(array, k)",    desc: "Returns the k-th smallest value",                       example: "=SMALL(B2:B20, 3) → 3rd lowest price",    level: "intermediate" },
  { cat: "Statistical", name: "FREQUENCY",   syntax: "=FREQUENCY(data, bins)", desc: "Counts how many values fall in each range (array formula)", example: "=FREQUENCY(B2:B50, {40,60,80}) → grade distribution", level: "advanced" },
  { cat: "Statistical", name: "CORREL",     syntax: "=CORREL(array1, array2)", desc: "Correlation between two datasets (-1 to 1)",          example: "=CORREL(B2:B20,C2:C20) → Price vs demand", level: "advanced" },
];

const CATS = ["All", "Math", "Logic", "Text", "Lookup", "Date", "Financial", "Statistical"];
const LEVELS = ["All Levels", "beginner", "intermediate", "advanced"];
const LEVEL_COLORS = { beginner: "b-green", intermediate: "b-blue", advanced: "b-purple" };
const CAT_COLORS = {
  Math: "b-orange", Logic: "b-purple", Text: "b-blue",
  Lookup: "b-green", Date: "b-red", Financial: "b-b", Statistical: "b-orange"
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button onClick={(e) => { e.stopPropagation(); copy(); }} style={{
      background: copied ? "rgba(45,186,115,0.15)" : "var(--bg3)",
      border: `1px solid ${copied ? "rgba(45,186,115,0.4)" : "var(--border)"}`,
      borderRadius: 6, padding: "4px 10px", cursor: "pointer",
      color: copied ? "var(--accent)" : "var(--text2)", fontSize: 12, fontFamily: "inherit",
      transition: "all .15s",
    }}>
      {copied ? "✓ Copied" : "📋 Copy"}
    </button>
  );
}

export default function FormulasRef() {
  const [search, setSearch] = useState("");
  const [cat, setCat]       = useState("All");
  const [level, setLevel]   = useState("All Levels");
  const [expanded, setExpanded] = useState(null);

  const filtered = FORMULAS.filter((f) => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat   = cat === "All" || f.cat === cat;
    const matchLevel = level === "All Levels" || f.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  return (
    <div>
      <div className="page-header">
        <h1>𝑓𝑥 Formula Reference Guide</h1>
        <p>A beginner-friendly guide to {FORMULAS.length} Excel formulas across {CATS.length - 1} categories — plain English with real examples. Click any formula to expand it!</p>
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
            {filtered.length} / {FORMULAS.length} formulas
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
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{
                  fontFamily: "'Fira Code', monospace", fontSize: 15, fontWeight: 700,
                  color: "var(--accent)", minWidth: 120,
                }}>
                  {f.name}
                </div>
                <span className={`badge ${CAT_COLORS[f.cat]}`}>{f.cat}</span>
                <span className={`badge ${LEVEL_COLORS[f.level]}`}>{f.level}</span>
                <div style={{ color: "var(--text2)", fontSize: 13, flex: 1, minWidth: 200 }}>{f.desc}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <CopyButton text={f.syntax} />
                  <div style={{ color: "var(--text3)", fontSize: 16 }}>{isOpen ? "▲" : "▼"}</div>
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                  <div className="label" style={{ marginBottom: 6 }}>Syntax</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div className="formula-box" style={{ flex: 1 }}>{f.syntax}</div>
                    <CopyButton text={f.syntax} />
                  </div>

                  <div className="label" style={{ marginBottom: 6 }}>Real-World Example</div>
                  <div className="formula-box" style={{ color: "var(--accent2)", marginBottom: 12 }}>{f.example}</div>

                  <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
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
