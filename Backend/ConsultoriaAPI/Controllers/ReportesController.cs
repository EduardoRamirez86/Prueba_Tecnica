using ConsultoriaAPI.DTOs.Common;
using ConsultoriaAPI.DTOs.Reportes;
using ConsultoriaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConsultoriaAPI.Controllers;

[ApiController]
[Route("api/v1/reportes")]
public sealed class ReportesController : ControllerBase
{
    private readonly IReporteService _reporteService;

    public ReportesController(IReporteService reporteService)
    {
        _reporteService = reporteService;
    }

    /// <summary>Reporte de paquetes agrupados por área con paginación y orden.</summary>
    /// <response code="200">Resultado paginado del reporte.</response>
    [Authorize(Roles = "Admin,User")]
    [HttpGet("paquetes-por-area")]
    [ProducesResponseType(typeof(PagedResultDto<ReportePaquetePorAreaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> PaquetesPorArea(
        [FromQuery] string? filtroArea = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortBy = "Area",
        [FromQuery] string sortDir = "ASC",
        CancellationToken cancellationToken = default)
    {
        var resultado = await _reporteService.ReportePaquetesPorAreaAsync(
            filtroArea, page, pageSize, sortBy, sortDir, cancellationToken);
        return Ok(resultado);
    }

    /// <summary>Reporte de consultores con mayor facturación estimada mensual.</summary>
    /// <response code="200">Resultado paginado del reporte.</response>
    [Authorize(Roles = "Admin,User")]
    [HttpGet("consultores-top-facturacion")]
    [ProducesResponseType(typeof(PagedResultDto<ReporteConsultorTopDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ConsultoresTopFacturacion(
        [FromQuery] string? filtroArea = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortBy = "FacturacionEstimada",
        [FromQuery] string sortDir = "DESC",
        CancellationToken cancellationToken = default)
    {
        var resultado = await _reporteService.ReporteConsultoresTopFacturacionAsync(
            filtroArea, page, pageSize, sortBy, sortDir, cancellationToken);
        return Ok(resultado);
    }
}
