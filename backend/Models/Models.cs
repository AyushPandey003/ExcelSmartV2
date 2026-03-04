namespace ExcelSmartBackend.Models;

// ── Generation ────────────────────────────────────────────────────────────────

public class ExcelRequest
{
    public string Title { get; set; } = "Sheet1";
    public List<string> Headers { get; set; } = new();
    public List<List<object>>? Rows { get; set; }
    /// <summary>If true, add a chart sheet based on the data</summary>
    public bool IncludeChart { get; set; } = false;
    /// <summary>Chart type: "Bar", "Line", "Pie", "Column" (default: Column)</summary>
    public string ChartType { get; set; } = "Column";
}

// ── Upload / Analysis ─────────────────────────────────────────────────────────

/// <summary>Returned after parsing an uploaded .xlsx/.xls/.csv file</summary>
public class UploadAnalysisResult
{
    public bool Success { get; set; }
    public string? Error { get; set; }
    public string FileName { get; set; } = "";
    public List<string> SheetNames { get; set; } = new();
    public string ActiveSheet { get; set; } = "";
    public List<string> Headers { get; set; } = new();
    public List<List<string>> Rows { get; set; } = new();
    public int TotalRows { get; set; }
    public int TotalCols { get; set; }
    public List<CellIssue> Issues { get; set; } = new();
    public List<string> Formulas { get; set; } = new();
    public SheetStats Stats { get; set; } = new();
}

public class CellIssue
{
    public string Cell { get; set; } = "";
    public string Type { get; set; } = ""; // "error", "warning", "formula"
    public string Value { get; set; } = "";
    public string Description { get; set; } = "";
}

public class SheetStats
{
    public int NumericCells { get; set; }
    public int TextCells { get; set; }
    public int EmptyCells { get; set; }
    public int FormulaCells { get; set; }
    public int ErrorCells { get; set; }
    public double? Sum { get; set; }
    public double? Average { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
}

// ── AI assistance ─────────────────────────────────────────────────────────────

public class AiExcelRequest
{
    public string Question { get; set; } = "";
    /// <summary>Serialized spreadsheet context (headers + sample rows)</summary>
    public string? SpreadsheetContext { get; set; }
}

public class AiExcelResponse
{
    public bool Success { get; set; }
    public string Answer { get; set; } = "";
}

// ── Formula apply ─────────────────────────────────────────────────────────────

public class ApplyFormulaRequest
{
    public string FileName { get; set; } = "";
    /// <summary>Sheet name to apply formula on</summary>
    public string SheetName { get; set; } = "";
    /// <summary>Target cell, e.g. "E2"</summary>
    public string TargetCell { get; set; } = "";
    /// <summary>Formula string, e.g. "=SUM(B2:D2)"</summary>
    public string Formula { get; set; } = "";
}
