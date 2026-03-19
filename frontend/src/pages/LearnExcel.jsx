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
  {
    id: "validation", icon: "✅", title: "Data Validation", badge: "b-orange", badgeText: "Intermediate",
    lessons: [
      {
        title: "What is Data Validation?",
        content: `✅ Data Validation lets you control what people can type in a cell — preventing wrong entries!

Why use it?
• Stop someone from typing text in a number-only column
• Force dates to be within a range (e.g. this year only)
• Create dropdown lists so users pick from options
• Show a warning if someone enters invalid data

Where to find it:
1. Select the cell(s) you want to validate
2. Click the Data tab
3. Click "Data Validation"

💡 Think of it like a "gatekeeper" for your cells — only the right data gets in!

Real examples:
• Age column → Only allow numbers between 1 and 120
• Status column → Only allow "Active" or "Inactive"
• Date column → Only allow dates in 2024-2025`,
        formula: null,
        quiz: {
          q: "What is the main purpose of Data Validation?",
          opts: ["To format cells with colors", "To control what data users can enter in cells", "To create charts", "To sort data"],
          ans: 1,
        },
      },
      {
        title: "Creating Dropdown Lists",
        content: `📋 Dropdown lists are the most popular use of Data Validation — users click and pick from a list!

Step-by-step:
1. Select the cell(s) where you want the dropdown
2. Go to Data tab → Data Validation
3. Under "Allow", choose "List"
4. In the "Source" box, type your options separated by commas:

Example source: Active, Inactive, On Leave

Or point to a range of cells:
• Type the items in cells E1:E5
• In Source, type: =$E$1:$E$5

5. Click OK — now clicking the cell shows a dropdown! 🎉

💡 Pro tips:
• Put your list items on a separate sheet (e.g. "Lists" sheet) to keep things tidy
• Use $ signs in range references so they don't shift when you copy the cell
• Check "In-cell dropdown" to show the arrow button`,
        formula: null,
        quiz: {
          q: "In Data Validation, which 'Allow' option creates a dropdown list?",
          opts: ["Whole Number", "Date", "List", "Text Length"],
          ans: 2,
        },
      },
      {
        title: "Number & Date Restrictions",
        content: `🔢 You can restrict cells to accept only specific numbers, dates, or text lengths!

Number restrictions:
1. Select cells → Data → Data Validation
2. Allow: "Whole Number" or "Decimal"
3. Choose condition: between, greater than, less than, equal to
4. Set min/max values

Example: Allow only scores between 0 and 100
• Allow: Whole Number
• Data: between
• Minimum: 0, Maximum: 100

Date restrictions:
• Allow: Date
• Data: between
• Start date: 01/01/2024, End date: 31/12/2025

Text Length:
• Allow: Text Length
• Data: less than or equal to
• Maximum: 50 (limit characters)

⚡ Input Message: Shows a helpful tooltip when the cell is selected
⚠️ Error Alert: Shows a warning when wrong data is entered

💡 Always add a friendly Input Message like "Enter a number between 0 and 100" so users know what's expected!`,
        formula: null,
        quiz: {
          q: "Which Data Validation option restricts a cell to only accept numbers from 1 to 100?",
          opts: ["List", "Text Length", "Whole Number with 'between'", "Custom"],
          ans: 2,
        },
      },
    ],
  },
  {
    id: "cond-format", icon: "🎯", title: "Conditional Formatting", badge: "b-red", badgeText: "Intermediate",
    lessons: [
      {
        title: "What is Conditional Formatting?",
        content: `🎨 Conditional Formatting automatically colors cells based on rules — making patterns jump out!

Examples:
• Highlight all values above ₹10,000 in green
• Turn failing grades (below 40) red
• Mark duplicate entries with yellow background
• Color-code status: "Done" = green, "Pending" = orange

How to use:
1. Select your data range (e.g. B2:B100)
2. Go to Home tab → Conditional Formatting
3. Choose a rule type:
   • Highlight Cells Rules → Greater Than, Less Than, Equal To, Text Contains
   • Top/Bottom Rules → Top 10%, Bottom 10%
   • Data Bars → Visual bars inside cells
   • Color Scales → Gradient heatmaps

Quick example — highlight sales above 5000:
1. Select the sales column
2. Conditional Formatting → Highlight Cells Rules → Greater Than
3. Type 5000 → Pick green fill → OK

💡 You can apply MULTIPLE rules to the same cells — they layer on top of each other!`,
        formula: null,
        quiz: {
          q: "Where do you find Conditional Formatting in Excel?",
          opts: ["Data tab", "Insert tab", "Home tab", "View tab"],
          ans: 2,
        },
      },
      {
        title: "Color Scales & Data Bars",
        content: `📊 Color Scales and Data Bars give you instant visual analysis!

DATA BARS:
• Each cell gets a horizontal bar proportional to its value
• Bigger number = longer bar
• Great for: Sales figures, scores, quantities

To add: Select data → Conditional Formatting → Data Bars → Pick a style

COLOR SCALES:
• Cells get a color gradient based on value
• Low values → one color, High values → another
• Like a heatmap in your spreadsheet!

Common color scales:
🟢🟡🔴 Green-Yellow-Red (good to bad)
🔴🟡🟢 Red-Yellow-Green (bad to good)
🔵⬜ Blue-White (intensity)

To add: Select data → Conditional Formatting → Color Scales → Pick a gradient

ICON SETS:
• Small icons appear in each cell (arrows, stars, flags, traffic lights)
• Great for dashboards and status indicators

To add: Select data → Conditional Formatting → Icon Sets → Pick a set

💡 Use Color Scales for big datasets — you can spot trends and outliers instantly without reading every number!`,
        formula: null,
        quiz: {
          q: "What do Data Bars show in each cell?",
          opts: ["A pie chart", "A horizontal bar proportional to the cell's value", "A sparkline chart", "Colored text"],
          ans: 1,
        },
      },
      {
        title: "Custom Rules with Formulas",
        content: `🧮 For advanced rules, you can use your own formulas in Conditional Formatting!

How to create a formula-based rule:
1. Select your data range
2. Home → Conditional Formatting → New Rule
3. Choose "Use a formula to determine which cells to format"
4. Enter your formula
5. Click Format → choose your colors → OK

Example formulas:`,
        formula: "=A1>AVERAGE($A$1:$A$20)",
        formulaNote: "Highlights cells above the average — use $ signs to lock the range!",
        content2: `
More formula examples:

Highlight entire row if Status = "Overdue":`,
        formula2: '=$E1="Overdue"',
        formulaNote2: "The $ before E locks the column, but the row changes — so each row is checked",
        content3: `
Highlight weekends:`,
        formula3: "=WEEKDAY(A1,2)>5",
        formulaNote3: "Returns TRUE for Saturday (6) and Sunday (7)",
        content4: `
💡 Key rules for formula-based formatting:
• The formula must return TRUE or FALSE
• Use $ to lock columns/rows as needed
• Reference the FIRST cell in your selection (e.g. A1, not A2:A100)
• Test your formula in a regular cell first to make sure it works!`,
        quiz: {
          q: "In a Conditional Formatting formula rule, what must the formula return?",
          opts: ["A number", "A color code", "TRUE or FALSE", "The cell address"],
          ans: 2,
        },
      },
    ],
  },
  {
    id: "power", icon: "⚡", title: "Power Features", badge: "b-purple", badgeText: "Expert",
    lessons: [
      {
        title: "Flash Fill — Magic Pattern Detection",
        content: `✨ Flash Fill is like magic — Excel detects a pattern from your examples and fills the rest!

Available in Excel 2013 and later.

How to use:
1. Type the pattern you want in the first cell
2. Start typing the second one
3. Press CTRL + E — Excel fills the rest! 🎉

Examples of what Flash Fill can do:

Extracting first names:
• Column A has "Rahul Sharma", "Priya Patel", "Amit Singh"
• In B1, type "Rahul"
• In B2, start typing "Priya" → press CTRL + E
• Excel fills: Rahul, Priya, Amit

Reformatting phone numbers:
• A1: 9876543210 → B1: type "+91-98765-43210"
• Press CTRL+E on next cell → all numbers reformatted!

Combining data:
• A1: "Mumbai", B1: "Maharashtra" → C1: type "Mumbai, Maharashtra"
• CTRL+E fills the rest

📍 Also accessible from: Data tab → Flash Fill

💡 Flash Fill works best when your pattern is clear and consistent. If it doesn't detect correctly, add one more example row and try again.`,
        formula: null,
        quiz: {
          q: "What keyboard shortcut activates Flash Fill?",
          opts: ["CTRL + F", "CTRL + E", "CTRL + D", "CTRL + SHIFT + F"],
          ans: 1,
        },
      },
      {
        title: "Remove Duplicates & Text to Columns",
        content: `🔄 Two essential Data tab tools for cleaning messy data!

REMOVE DUPLICATES:
1. Select your data (or click any cell in the table)
2. Go to Data tab → Remove Duplicates
3. Choose which columns to check for duplicates
4. Click OK → Excel removes duplicate rows and tells you how many were deleted

⚠️ TIP: Always make a backup before removing duplicates — the action can't be undone easily!

TEXT TO COLUMNS:
Splits one column into multiple columns — perfect for cleaning imported data.

1. Select the column with combined data
2. Data tab → Text to Columns
3. Choose:
   • "Delimited" → Split by comma, space, tab, semicolon, or custom character
   • "Fixed Width" → Split at specific character positions
4. Click Next → choose your delimiter → Finish

Example — splitting "Mumbai, Maharashtra" into two columns:
• Choose Delimited → check "Comma" → Finish
• Column A: "Mumbai" | Column B: "Maharashtra"

💡 Text to Columns is also great for fixing dates that Excel doesn't recognize — select the column, run Text to Columns, and choose the date format.`,
        formula: null,
        quiz: {
          q: "What does 'Text to Columns' do?",
          opts: ["Converts numbers to text", "Splits one column into multiple columns", "Changes text direction", "Counts text characters"],
          ans: 1,
        },
      },
      {
        title: "Protecting Sheets & Workbooks",
        content: `🔒 Protect your work from accidental edits — essential for shared spreadsheets!

PROTECT A SHEET:
1. Go to Review tab → Protect Sheet
2. (Optional) Set a password
3. Choose what users CAN do (checkboxes):
   • Select locked/unlocked cells
   • Format cells, insert rows, sort, filter
4. Click OK

UNLOCK SPECIFIC CELLS (before protecting):
1. Select the cells you want people to edit
2. Right-click → Format Cells → Protection tab
3. UNCHECK "Locked"
4. Now protect the sheet — those cells remain editable!

PROTECT A WORKBOOK:
• Review → Protect Workbook
• Prevents users from adding, deleting, or renaming sheets

PROTECT CELLS WITH FORMULAS:
Best practice for shared sheets:
1. Unlock all input cells (where users type)
2. Keep formula cells locked (default)
3. Protect the sheet → Users can enter data but can't break formulas!

💡 Pro tips:
• Use a password you remember — there's no "forgot password" option!
• Hidden sheets can also be protected from being unhidden
• For extra security, save as .xlsx with a workbook password (File → Save As → Tools → General Options)`,
        formula: null,
        quiz: {
          q: "Which tab has the 'Protect Sheet' button?",
          opts: ["Home", "Data", "Review", "Insert"],
          ans: 2,
        },
      },
    ],
  },
  {
    id: "print", icon: "🖨️", title: "Print & Page Setup", badge: "b-blue", badgeText: "Intermediate",
    lessons: [
      {
        title: "Page Setup & Print Area",
        content: `🖨️ Before printing, you need to set up the page properly!

Setting up Page Layout:
1. Go to Page Layout tab
2. Set these important options:
   • Orientation → Landscape (wide data) or Portrait (tall data)
   • Size → A4 (most common in India)
   • Margins → Normal or Narrow

Setting a Print Area (print only specific cells):
1. Select the range you want to print (e.g. A1:G20)
2. Page Layout → Print Area → Set Print Area
3. Now only those cells will print!

To remove: Page Layout → Print Area → Clear Print Area

💡 Pro tips:
• Use CTRL + P to preview before printing
• Click "Print Preview" to see exactly how it will look
• Use View → Page Break Preview to see where pages split
• Drag the blue dotted lines to adjust page breaks

⚡ To fit a wide table on one page:
Page Layout → Width → 1 page | Height → Automatic`,
        formula: null,
        quiz: {
          q: "How do you print only specific cells in Excel?",
          opts: ["Delete the other cells first", "Select cells → Page Layout → Set Print Area", "Hide the other columns", "Use CTRL + P + Select"],
          ans: 1,
        },
      },
      {
        title: "Headers, Footers & Print Titles",
        content: `📄 Add professional headers/footers and repeat row titles on every printed page!

Adding Headers & Footers:
1. Go to Insert tab → Header & Footer
2. Click the header/footer area
3. Type text or use built-in elements:
   • Page Number: &[Page]
   • Total Pages: &[Pages]
   • Date: &[Date]
   • File Name: &[File]

Common header/footer combos:
• Header: "Company Name" | Center: "Report Title" | Right: Date
• Footer: Left: "Confidential" | Center: "Page 1 of 5"

Repeating Headers on Every Page (Print Titles):
1. Page Layout → Print Titles
2. "Rows to repeat at top" → Click Row 1 (or your header row)
3. Click OK

Now Row 1 appears at the top of EVERY printed page! 🎉

💡 This is essential for long spreadsheets — without it, page 2 onwards won't have column headers.`,
        formula: null,
        quiz: {
          q: "What feature makes Row 1 appear on every printed page?",
          opts: ["Freeze Panes", "Print Titles", "Page Header", "Repeat Row"],
          ans: 1,
        },
      },
    ],
  },
  {
    id: "named-ranges", icon: "🏷️", title: "Named Ranges & Tables", badge: "b-green", badgeText: "Intermediate",
    lessons: [
      {
        title: "Named Ranges — Give Cells a Name",
        content: `🏷️ Instead of remembering "B2:B50", you can name a range something meaningful like "Sales" or "Prices"!

Creating a Named Range:
1. Select the cells (e.g. B2:B50)
2. Click the Name Box (top-left, shows "B2")
3. Type a name (e.g. "MonthlySales") → Press Enter

Now you can use it in formulas:`,
        formula: "=SUM(MonthlySales)",
        formulaNote: "Much easier to read than =SUM(B2:B50)!",
        content2: `
More examples:
• =AVERAGE(StudentScores) instead of =AVERAGE(C2:C30)
• =MAX(Prices) instead of =MAX(D2:D100)

To manage all named ranges:
• Formulas tab → Name Manager
• Here you can edit, delete, or see all your names

Rules for naming:
• No spaces (use underscores: "Total_Sales")
• Must start with a letter or underscore
• Can't be a cell reference (can't name something "A1")

💡 Named ranges make formulas self-documenting — anyone can read =SUM(Revenue) and understand it!`,
        quiz: {
          q: "Where do you type to create a Named Range?",
          opts: ["The formula bar", "The Name Box (top-left corner)", "A cell in the sheet", "The status bar"],
          ans: 1,
        },
      },
      {
        title: "Excel Tables — Structured Data",
        content: `📊 An Excel Table is a special format that makes data management much easier!

Creating a Table:
1. Click anywhere in your data
2. Press CTRL + T (or Insert → Table)
3. Check "My table has headers" → OK

What happens when you create a Table:
✅ Auto-filters on every column
✅ Banded rows (alternating colors) for readability
✅ Structured references in formulas
✅ Auto-expands when you add new rows
✅ Total Row option (click checkbox in Table Design)

Structured References (Table formulas):`,
        formula: "=SUM(SalesTable[Amount])",
        formulaNote: "Uses the table name and column name — no cell references needed!",
        content2: `
More structured reference examples:
• =AVERAGE(SalesTable[Price]) → Average of the Price column
• =COUNTIF(SalesTable[City], "Mumbai") → Count Mumbai rows

To add a Total Row:
• Click the table → Table Design tab → Check "Total Row"
• Click the total cell → Pick Sum, Average, Count, etc.

💡 Tables are the #1 best practice for organizing data in Excel — they prevent most formula errors and make everything easier!`,
        quiz: {
          q: "What keyboard shortcut creates an Excel Table?",
          opts: ["CTRL + T", "CTRL + E", "CTRL + L", "CTRL + N"],
          ans: 0,
        },
      },
      {
        title: "Table Slicers & Styles",
        content: `🎨 Make your tables interactive and beautiful!

Table Styles:
1. Click anywhere in the table
2. Go to Table Design tab
3. Browse the Style Gallery — pick a color scheme
4. Check/uncheck: Banded Rows, Banded Columns, First Column, Last Column

Slicers — Visual Filters:
1. Click the table
2. Table Design → Insert Slicer (or Insert tab → Slicer)
3. Check the column(s) you want as filters → OK
4. Click buttons in the slicer to filter your table!

Example: Create a slicer for "Department"
• Now click "Sales" → only Sales rows show
• Click "HR" → only HR rows show
• Hold CTRL + click to select multiple

To remove slicer filter: Click the clear filter button (🔄) in the slicer header

💡 Slicers are perfect for:
• Dashboards — let users explore data visually
• Presentations — click to filter live during a meeting
• Reports — quickly switch between views of the data`,
        formula: null,
        quiz: {
          q: "What do Slicers provide for Excel Tables?",
          opts: ["Automatic formulas", "Visual clickable filter buttons", "Charts and graphs", "Cell formatting"],
          ans: 1,
        },
      },
    ],
  },
  {
    id: "errors", icon: "🚨", title: "Error Handling", badge: "b-red", badgeText: "Intermediate",
    lessons: [
      {
        title: "Understanding Excel Errors",
        content: `🚨 Excel errors look scary but they all have simple explanations!

Common errors and what they mean:

#DIV/0! — Division by zero
• You tried to divide by 0 or an empty cell
• Fix: Check if the divisor cell has data

#VALUE! — Wrong value type
• You used text where a number was expected
• Fix: Check for hidden spaces or text in number columns

#REF! — Broken reference
• A cell you referenced was deleted
• Fix: Re-create the formula with correct cells

#NAME? — Unknown formula name
• You misspelled a function name or forgot quotes
• Fix: Check spelling, add "quotes" around text

#N/A — Value not found
• VLOOKUP or MATCH didn't find what you searched for
• Fix: Check spelling, ensure data exists

#NUM! — Invalid number
• Math result is too large or formula logic is impossible
• Fix: Check your inputs and formula logic

#NULL! — Wrong range operator
• You used a space instead of : or , between ranges
• Fix: Use A1:A10 (colon) not A1 A10

💡 Hover over the error cell → Excel shows a small yellow triangle with explanation!`,
        formula: null,
        quiz: {
          q: "What does #DIV/0! error mean?",
          opts: ["The cell is too small", "You divided by zero or an empty cell", "The formula name is wrong", "A referenced cell was deleted"],
          ans: 1,
        },
      },
      {
        title: "IFERROR & Error Trapping",
        content: `🛡️ IFERROR wraps around formulas to catch errors and show a friendly message instead!`,
        formula: '=IFERROR(A1/B1, "N/A")',
        formulaNote: "If A1/B1 causes an error → shows 'N/A' instead of the ugly #DIV/0!",
        content2: `
Real-world examples:

Protect VLOOKUP from #N/A:`,
        formula2: '=IFERROR(VLOOKUP(A2, D:F, 3, 0), "Not Found")',
        formulaNote2: "If the lookup fails, shows 'Not Found' instead of #N/A",
        content3: `
Show 0 instead of divide-by-zero:`,
        formula3: "=IFERROR(C2/D2, 0)",
        formulaNote3: "If D2 is empty or 0, shows 0 instead of #DIV/0!",
        content4: `
IFNA — Only catches #N/A errors (ignores other errors):
=IFNA(VLOOKUP(...), "Missing") → Only catches #N/A, lets other errors show

When to use which:
• IFERROR → Catch ALL errors (most common)
• IFNA → Only catch #N/A (safer for lookups — won't hide real errors)

💡 Best practice: Always wrap VLOOKUP and division formulas with IFERROR!`,
        quiz: {
          q: "What's the difference between IFERROR and IFNA?",
          opts: ["They are the same", "IFERROR catches all errors, IFNA only catches #N/A", "IFNA is newer and replaces IFERROR", "IFERROR only works with VLOOKUP"],
          ans: 1,
        },
      },
    ],
  },
  {
    id: "sparklines", icon: "✨", title: "Sparklines & Mini Charts", badge: "b-blue", badgeText: "Advanced",
    lessons: [
      {
        title: "What are Sparklines?",
        content: `✨ Sparklines are tiny charts that fit inside a single cell — perfect for showing trends at a glance!

Types of Sparklines:
📈 Line — shows trends over time
📊 Column — shows individual value comparisons
🏆 Win/Loss — shows positive/negative results

Creating a Sparkline:
1. Click the cell where you want the sparkline
2. Go to Insert tab → Sparklines section
3. Choose Line, Column, or Win/Loss
4. Data Range: Select your numbers (e.g. B2:M2 for 12 months)
5. Click OK — a mini chart appears in your cell! 🎉

Example: Monthly sales in B2:M2
• Insert Line Sparkline → shows the sales trend in one cell
• Copy the cell down → each row gets its own sparkline

💡 Sparklines are amazing for dashboards:
• One column of sparklines next to your data
• Instantly see which products are trending up or down
• They print and look great in reports

To delete: Click the sparkline cell → Sparkline tab → Clear`,
        formula: null,
        quiz: {
          q: "What is a Sparkline in Excel?",
          opts: ["A type of formula", "A tiny chart inside a single cell", "A conditional format", "A type of filter"],
          ans: 1,
        },
      },
      {
        title: "Customizing Sparklines",
        content: `🎨 Make your sparklines informative and beautiful!

After creating a sparkline, click it → Sparkline tab appears:

Highlight Points:
✅ High Point — marks the highest value
✅ Low Point — marks the lowest value
✅ First Point / Last Point — marks start and end
✅ Negative Points — highlights negative values in red
✅ Markers — shows dots at every data point (Line only)

Change Colors:
• Sparkline Color → Change the line/bar color
• Marker Color → Change individual marker colors
• High Point can be green, Low Point can be red

Change Type:
• Switch between Line, Column, Win/Loss anytime

Axis Options (Sparkline tab → Axis):
• Same scale for all sparklines → Makes comparison fair
• Different scale per sparkline → Shows individual trends better

Grouping Sparklines:
• Select all sparkline cells → they format together
• Useful for consistent colors and scales across rows

💡 Pro combo: Use a sparkline column next to your data, then conditional formatting on the last month's value → instant dashboard!`,
        formula: null,
        quiz: {
          q: "How do you highlight the highest value in a Sparkline?",
          opts: ["Use conditional formatting", "Click Sparkline tab → check 'High Point'", "Use the MAX formula", "Right-click → Format"],
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
