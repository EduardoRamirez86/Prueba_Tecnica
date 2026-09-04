using ConsultoriaAPI.DTOs.Common;
using ConsultoriaAPI.DTOs.Reportes;

namespace ConsultoriaAPI.Services.Interfaces;

public interface IReporteService
{
    Task<PagedResultDto<ReportePaquetePorAreaDto>> ReportePaquetesPorAreaAsync(
        string? filtroArea, int page, int pageSize, string sortBy, string sortDir,
        CancellationToken cancellationToken = default);

    Task<PagedResultDto<ReporteConsultorTopDto>> ReporteConsultoresTopFacturacionAsync(
        string? filtroArea, int page, int pageSize, string sortBy, string sortDir,
        CancellationToken cancellationToken = default);
}
