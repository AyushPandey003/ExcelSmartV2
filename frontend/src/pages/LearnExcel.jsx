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
      {
        title: "Cell Borders & Background Colors",
        content: `🎨 Borders and colors make your data much easier to scan!

Adding Borders:
1. Select a range of cells (e.g. A1:D10)
2. Right-click → Format Cells → Border tab
3. Choose: Outline, Inside, or custom sides
4. Pick a line style → Click OK

Adding Background Color (Fill):
1. Select the cell(s)
2. Click the Paint Bucket icon (🎨) in the toolbar
3. Pick a color

💡 Best practices:
• Use a dark background for your header row (Row 1) with white text
• Use alternating light colors for data rows (zebra striping) — much easier to read
• Avoid too many colors — stick to 2-3 shades

⚡ Quick border shortcut: Select cells → CTRL + SHIFT + 7 → adds an outline border`,
        formula: null,
        quiz: {
          q: "What is 'zebra striping' in Excel?",
          opts: ["A type of chart", "Alternating row colors for readability", "A formula for counting", "A printer setting"],
          ans: 1,
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
      {
        title: "SUMIF & COUNTIF",
        content: `🔍 SUMIF adds only rows that meet your condition:`,
        formula: '=SUMIF(A:A, "Mumbai", B:B)',
        formulaNote: 'Add values in column B only where column A says "Mumbai"',
        content2: `
COUNTIF counts how many cells match:`,
        formula2: '=COUNTIF(C:C, "Pass")',
        formulaNote2: 'Count all cells in column C that say "Pass"',
        content3: `
More COUNTIF examples:

• =COUNTIF(B2:B20, ">50000") → Count rows where value is above 50000
• =COUNTIF(A:A, "Delhi") → Count how many times Delhi appears

💡 TIP: These are incredibly useful for reports — count orders by city, sum sales by product category, etc.`,
        quiz: {
          q: 'What does =COUNTIF(B:B, ">100") count?',
          opts: ['Cells equal to "100"', "Cells greater than 100", "Cells less than 100", "All cells in column B"],
          ans: 1,
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
      {
        title: "VLOOKUP — Find Anything",
        content: `🔍 VLOOKUP is one of Excel's most powerful tools — it finds a value in a table and returns related information.

Syntax:`,
        formula: "=VLOOKUP(what_to_find, table_range, column_number, 0)",
        formulaNote: 'The 0 at the end means "find exact match" — always use 0!',
        content2: `
Real Example: You have a product list in columns A:C (Product ID, Name, Price).
To find the price of product "P005":`,
        formula2: '=VLOOKUP("P005", A:C, 3, 0)',
        formulaNote2: "Finds P005 in column A, returns value from column 3 (Price)",
        content3: `
💡 Tips:
• VLOOKUP always searches the FIRST column of your table range
• The column number is relative to your table range (1 = first col, 2 = second, etc.)
• If you get #N/A error, the value wasn't found — check spelling!`,
        quiz: {
          q: "In =VLOOKUP(A2, B:D, 2, 0), which column does it search in?",
          opts: ["Column A", "Column B (first in range B:D)", "Column D", "Column 2"],
          ans: 1,
        },
      },
    ],
  },
  {
    id: "charts", icon: "📊", title: "Charts & Graphs", badge: "b-red", badgeText: "Advanced",
    lessons: [
      {
        title: "Why Use Charts?",
        content: `📊 Charts turn numbers into pictures — making data easier to understand at a glance!

Types of charts and when to use them:

📊 COLUMN Chart — Compare values across categories
• Example: Monthly sales for Product A vs B vs C
• Best for: Comparisons, rankings

📈 LINE Chart — Show trends over time
• Example: Temperature changes over 12 months
• Best for: Trends, changes over time

🥧 PIE Chart — Show parts of a whole
• Example: Budget split: 40% rent, 30% food, 20% transport
• Best for: Percentages that add to 100%

📉 BAR Chart — Like Column but horizontal
• Best for: Long category names, rankings

🏔️ AREA Chart — Like Line but filled in
• Best for: Volume over time (e.g. cumulative sales)

💡 Rule of thumb: If comparing things → Column/Bar. Trends over time → Line. Parts of a whole → Pie.`,
        formula: null,
        quiz: {
          q: "Which chart is best for showing how sales changed month by month over a year?",
          opts: ["Pie chart", "Column chart", "Line chart", "Scatter chart"],
          ans: 2,
        },
      },
      {
        title: "Creating Your First Chart",
        content: `📊 Creating a chart in Excel takes just a few clicks!

Step-by-step:
1. Select your data (including headers)
   Example: Select A1:B13 for Month + Sales data

2. Click Insert tab in the top menu

3. Click the chart type you want:
   • "Column Chart" → Pick Clustered Column
   • Or click "Recommended Charts" — Excel suggests the best type!

4. Your chart appears instantly! 🎉

5. Click the chart → drag to move it anywhere on the sheet

🎨 To change the chart type after creating:
• Right-click the chart → "Change Chart Type"

To add more data series:
• Right-click → "Select Data" → Add

💡 TIP: Select your entire table first, then insert chart — Excel will automatically use all columns as series!`,
        formula: null,
        quiz: {
          q: "Which Excel tab do you use to insert a chart?",
          opts: ["Home", "Data", "Insert", "View"],
          ans: 2,
        },
      },
      {
        title: "Formatting & Beautifying Charts",
        content: `🎨 A well-formatted chart communicates much better than a plain one!

Chart Elements (click the + button on your chart):
✅ Chart Title — Give it a clear, descriptive name
✅ Axis Titles — Label what X and Y axes represent
✅ Data Labels — Show the actual values on the bars/lines
✅ Legend — Explains what each color means
✅ Gridlines — Horizontal lines to help read values

Quick formatting:
1. Click the chart
2. Use "Chart Design" tab → pick a style from the gallery
3. Click "Change Colors" to match your brand

To format specific elements:
• Double-click any element (title, bar, legend) to open the format panel

💡 Pro tips:
• Remove the legend if you only have 1 series
• Always add a title — "Q1 Regional Sales" is better than "Chart 1"
• Don't use 3D charts — they distort values and look unprofessional
• Less is more: remove clutter, keep it clean!`,
        formula: null,
        quiz: {
          q: "What button do you click on a chart to add/remove elements like titles and labels?",
          opts: ["The ⚙️ gear icon", "The + plus icon", "Right click → Properties", "The paintbrush icon"],
          ans: 1,
        },
      },
    ],
  },
  {
    id: "advanced-formulas", icon: "🧮", title: "Advanced Formulas", badge: "b-purple", badgeText: "Advanced",
    lessons: [
      {
        title: "Nested IF — Multiple Conditions",
        content: `🔀 Sometimes you need more than two outcomes — that's where nested IF comes in.

A nested IF puts one IF inside another:`,
        formula: '=IF(B2>=90, "A", IF(B2>=75, "B", IF(B2>=60, "C", "F")))',
        formulaNote: "If 90+ → A, if 75+ → B, if 60+ → C, otherwise F",
        content2: `
Real example for student grades:
• B2 = 92 → A
• B2 = 78 → B
• B2 = 62 → C
• B2 = 45 → F

Better alternative — IFS (Excel 2019+):`,
        formula2: '=IFS(B2>=90,"A", B2>=75,"B", B2>=60,"C", TRUE,"F")',
        formulaNote2: 'IFS is cleaner — tests multiple conditions without nesting. TRUE acts as "else".',
        content3: `
💡 When to use nested IF vs IFS:
• Use IFS when you have 3+ conditions — much easier to read
• Use nested IF for simpler 2-3 condition logic`,
        quiz: {
          q: '=IF(B2>=90, "A", IF(B2>=75, "B", "C")) — what does it return when B2 = 80?',
          opts: ["A", "B", "C", "Error"],
          ans: 1,
        },
      },
      {
        title: "INDEX & MATCH — Better than VLOOKUP",
        content: `⚡ INDEX + MATCH is more powerful than VLOOKUP — it can search any column, not just the first!

INDEX returns a value from a range at a specific position:`,
        formula: "=INDEX(B2:B100, 5)",
        formulaNote: "Returns the 5th value in column B2:B100",
        content2: `
MATCH finds the position of a value in a list:`,
        formula2: '=MATCH("Delhi", A2:A100, 0)',
        formulaNote2: 'Returns the row number where "Delhi" appears in column A',
        content3: `
Combined — this is the power move:`,
        formula3: '=INDEX(C2:C100, MATCH("Delhi", A2:A100, 0))',
        formulaNote3: 'Find "Delhi" in column A, then return the value from column C in the same row',
        content4: `
💡 Why INDEX+MATCH beats VLOOKUP:
• Works when your lookup column is NOT the first column
• Faster with large datasets
• Won't break if you insert/delete columns`,
        quiz: {
          q: "What does MATCH() return?",
          opts: ["The value of the found cell", "The position (row number) of the found value", "True or False", "The column letter"],
          ans: 1,
        },
      },
      {
        title: "SUMPRODUCT — The Swiss Army Knife",
        content: `🔢 SUMPRODUCT multiplies arrays together and sums the results — incredibly versatile!

Basic use — weighted average:`,
        formula: "=SUMPRODUCT(B2:B10, C2:C10)",
        formulaNote: "Multiplies each B×C pair and sums them all — perfect for weighted totals",
        content2: `
Real example — total revenue (Qty × Price):
• B column = Quantity Sold
• C column = Unit Price
• =SUMPRODUCT(B2:B10, C2:C10) → Total Revenue

As a conditional sum (without SUMIF):`,
        formula2: '=SUMPRODUCT((A2:A10="Mumbai") * B2:B10)',
        formulaNote2: "Sums column B only for rows where column A = Mumbai",
        content3: `
Count unique values:`,
        formula3: "=SUMPRODUCT(1/COUNTIF(A2:A20, A2:A20))",
        formulaNote3: "Counts how many unique values are in A2:A20",
        content4: `
💡 SUMPRODUCT is like a "super-powered SUMIF" that works with multiple conditions and complex calculations.`,
        quiz: {
          q: "What does =SUMPRODUCT(B2:B5, C2:C5) calculate?",
          opts: ["B2+B3+B4+B5", "B2×C2 + B3×C3 + B4×C4 + B5×C5", "SUM of B2:B5 divided by SUM of C2:C5", "Average of B and C"],
          ans: 1,
        },
      },
    ],
  },
  {
    id: "pivot", icon: "🔄", title: "Pivot Tables", badge: "b-orange", badgeText: "Expert",
    lessons: [
      {
        title: "What is a Pivot Table?",
        content: `🔄 A Pivot Table is Excel's most powerful tool for summarizing large amounts of data instantly.

Without Pivot Table: You have 1000 rows of sales data and need to know total sales by city. You'd need SUMIF for every city!

With Pivot Table: Select data → Insert → Pivot Table → Drag "City" to rows, "Sales" to values → DONE! 🎉

A Pivot Table lets you:
• Summarize thousands of rows in seconds
• Group data by any field (date, region, category)
• Count, Sum, Average, Min, Max — any function
• Create pivot charts

Example: Monthly sales data with 5000 rows
→ Pivot table shows: Jan: ₹2.5L, Feb: ₹3.1L, Mar: ₹2.8L...

💡 Think of it as a "magical summary machine" — drag and drop to get any view you want.`,
        formula: null,
        quiz: {
          q: "What is the main purpose of a Pivot Table?",
          opts: ["To create charts", "To format cells with colors", "To summarize and analyze large data quickly", "To find and replace text"],
          ans: 2,
        },
      },
      {
        title: "Building Your First Pivot Table",
        content: `🛠️ Creating a Pivot Table:

Step 1: Prepare your data
• Your data must have headers in Row 1
• No blank rows or merged cells
• Each column = one type of data

Step 2: Create the Pivot Table
1. Click anywhere in your data
2. Click Insert tab → PivotTable
3. Choose "New Worksheet" → Click OK

Step 3: Build your report using the Field List panel on the right:
• ROWS area → Drag fields you want as row labels (e.g. City, Product)
• COLUMNS area → Drag fields for columns (e.g. Month, Quarter)
• VALUES area → Drag numeric fields to summarize (e.g. Sales, Quantity)
• FILTERS area → Drag fields to filter the entire table

Example: Total Sales by City by Month
• Drag "City" → Rows
• Drag "Month" → Columns
• Drag "Sales" → Values

🎉 Done! You instantly see a breakdown of sales by city and month!`,
        formula: null,
        quiz: {
          q: "In a Pivot Table, where do you drag the field you want summarized (e.g. Sales)?",
          opts: ["Rows area", "Columns area", "Values area", "Filters area"],
          ans: 2,
        },
      },
      {
        title: "Refreshing & Customizing Pivot Tables",
        content: `🔄 Your Pivot Table doesn't update automatically when source data changes — you need to refresh it.

To refresh:
• Right-click anywhere in the Pivot Table → Refresh
• Or: PivotTable Analyze tab → Refresh

To change the summary function (default is Sum):
1. Click on any value cell in the Pivot Table
2. Go to PivotTable Analyze → Field Settings
3. Change from "Sum" to Average, Count, Max, Min, etc.

Grouping dates:
• Right-click a date field in Rows/Columns → Group
• Choose: Days, Months, Quarters, Years

Filtering your Pivot Table:
• Each field has a dropdown arrow — click to filter
• Or drag fields to the "Filters" area at the top

Slicers (visual filters):
1. Click in your Pivot Table
2. PivotTable Analyze → Insert Slicer
3. Choose a field → Click OK
4. Now click buttons to filter instantly! ✨

💡 Slicers make Pivot Tables interactive — perfect for presentations and dashboards.`,
        formula: null,
        quiz: {
          q: "After updating your source data, what must you do to update a Pivot Table?",
          opts: ["Delete and recreate it", "Right-click → Refresh", "Press F5", "It updates automatically"],
          ans: 1,
        },
      },
    ],
  },
  {
    id: "shortcuts", icon: "⌨️", title: "Keyboard Shortcuts", badge: "b-blue", badgeText: "Pro Tips",
    lessons: [
      {
        title: "Navigation Shortcuts",
        content: `⌨️ Move around Excel at lightning speed — no mouse needed!

Moving around:
• Arrow keys → Move one cell at a time
• CTRL + Arrow → Jump to the last non-empty cell in that direction
• CTRL + HOME → Go to cell A1 (top-left)
• CTRL + END → Go to the last used cell
• CTRL + G or F5 → Go to a specific cell (type A1, B100, etc.)

Selecting cells:
• SHIFT + Arrow → Extend selection one cell
• CTRL + SHIFT + Arrow → Select entire column/row of data
• CTRL + A → Select all cells
• CTRL + SHIFT + END → Select from current cell to last used cell

Selecting rows/columns:
• Click row number (1, 2, 3) → selects entire row
• Click column letter (A, B, C) → selects entire column
• SHIFT + Click → select multiple rows or columns

💡 CTRL + Arrow is a game-changer for large datasets — jump from cell A1 to A10000 instantly!`,
        formula: null,
        quiz: {
          q: "Which shortcut jumps to cell A1 from anywhere in the spreadsheet?",
          opts: ["CTRL + END", "CTRL + HOME", "CTRL + A", "F5"],
          ans: 1,
        },
      },
      {
        title: "Editing & Formatting Shortcuts",
        content: `⚡ Fastest ways to edit and format cells:

Editing:
• F2 → Edit the current cell
• ESC → Cancel what you're typing
• CTRL + Z → Undo last action
• CTRL + Y → Redo the undone action
• CTRL + C → Copy
• CTRL + X → Cut
• CTRL + V → Paste
• CTRL + D → Fill Down (copy cell above down to selected cells)
• CTRL + R → Fill Right (copy cell to the left, rightward)
• DELETE → Clear cell contents
• CTRL + ; → Insert today's date

Formatting:
• CTRL + B → Bold
• CTRL + I → Italic
• CTRL + U → Underline
• CTRL + 1 → Open Format Cells dialog
• CTRL + SHIFT + $ → Format as Currency
• CTRL + SHIFT + % → Format as Percentage
• CTRL + SHIFT + # → Format as Date
• ALT + H + H → Open background color picker

Finding & Replacing:
• CTRL + F → Find
• CTRL + H → Find & Replace
• CTRL + G → Go To (navigate to specific cells)`,
        formula: null,
        quiz: {
          q: "Which shortcut opens the Format Cells dialog box?",
          opts: ["CTRL + F", "CTRL + 1", "F4", "ALT + Enter"],
          ans: 1,
        },
      },
      {
        title: "Formula & Workbook Shortcuts",
        content: `🧮 Speed up your formula work and workbook management:

Formula shortcuts:
• = (equals) → Start a formula
• F4 → Toggle between relative/absolute references ($A$1, A$1, $A1, A1)
• CTRL + \` (backtick) → Show/hide all formulas in the sheet
• ALT + = → Auto-sum the selected range
• F9 → Recalculate all formulas
• CTRL + SHIFT + ENTER → Enter an array formula

Rows & Columns:
• CTRL + + (plus) → Insert row or column
• CTRL + - (minus) → Delete row or column
• ALT + I + R → Insert row
• ALT + I + C → Insert column

Workbook & Sheets:
• CTRL + N → New workbook
• CTRL + O → Open workbook
• CTRL + S → Save
• CTRL + W → Close workbook
• CTRL + P → Print
• CTRL + Page Up → Previous sheet
• CTRL + Page Down → Next sheet
• ALT + SHIFT + F1 → Insert new sheet

💡 The F4 key for absolute references is incredibly important — press it while typing a formula to lock cell references!`,
        formula: null,
        quiz: {
          q: "Which key toggles between relative and absolute references in a formula (e.g. A1 → $A$1)?",
          opts: ["F1", "F2", "F4", "F9"],
          ans: 2,
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

  const renderLessonContent = (lesson) => (
    <>
      {lesson.content && (
        <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 2, marginBottom: 10 }}>
          {lesson.content}
        </pre>
      )}
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
    </>
  );

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

              {renderLessonContent(lesson)}

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
