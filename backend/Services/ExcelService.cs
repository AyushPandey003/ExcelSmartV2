using OfficeOpenXml;
using OfficeOpenXml.Style;
using OfficeOpenXml.Drawing.Chart;
using ExcelSmartBackend.Models;
using System.Drawing;

namespace ExcelSmartBackend.Services;

/// <summary>
/// Generates formatted Excel files using EPPlus 7 (NonCommercial license).
/// Supports: styled tables, auto-totals, currency detection, charts.
/// </summary>
public class ExcelService
{
    private readonly ILogger<ExcelService> _log;

    // Excel brand colours
    private static readonly Color ExcelDark  = ColorTranslator.FromHtml("#1D6F42");
    private static readonly Color ExcelMid   = ColorTranslator.FromHtml("#21A366");
    private static readonly Color ExcelLight = ColorTranslator.FromHtml("#E2EFDA");
    private static readonly Color ExcelAlt   = ColorTranslator.FromHtml("#F2F9F6");
    private static readonly Color White      = Color.White;
    private static readonly Color TextDark   = ColorTranslator.FromHtml("#1C1C1C");

    public ExcelService(ILogger<ExcelService> log) => _log = log;

    public byte[] Generate(ExcelRequest req)
    {
        int rowCount = req.Rows?.Count ?? 0;
        _log.LogInformation("EPPlus generating: {Title} ({R} rows, {C} cols, chart={Ch})",
            req.Title, rowCount, req.Headers.Count, req.IncludeChart);

        using var pkg = new ExcelPackage();
        var ws = pkg.Workbook.Worksheets.Add(SafeName(req.Title));

        int dataEndRow = BuildDataSheet(ws, req);

        // Optional chart sheet
        if (req.IncludeChart && req.Headers.Count >= 2 && rowCount >= 2)
            BuildChartSheet(pkg, ws, req, dataEndRow);

        // Workbook metadata
        pkg.Workbook.Properties.Title   = req.Title;
        pkg.Workbook.Properties.Author  = "ExcelSmart AI";
        pkg.Workbook.Properties.Company = "ExcelSmart (Non-Commercial)";

        return pkg.GetAsByteArray();
    }

    // ── Data sheet ────────────────────────────────────────────────────────────

    private int BuildDataSheet(ExcelWorksheet ws, ExcelRequest req)
    {
        int cols = req.Headers.Count;
        int rows = req.Rows?.Count ?? 0;

        // Row 1: Title bar
        var titleRange = ws.Cells[1, 1, 1, Math.Max(1, cols)];
        titleRange.Merge = true;
        titleRange.Value = req.Title;
        titleRange.Style.Font.Bold = true;
        titleRange.Style.Font.Size = 14;
        titleRange.Style.Font.Color.SetColor(White);
        titleRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
        titleRange.Style.Fill.BackgroundColor.SetColor(ExcelDark);
        titleRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        titleRange.Style.VerticalAlignment   = ExcelVerticalAlignment.Center;
        ws.Row(1).Height = 28;
        ws.Cells[1, 1].Style.Indent = 1;

        // Row 2: Headers
        for (int c = 0; c < cols; c++)
        {
            var cell = ws.Cells[2, c + 1];
            cell.Value = req.Headers[c];
            cell.Style.Font.Bold = true;
            cell.Style.Font.Color.SetColor(White);
            cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
            cell.Style.Fill.BackgroundColor.SetColor(ExcelMid);
            cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            cell.Style.VerticalAlignment   = ExcelVerticalAlignment.Center;
            cell.Style.Border.Bottom.Style = ExcelBorderStyle.Medium;
            cell.Style.Border.Bottom.Color.SetColor(ExcelDark);
        }
        ws.Row(2).Height = 22;

        // Rows 3…: Data
        for (int r = 0; r < rows; r++)
        {
            var rowData = req.Rows?[r];
            if (rowData == null) continue;
            bool even   = r % 2 == 0;

            for (int c = 0; c < rowData.Count && c < cols; c++)
            {
                var cell = ws.Cells[r + 3, c + 1];
                SetValue(cell, rowData[c]);

                cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                cell.Style.Fill.BackgroundColor.SetColor(even ? ExcelAlt : White);
                cell.Style.Border.Bottom.Style = ExcelBorderStyle.Hair;
                cell.Style.Border.Bottom.Color.SetColor(ColorTranslator.FromHtml("#D0E9DA"));
                cell.Style.Font.Color.SetColor(TextDark);
                cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                // Auto-detect currency columns
                var h = req.Headers[c].ToLower();
                if (IsCurrencyHeader(h) && double.TryParse(rowData[c]?.ToString(), out _))
                    cell.Style.Numberformat.Format = "₹#,##0.00";

                if ((h.Contains("percent") || h.Contains("%")) && double.TryParse(rowData[c]?.ToString(), out double pct))
                {
                    cell.Value = pct / 100.0;
                    cell.Style.Numberformat.Format = "0.00%";
                }
            }
        }

        // Totals row
        int dataEnd   = rows + 2;
        int totalsRow = dataEnd + 1;
        bool hasTotals = false;

        for (int c = 0; c < cols; c++)
        {
            if (req.Rows == null || !IsNumericCol(req.Rows, c)) continue;
            var tc = ws.Cells[totalsRow, c + 1];
            tc.Formula = $"SUM({ws.Cells[3, c + 1].Address}:{ws.Cells[dataEnd, c + 1].Address})";
            tc.Style.Font.Bold = true;
            tc.Style.Fill.PatternType = ExcelFillStyle.Solid;
            tc.Style.Fill.BackgroundColor.SetColor(ExcelDark);
            tc.Style.Font.Color.SetColor(White);
            tc.Style.Border.Top.Style = ExcelBorderStyle.Double;
            tc.Style.Border.Top.Color.SetColor(ExcelMid);
            tc.Style.Numberformat.Format = "₹#,##0.00";
            hasTotals = true;
        }

        if (hasTotals)
        {
            var lbl = ws.Cells[totalsRow, 1];
            lbl.Value = "TOTAL";
            lbl.Style.Font.Bold = true;
            lbl.Style.Fill.PatternType = ExcelFillStyle.Solid;
            lbl.Style.Fill.BackgroundColor.SetColor(ExcelDark);
            lbl.Style.Font.Color.SetColor(White);
        }

        // Auto-fit columns
        ws.Cells[ws.Dimension.Address].AutoFitColumns(12, 38);

        // Freeze rows 1+2
        ws.View.FreezePanes(3, 1);

        // Table (for filter arrows)
        if (rows > 0)
        {
            var tbl = ws.Tables.Add(ws.Cells[2, 1, dataEnd, cols], SafeTableName(req.Title));
            tbl.TableStyle = OfficeOpenXml.Table.TableStyles.Medium7;
        }

        // Print setup
        ws.PrinterSettings.PaperSize = ePaperSize.A4;
        ws.PrinterSettings.Orientation = cols > 6 ? eOrientation.Landscape : eOrientation.Portrait;
        ws.PrinterSettings.FitToPage = true;
        ws.PrinterSettings.FitToWidth = 1;
        ws.PrinterSettings.FitToHeight = 0;
        ws.HeaderFooter.OddHeader.CenteredText  = req.Title;
        ws.HeaderFooter.OddFooter.CenteredText  = "Generated by ExcelSmart AI (Non-Commercial)";

        return hasTotals ? totalsRow : dataEnd;
    }

    // ── Chart sheet ───────────────────────────────────────────────────────────

    private void BuildChartSheet(ExcelPackage pkg, ExcelWorksheet dataWs, ExcelRequest req, int dataEndRow)
    {
        if (req.Rows == null) return;

        // Find first label col (text) and first numeric col
        int labelCol   = 1; // assume col 1 is labels
        int valCol     = -1;
        for (int c = 0; c < req.Headers.Count; c++)
        {
            if (IsNumericCol(req.Rows, c)) { valCol = c + 1; break; }
        }
        if (valCol < 0) return;

        var chartWs = pkg.Workbook.Worksheets.Add("📊 Chart");

        // Title
        chartWs.Cells[1, 1].Value = $"{req.Title} — Chart";
        chartWs.Cells[1, 1].Style.Font.Bold = true;
        chartWs.Cells[1, 1].Style.Font.Size = 14;
        chartWs.Cells[1, 1].Style.Font.Color.SetColor(ExcelDark);

        // Create chart
        ExcelChart chart = req.ChartType.ToLower() switch
        {
            "pie"    => chartWs.Drawings.AddChart("Chart1", eChartType.Pie),
            "line"   => chartWs.Drawings.AddChart("Chart1", eChartType.Line),
            "bar"    => chartWs.Drawings.AddChart("Chart1", eChartType.BarClustered),
            _        => chartWs.Drawings.AddChart("Chart1", eChartType.ColumnClustered),
        };

        chart.Title.Text = req.Title;
        chart.SetPosition(2, 0, 0, 0);
        chart.SetSize(800, 450);

        // Data ranges on the data sheet
        int rows = req.Rows?.Count ?? 0;
        var labelRange = dataWs.Cells[3, labelCol, 2 + rows, labelCol];
        var valRange   = dataWs.Cells[3, valCol,   2 + rows, valCol];

        var series = chart.Series.Add(valRange, labelRange);
        series.Header = req.Headers[valCol - 1];

        chart.Legend.Position = eLegendPosition.Bottom;
        chart.Style = eChartStyle.Style10;

        // Second numeric col as extra series (if exists)
        for (int c = valCol; c < req.Headers.Count; c++)
        {
            if (req.Rows == null || !IsNumericCol(req.Rows, c)) continue;
            var extraRange = dataWs.Cells[3, c + 1, 2 + rows, c + 1];
            var s2 = chart.Series.Add(extraRange, labelRange);
            s2.Header = req.Headers[c];
            break; // only 2 series max for clarity
        }

        // Style the chart sheet
        chartWs.View.ShowGridLines = false;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    static void SetValue(ExcelRange cell, object? val)
    {
        if (val is null) { cell.Value = ""; return; }
        var s = val.ToString() ?? "";
        if (double.TryParse(s, out var d))      cell.Value = d;
        else if (DateTime.TryParse(s, out var dt)) cell.Value = dt;
        else                                       cell.Value = s;
    }

    static bool IsCurrencyHeader(string h) =>
        h.Contains("amount") || h.Contains("price") || h.Contains("salary") ||
        h.Contains("cost")   || h.Contains("value") || h.Contains("sales")  ||
        h.Contains("total")  || h.Contains("budget") || h.Contains("emi")   ||
        h.Contains("revenue")|| h.Contains("profit") || h.Contains("loss");

    static bool IsNumericCol(List<List<object>> rows, int col)
    {
        var count = rows.Count(r => col < r.Count && double.TryParse(r[col]?.ToString(), out _));
        return rows.Count > 0 && (double)count / rows.Count > 0.6;
    }

    static string SafeName(string s)
    {
        foreach (var c in new[] { ':', '\\', '/', '?', '*', '[', ']' }) s = s.Replace(c, ' ');
        return s.Length > 31 ? s[..31] : string.IsNullOrWhiteSpace(s) ? "Sheet1" : s;
    }

    static string SafeTableName(string s)
    {
        var clean = new string(s.Where(c => char.IsLetterOrDigit(c) || c == '_').ToArray());
        return string.IsNullOrEmpty(clean) ? "Table1" : $"Tbl_{clean}"[..Math.Min(255, $"Tbl_{clean}".Length)];
    }
}
