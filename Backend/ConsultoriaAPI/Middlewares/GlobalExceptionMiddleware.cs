using System.Net;
using System.Text.Json;
using ConsultoriaAPI.DTOs.Common;
using FluentValidation;

namespace ConsultoriaAPI.Middlewares;

public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error on {Path}", context.Request.Path);
            await WriteErrorResponseAsync(context, HttpStatusCode.BadRequest,
                "Error de validación.",
                ex.Errors.Select(e => e.ErrorMessage));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access on {Path}", context.Request.Path);
            await WriteErrorResponseAsync(context, HttpStatusCode.Unauthorized,
                ex.Message, []);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found on {Path}", context.Request.Path);
            await WriteErrorResponseAsync(context, HttpStatusCode.NotFound,
                ex.Message, []);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception on {Path}", context.Request.Path);
            await WriteErrorResponseAsync(context, HttpStatusCode.InternalServerError,
                "Ocurrió un error interno en el servidor.", []);
        }
    }

    private static async Task WriteErrorResponseAsync(
        HttpContext context,
        HttpStatusCode statusCode,
        string message,
        IEnumerable<string> errors)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = new ApiErrorResponse
        {
            Status = (int)statusCode,
            Message = message,
            Errors = errors
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, JsonOptions));
    }
}
