using System.Data;
using ConsultoriaAPI.DTOs.Common;
using ConsultoriaAPI.DTOs.Reportes;
using ConsultoriaAPI.Repositories.Interfaces;
using Dapper;

namespace ConsultoriaAPI.Repositories;

public sealed class ReporteRepository : IReporteRepository
{
    private readonly IDbConnection _db;

    public ReporteRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<PagedResultDto<ReportePaquetePorAreaDto>> ReportePaquetesPorAreaAsync(
        string? filtroArea, int page, int pageSize, string sortBy, string sortDir,
        CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltroArea", filtroArea);
        parameters.Add("@Page", page);
        parameters.Add("@PageSize", pageSize);
        parameters.Add("@SortBy", sortBy);
        parameters.Add("@SortDir", sortDir);

        var items = (await _db.QueryAsync<ReportePaquetePorAreaDto>(
            "dbo.sp_ReportePaquetesPorArea",
            parameters,
            commandType: CommandType.StoredProcedure)).ToList();

        int totalCount = items.FirstOrDefault()?.TotalCount ?? 0;

        return new PagedResultDto<ReportePaquetePorAreaDto>
        {
            Data = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PagedResultDto<ReporteConsultorTopDto>> ReporteConsultoresTopFacturacionAsync(
        string? filtroArea, int page, int pageSize, string sortBy, string sortDir,
        CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@FiltroArea", filtroArea);
        parameters.Add("@Page", page);
        parameters.Add("@PageSize", pageSize);
        parameters.Add("@SortBy", sortBy);
        parameters.Add("@SortDir", sortDir);

        var items = (await _db.QueryAsync<ReporteConsultorTopDto>(
            "dbo.sp_ReporteConsultoresTopFacturacion",
            parameters,
            commandType: CommandType.StoredProcedure)).ToList();

        int totalCount = items.FirstOrDefault()?.TotalCount ?? 0;

        return new PagedResultDto<ReporteConsultorTopDto>
        {
            Data = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }
}
