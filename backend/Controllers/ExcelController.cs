using Microsoft.AspNetCore.Mvc;
using ExcelSmartBackend.Models;
using ExcelSmartBackend.Services;

namespace ExcelSmartBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExcelController : ControllerBase
{
    private readonly ExcelService         _excel;
    private readonly ExcelAnalysisService _analysis;
    private readonly ILogger<ExcelController> _log;

    public ExcelController(ExcelService excel, ExcelAnalysisService analysis, ILogger<ExcelController> log)
    {
        _excel    = excel;
        _analysis = analysis;
        _log      = log;
    }

    // ── Generate ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Receives AI-generated data + chart options → returns formatted .xlsx
    /// POST /api/excel/generate
    /// Body: { title, headers, rows, includeChart, chartType }
    /// </summary>
    [HttpPost("generate")]
    public IActionResult Generate([FromBody] ExcelRequest req)
    {
        try
        {
            if (req.Headers == null || req.Headers.Count == 0)
                return BadRequest(new { success = false, message = "Headers are required." });

            var bytes    = _excel.Generate(req);
            var safeName = $"{req.Title.Replace(" ", "_")}.xlsx";
            _log.LogInformation("Generated {Name} ({Bytes} bytes)", safeName, bytes.Length);

            return File(bytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                safeName);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Generate failed");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    // ── Upload & Analyze ──────────────────────────────────────────────────────

    /// <summary>
    /// Upload an .xlsx file → parse, detect errors, return structured JSON.
    /// POST /api/excel/upload
    /// Form-data: file (IFormFile), sheet (optional sheet name)
    /// </summary>
    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] string? sheet = null)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "No file uploaded." });

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (ext != ".xlsx" && ext != ".xls" && ext != ".csv")
                return BadRequest(new { success = false, message = "Only .xlsx, .xls, and .csv files are supported." });

            await using var stream = file.OpenReadStream();
            var result = _analysis.Analyze(stream, file.FileName, sheet);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Upload failed");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    // ── Health ────────────────────────────────────────────────────────────────

    [HttpGet("health")]
    public IActionResult Health() => Ok(new
    {
        status  = "ok",
        engine  = "EPPlus 7 (NonCommercial)",
        framework = "v10.0.103",
        time    = DateTime.UtcNow,
        environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
    });
}
