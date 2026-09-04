using System.Net;
using System.Text;
using System.Text.Json;
using ConsultoriaAPI.DTOs.Common;
using ConsultoriaAPI.Middlewares;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Backend.Tests.Middlewares;

/// <summary>
/// Pruebas unitarias del GlobalExceptionMiddleware verificando la estructura de respuesta estándar.
/// Patrón: Arrange - Act - Assert
/// </summary>
public sealed class GlobalExceptionMiddlewareTests
{
    private readonly Mock<ILogger<GlobalExceptionMiddleware>> _loggerMock = new();

    private static DefaultHttpContext CrearHttpContext()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        return context;
    }

    private static async Task<ApiErrorResponse?> LeerRespuestaAsync(HttpContext context)
    {
        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var json = await new StreamReader(context.Response.Body).ReadToEndAsync();
        return JsonSerializer.Deserialize<ApiErrorResponse>(json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }

    [Fact]
    public async Task Middleware_CuandoLanzaKeyNotFoundException_DebeRetornar404ConEstructuraEstandar()
    {
        // Arrange
        var context = CrearHttpContext();
        var middleware = new GlobalExceptionMiddleware(
            _ => throw new KeyNotFoundException("Recurso no encontrado."),
            _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        var body = await LeerRespuestaAsync(context);
        body.Should().NotBeNull();
        body!.Status.Should().Be(404);
        body.Message.Should().Be("Recurso no encontrado.");
    }

    [Fact]
    public async Task Middleware_CuandoLanzaUnauthorizedAccessException_DebeRetornar401()
    {
        // Arrange
        var context = CrearHttpContext();
        var middleware = new GlobalExceptionMiddleware(
            _ => throw new UnauthorizedAccessException("Credenciales inválidas."),
            _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        var body = await LeerRespuestaAsync(context);
        body!.Status.Should().Be(401);
        body.Message.Should().Be("Credenciales inválidas.");
    }

    [Fact]
    public async Task Middleware_CuandoLanzaValidationException_DebeRetornar400ConListaDeErrores()
    {
        // Arrange
        var context = CrearHttpContext();
        var validationFailures = new List<ValidationFailure>
        {
            new("TarifaHora", "La tarifa por hora debe estar entre 30.00 y 200.00 USD."),
            new("EmailCorporativo", "El email corporativo no tiene un formato válido.")
        };

        var middleware = new GlobalExceptionMiddleware(
            _ => throw new ValidationException(validationFailures),
            _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be((int)HttpStatusCode.BadRequest);
        var body = await LeerRespuestaAsync(context);
        body!.Status.Should().Be(400);
        body.Errors.Should().HaveCount(2);
        body.Errors.Should().Contain("La tarifa por hora debe estar entre 30.00 y 200.00 USD.");
    }

    [Fact]
    public async Task Middleware_CuandoLanzaExcepcionGenerica_DebeRetornar500()
    {
        // Arrange
        var context = CrearHttpContext();
        var middleware = new GlobalExceptionMiddleware(
            _ => throw new Exception("Error inesperado de la BD."),
            _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        var body = await LeerRespuestaAsync(context);
        body!.Status.Should().Be(500);
        body.Message.Should().Be("Ocurrió un error interno en el servidor.");
    }

    [Fact]
    public async Task Middleware_SinExcepciones_DebeDejarPasarLaSolicitud()
    {
        // Arrange
        var context = CrearHttpContext();
        var nextLlamado = false;
        var middleware = new GlobalExceptionMiddleware(
            _ => { nextLlamado = true; return Task.CompletedTask; },
            _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        nextLlamado.Should().BeTrue();
        context.Response.StatusCode.Should().Be(200);
    }
}
