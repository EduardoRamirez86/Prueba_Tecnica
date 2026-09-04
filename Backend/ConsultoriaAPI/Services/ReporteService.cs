using ConsultoriaAPI.DTOs.Common;
using ConsultoriaAPI.DTOs.Reportes;
using ConsultoriaAPI.Repositories.Interfaces;
using ConsultoriaAPI.Services.Interfaces;

namespace ConsultoriaAPI.Services;

public sealed class ReporteService : IReporteService
{
    private readonly IReporteRepository _repository;

    public ReporteService(IReporteRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResultDto<ReportePaquetePorAreaDto>> ReportePaquetesPorAreaAsync(
        string? filtroArea, int page, int pageSize, string sortBy, string sortDir,
        CancellationToken cancellationToken = default)
    {
        return await _repository.ReportePaquetesPorAreaAsync(
            filtroArea, page, pageSize, sortBy, sortDir, cancellationToken);
    }

    public async Task<PagedResultDto<ReporteConsultorTopDto>> ReporteConsultoresTopFacturacionAsync(
        string? filtroArea, int page, int pageSize, string sortBy, string sortDir,
        CancellationToken cancellationToken = default)
    {
        return await _repository.ReporteConsultoresTopFacturacionAsync(
            filtroArea, page, pageSize, sortBy, sortDir, cancellationToken);
    }
}
