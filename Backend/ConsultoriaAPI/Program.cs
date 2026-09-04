using System.Data;
using System.Text;
using ConsultoriaAPI.Middlewares;
using ConsultoriaAPI.Repositories;
using ConsultoriaAPI.Repositories.Interfaces;
using ConsultoriaAPI.Services;
using ConsultoriaAPI.Services.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ──────────────────────────────────────────────
// 1. Conexión a base de datos (Dapper – sin EF)
// ──────────────────────────────────────────────
builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

// ──────────────────────────────────────────────
// 2. Repositorios
// ──────────────────────────────────────────────
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IPaqueteRepository, PaqueteRepository>();
builder.Services.AddScoped<IConsultorRepository, ConsultorRepository>();
builder.Services.AddScoped<IReporteRepository, ReporteRepository>();

// ──────────────────────────────────────────────
// 3. Servicios
// ──────────────────────────────────────────────
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPaqueteService, PaqueteService>();
builder.Services.AddScoped<IConsultorService, ConsultorService>();
builder.Services.AddScoped<IReporteService, ReporteService>();

// ──────────────────────────────────────────────
// 4. FluentValidation
// ──────────────────────────────────────────────
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// ──────────────────────────────────────────────
// 5. JWT Authentication
// ──────────────────────────────────────────────
var jwtSection = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSection["SecretKey"]
    ?? throw new InvalidOperationException("JWT SecretKey is not configured.");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ──────────────────────────────────────────────
// 6. CORS
// ──────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ──────────────────────────────────────────────
// 7. Controllers
// ──────────────────────────────────────────────
builder.Services.AddControllers();

// ──────────────────────────────────────────────
// 8. Swagger con Bearer Auth
// ──────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ConsultoriaAPI",
        Version = "v1",
        Description = "API REST para gestión de consultoría — .NET 8 + Dapper + JWT"
    });

    // Security definition
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingrese el token JWT con el formato: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ──────────────────────────────────────────────
// 9. Build
// ──────────────────────────────────────────────
var app = builder.Build();

// ──────────────────────────────────────────────
// 10. Middleware Pipeline
// ──────────────────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ConsultoriaAPI v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Expose Program class for testing
public partial class Program { }
