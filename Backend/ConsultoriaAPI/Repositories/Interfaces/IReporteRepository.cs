using ConsultoriaAPI.DTOs.Common;
using ConsultoriaAPI.DTOs.Reportes;

namespace ConsultoriaAPI.Repositories.Interfaces;

public interface IReporteRepository
{
    Task<PagedResultDto<ReportePaquetePorAreaDto>> ReportePaquetesPorAreaAsync(
        string? filtroArea, int page, int pageSize, string sortBy, string sortDir,
        CancellationToken cancellationToken = default);

    Task<PagedResultDto<ReporteConsultorTopDto>> ReporteConsultoresTopFacturacionAsync(
        string? filtroArea, int page, int pageSize, string sortBy, string sortDir,
        CancellationToken cancellationToken = default);
}
