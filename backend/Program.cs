using ExcelSmartBackend.Services;
using OfficeOpenXml;

// ─────────────────────────────────────────────────────────────────────────────
//  EPPlus License Configuration
//  NonCommercialLicense = FREE for personal / educational / non-commercial use.
//  If you use this in a commercial product, set LicenseContext = Commercial
//  and provide a valid license key from https://epplussoftware.com
// ─────────────────────────────────────────────────────────────────────────────
ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "ExcelSmart API (EPPlus)", Version = "v2" }));

builder.Services.AddScoped<ExcelService>();
builder.Services.AddScoped<ExcelAnalysisService>();

var frontendUrl = builder.Configuration["FrontendUrl"];
var allowedOrigins = new List<string> { "http://localhost:3000", "http://localhost:5173" };
if (!string.IsNullOrEmpty(frontendUrl)) {
    allowedOrigins.Add(frontendUrl);
}

builder.Services.AddCors(o => o.AddPolicy("React", p =>
    p.WithOrigins(allowedOrigins.ToArray())
     .AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()));

var app = builder.Build();
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
app.UseCors("React");
app.UseAuthorization();
app.MapControllers();
app.Run();
