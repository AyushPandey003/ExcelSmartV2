using OfficeOpenXml;
using OfficeOpenXml.Style;
using OfficeOpenXml.Drawing.Chart;
using ExcelSmartBackend.Models;
using System.Drawing;

namespace ExcelSmartBackend.Services;

/// <summary>
/// Generates formatted Excel files using EPPlus 7 (NonCommercial license).
/// Supports: styled tables, auto-totals, currency detection, charts (Column, Bar, Line, Pie, Area, Scatter).
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

    // Chart colour palette for multiple series
    private static readonly string[] SeriesColors =
    [
        "#2196F3", "#4CAF50", "#FF9800", "#E91E63",
        "#9C27B0", "#00BCD4", "#FF5722", "#607D8B"
    ];

    public ExcelService(ILogger<ExcelService> log) => _log = log;

    public byte[] Generate(ExcelRequest req)
    {
        int rowCount = req.Rows?.Count ?? 0;
        _log.LogInformation("EPPlus generating: {Title} ({R} rows, {C} cols, chart={Ch}, chartType={Ct})",
            req.Title, rowCount, req.Headers.Count, req.IncludeChart, req.ChartType);

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

                if ((h.Contains("percent") || h.Contains("%") || h.Contains("growth"))
                    && double.TryParse(rowData[c]?.ToString(), out double pct))
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
        if (req.Rows == null || req.Rows.Count == 0) return;

        int rows = req.Rows.Count;

        // Find the first text column (for category labels) and all numeric columns
        int labelCol = -1;
        var numericCols = new List<int>(); // 1-based column indices

        for (int c = 0; c < req.Headers.Count; c++)
        {
            if (IsNumericCol(req.Rows, c))
            {
                numericCols.Add(c + 1);
            }
            else if (labelCol < 0)
            {
                labelCol = c + 1; // use the first text column as labels
            }
        }

        if (numericCols.Count == 0 || labelCol < 0)
        {
            _log.LogWarning("BuildChartSheet: no suitable label/numeric columns found, skipping chart.");
            return;
        }

        // For Pie charts, use only the first numeric series
        bool isPie = req.ChartType.Equals("Pie", StringComparison.OrdinalIgnoreCase);
        if (isPie) numericCols = [numericCols[0]];

        var chartWs = pkg.Workbook.Worksheets.Add("📊 Chart");
        chartWs.View.ShowGridLines = false;
        chartWs.TabColor = ColorTranslator.FromHtml("#21A366");

        // Title cell on chart sheet
        var titleCell = chartWs.Cells[1, 1, 1, 10];
        titleCell.Merge = true;
        titleCell.Value = $"{req.Title} — Chart";
        titleCell.Style.Font.Bold = true;
        titleCell.Style.Font.Size = 16;
        titleCell.Style.Font.Color.SetColor(ExcelDark);
        titleCell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        chartWs.Row(1).Height = 30;

        // Subtitle showing chart type + series count
        var subCell = chartWs.Cells[2, 1, 2, 10];
        subCell.Merge = true;
        subCell.Value = $"{req.ChartType} chart · {numericCols.Count} data series · Generated by ExcelSmart AI";
        subCell.Style.Font.Italic = true;
        subCell.Style.Font.Size = 10;
        subCell.Style.Font.Color.SetColor(ColorTranslator.FromHtml("#666666"));
        chartWs.Row(2).Height = 18;

        // ── Create chart ──────────────────────────────────────────────────────
        ExcelChart chart = req.ChartType.ToLower() switch
        {
            "pie"     => chartWs.Drawings.AddChart("Chart1", eChartType.Pie),
            "line"    => chartWs.Drawings.AddChart("Chart1", eChartType.LineMarkers),
            "bar"     => chartWs.Drawings.AddChart("Chart1", eChartType.BarClustered),
            "area"    => chartWs.Drawings.AddChart("Chart1", eChartType.Area),
            "scatter" => chartWs.Drawings.AddChart("Chart1", eChartType.XYScatter),
            _         => chartWs.Drawings.AddChart("Chart1", eChartType.ColumnClustered),
        };

        chart.Title.Text = req.Title;
        chart.Title.Font.Bold = true;
        chart.Title.Font.Size = 14;

        // Position: row 3, starting at column A, 800×480 pixels
        chart.SetPosition(3, 0, 0, 0);
        chart.SetSize(820, 480);

        // ── Data ranges ───────────────────────────────────────────────────────
        // Data rows are rows 3…(2+rows) on the data sheet
        var labelRange = dataWs.Cells[3, labelCol, 2 + rows, labelCol];

        // For Scatter chart, X axis = first numeric col, rest = Y series
        if (req.ChartType.Equals("Scatter", StringComparison.OrdinalIgnoreCase) && numericCols.Count >= 2)
        {
            var xRange = dataWs.Cells[3, numericCols[0], 2 + rows, numericCols[0]];
            for (int i = 1; i < numericCols.Count; i++)
            {
                var yRange = dataWs.Cells[3, numericCols[i], 2 + rows, numericCols[i]];
                var s = chart.Series.Add(yRange, xRange);
                s.Header = req.Headers[numericCols[i] - 1];
            }
        }
        else
        {
            int colorIdx = 0;
            foreach (int numCol in numericCols)
            {
                var valRange = dataWs.Cells[3, numCol, 2 + rows, numCol];
                var series   = chart.Series.Add(valRange, labelRange);
                series.Header = req.Headers[numCol - 1];
                colorIdx++;
            }
        }

        // ── Chart styling ─────────────────────────────────────────────────────
        chart.Legend.Position = isPie ? eLegendPosition.Right : eLegendPosition.Bottom;
        chart.Style = eChartStyle.Style10;

        // For non-Pie charts, add axis titles (wrapped in try/catch — some chart types don't support it)
        if (!isPie)
        {
            try
            {
                chart.YAxis.Title.Text = req.Headers[numericCols[0] - 1];
                chart.YAxis.Title.Font.Bold = false;
                chart.XAxis.Title.Text = req.Headers[labelCol - 1];
                chart.XAxis.Title.Font.Bold = false;
            }
            catch { /* Axis titles not supported for all chart types — silently skip */ }
        }

        // ── Legend & info table below chart ───────────────────────────────────
        int infoRow = 33; // below the chart (which ends around row 33 at 480px)
        chartWs.Cells[infoRow, 1].Value = "Series";
        chartWs.Cells[infoRow, 2].Value = "Column";
        chartWs.Cells[infoRow, 1].Style.Font.Bold = true;
        chartWs.Cells[infoRow, 2].Style.Font.Bold = true;

        for (int i = 0; i < numericCols.Count; i++)
        {
            chartWs.Cells[infoRow + 1 + i, 1].Value = req.Headers[numericCols[i] - 1];
            chartWs.Cells[infoRow + 1 + i, 2].Value = $"Column {numericCols[i]} of data sheet";
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    static void SetValue(ExcelRange cell, object? val)
    {
        if (val is null) { cell.Value = ""; return; }
        var s = val.ToString() ?? "";
        if (double.TryParse(s, System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out var d)) cell.Value = d;
        else if (DateTime.TryParse(s, out var dt)) cell.Value = dt;
        else                                       cell.Value = s;
    }

    static bool IsCurrencyHeader(string h) =>
        h.Contains("amount") || h.Contains("price") || h.Contains("salary") ||
        h.Contains("cost")   || h.Contains("value") || h.Contains("sales")  ||
        h.Contains("total")  || h.Contains("budget") || h.Contains("emi")   ||
        h.Contains("revenue")|| h.Contains("profit") || h.Contains("loss")  ||
        h.Contains("income") || h.Contains("expense");

    static bool IsNumericCol(List<List<object>> rows, int col)
    {
        var count = rows.Count(r => col < r.Count && double.TryParse(
            r[col]?.ToString(),
            System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out _));
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
