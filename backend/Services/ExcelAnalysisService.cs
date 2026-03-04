using OfficeOpenXml;
using ExcelSmartBackend.Models;

namespace ExcelSmartBackend.Services;

/// <summary>
/// Parses uploaded Excel files (.xlsx, .csv), extracts data, detects formula
/// errors, and builds a context payload for the AI assistant.
/// </summary>
public class ExcelAnalysisService
{
    private readonly ILogger<ExcelAnalysisService> _log;
    // Excel error strings to flag
    private static readonly HashSet<string> ExcelErrors =
        new(StringComparer.OrdinalIgnoreCase)
        { "#REF!", "#VALUE!", "#DIV/0!", "#NAME?", "#N/A", "#NULL!", "#NUM!", "######" };

    public ExcelAnalysisService(ILogger<ExcelAnalysisService> log) => _log = log;

    /// <summary>Parse an uploaded .xlsx file from a stream.</summary>
    public UploadAnalysisResult Analyze(Stream stream, string fileName, string? requestedSheet = null)
    {
        var result = new UploadAnalysisResult { FileName = fileName };
        try
        {
            using var pkg = new ExcelPackage(stream);
            var wb = pkg.Workbook;

            if (wb.Worksheets.Count == 0)
                return Fail(result, "The workbook has no sheets.");

            result.SheetNames = wb.Worksheets.Select(w => w.Name).ToList();

            // Pick sheet
            ExcelWorksheet ws;
            if (!string.IsNullOrEmpty(requestedSheet) &&
                wb.Worksheets.Any(w => w.Name == requestedSheet))
                ws = wb.Worksheets[requestedSheet];
            else
                ws = wb.Worksheets.First();

            result.ActiveSheet = ws.Name;

            if (ws.Dimension == null)
                return Fail(result, "The selected sheet is empty.");

            int startRow = ws.Dimension.Start.Row;
            int endRow   = ws.Dimension.End.Row;
            int startCol = ws.Dimension.Start.Column;
            int endCol   = ws.Dimension.End.Column;

            result.TotalRows = endRow - startRow;
            result.TotalCols = endCol - startCol + 1;

            // Row 1 → headers
            result.Headers = Enumerable.Range(startCol, endCol - startCol + 1)
                .Select(c => ws.Cells[startRow, c].Text.Trim())
                .ToList();

            // Data rows (up to 200 for preview; full scan for issues)
            var stats = new SheetStats();
            var issues = new List<CellIssue>();
            var formulas = new List<string>();

            int previewEnd = Math.Min(endRow, startRow + 200);

            for (int r = startRow + 1; r <= endRow; r++)
            {
                var row = new List<string>();
                for (int c = startCol; c <= endCol; c++)
                {
                    var cell = ws.Cells[r, c];
                    var text = cell.Text?.Trim() ?? "";

                    // Categorize
                    if (string.IsNullOrEmpty(text))
                        stats.EmptyCells++;
                    else if (cell.Formula is { Length: > 0 })
                    {
                        stats.FormulaCells++;
                        var formulaStr = $"{cell.Address}: ={cell.Formula}";
                        if (!formulas.Contains(formulaStr) && formulas.Count < 30)
                            formulas.Add(formulaStr);
                    }
                    else if (double.TryParse(text, out _))
                        stats.NumericCells++;
                    else
                        stats.TextCells++;

                    // Error detection
                    if (ExcelErrors.Contains(text))
                    {
                        stats.ErrorCells++;
                        issues.Add(new CellIssue
                        {
                            Cell = cell.Address,
                            Type = "error",
                            Value = text,
                            Description = DescribeError(text, cell.Formula),
                        });
                    }

                    if (r <= previewEnd)
                        row.Add(text);
                }
                if (r <= previewEnd)
                    result.Rows.Add(row);
            }

            // Compute stats on first numeric column
            var numericVals = new List<double>();
            for (int r2 = startRow + 1; r2 <= endRow; r2++)
            {
                for (int c2 = startCol; c2 <= endCol; c2++)
                {
                    var t = ws.Cells[r2, c2].Text;
                    if (double.TryParse(t, out var v)) numericVals.Add(v);
                }
            }
            if (numericVals.Count > 0)
            {
                stats.Sum     = Math.Round(numericVals.Sum(), 2);
                stats.Average = Math.Round(numericVals.Average(), 2);
                stats.Min     = numericVals.Min();
                stats.Max     = numericVals.Max();
            }

            result.Stats    = stats;
            result.Issues   = issues.Take(50).ToList();
            result.Formulas = formulas;
            result.Success  = true;
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Failed to analyze {File}", fileName);
            return Fail(result, $"Could not read file: {ex.Message}");
        }
        return result;
    }

    /// <summary>Build a compact AI context string from analysis result.</summary>
    public static string BuildAiContext(UploadAnalysisResult r)
    {
        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"FILE: {r.FileName}  |  SHEET: {r.ActiveSheet}");
        sb.AppendLine($"SIZE: {r.TotalRows} rows × {r.TotalCols} columns");
        sb.AppendLine($"HEADERS: {string.Join(", ", r.Headers)}");

        if (r.Formulas.Count > 0)
            sb.AppendLine($"FORMULAS FOUND: {string.Join(" | ", r.Formulas.Take(10))}");

        if (r.Issues.Count > 0)
            sb.AppendLine($"ERRORS DETECTED: {string.Join(", ", r.Issues.Take(10).Select(i => $"{i.Cell}={i.Value}"))}");

        sb.AppendLine($"STATS: Sum={r.Stats.Sum}, Avg={r.Stats.Average}, Min={r.Stats.Min}, Max={r.Stats.Max}");
        sb.AppendLine($"CELLS: {r.Stats.NumericCells} numeric, {r.Stats.TextCells} text, {r.Stats.EmptyCells} empty, {r.Stats.ErrorCells} errors");

        // Sample rows (first 5)
        if (r.Rows.Count > 0)
        {
            sb.AppendLine("SAMPLE DATA (first 5 rows):");
            foreach (var row in r.Rows.Take(5))
                sb.AppendLine("  " + string.Join(" | ", row));
        }
        return sb.ToString();
    }

    static string DescribeError(string errCode, string? formula) => errCode switch
    {
        "#REF!"   => $"Broken cell reference{(formula != null ? $" in formula: ={formula}" : "")}. A referenced cell was deleted.",
        "#VALUE!" => $"Wrong value type{(formula != null ? $" in ={formula}" : "")}. A cell has text where a number is expected.",
        "#DIV/0!" => $"Division by zero{(formula != null ? $" in ={formula}" : "")}. Use =IFERROR() to handle this.",
        "#NAME?"  => $"Unknown formula name{(formula != null ? $": ={formula}" : "")}. Check spelling of the formula.",
        "#N/A"    => "Value not found. Usually from VLOOKUP/MATCH when the lookup value doesn't exist.",
        "#NULL!"  => "Invalid range operator. Check for missing colon (:) in your range.",
        "#NUM!"   => "Invalid numeric value. The number may be too large or a math error occurred.",
        "######"  => "Column too narrow to display the value. Widen the column.",
        _         => "Unknown error.",
    };

    static UploadAnalysisResult Fail(UploadAnalysisResult r, string msg)
    {
        r.Success = false; r.Error = msg; return r;
    }
}
