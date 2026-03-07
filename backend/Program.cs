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

// CORS: allow localhost dev servers + production Static Web App origin
var corsOrigins = new List<string> { "http://localhost:3000", "http://localhost:5173", "https://excelsmart-api.azurewebsites.net" };
var prodOrigin = builder.Configuration["CORS_ORIGIN"];
if (!string.IsNullOrWhiteSpace(prodOrigin)) corsOrigins.Add(prodOrigin);

builder.Services.AddCors(o => o.AddPolicy("React", p =>
    p.WithOrigins(corsOrigins.ToArray())
     .AllowAnyHeader()
     .AllowAnyMethod()));

var app = builder.Build();
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
app.UseCors("React");
app.UseAuthorization();
app.MapControllers();
app.Run();

