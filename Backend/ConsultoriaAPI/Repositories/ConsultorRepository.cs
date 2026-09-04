using System.Data;
using ConsultoriaAPI.Models;
using ConsultoriaAPI.Repositories.Interfaces;
using Dapper;

namespace ConsultoriaAPI.Repositories;

public sealed class ConsultorRepository : IConsultorRepository
{
    private readonly IDbConnection _db;

    public ConsultorRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Consultor>> ListarAsync(CancellationToken cancellationToken = default)
    {
        return await _db.QueryAsync<Consultor>(
            "dbo.sp_ListarConsultores",
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Consultor?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);

        return await _db.QueryFirstOrDefaultAsync<Consultor>(
            "dbo.sp_ObtenerConsultorPorId",
            parameters,
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> CrearAsync(string nombreCompleto, string emailCorporativo, string areaEspecializacion, decimal tarifaHora, int cantidadProyectosActivos, CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@NombreCompleto", nombreCompleto);
        parameters.Add("@EmailCorporativo", emailCorporativo);
        parameters.Add("@AreaEspecializacion", areaEspecializacion);
        parameters.Add("@TarifaHora", tarifaHora);
        parameters.Add("@CantidadProyectosActivos", cantidadProyectosActivos);

        var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
            "dbo.sp_CrearConsultor",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (int)(result?.Id ?? 0);
    }

    public async Task<int> ActualizarAsync(int id, string nombreCompleto, string emailCorporativo, string areaEspecializacion, decimal tarifaHora, int cantidadProyectosActivos, CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);
        parameters.Add("@NombreCompleto", nombreCompleto);
        parameters.Add("@EmailCorporativo", emailCorporativo);
        parameters.Add("@AreaEspecializacion", areaEspecializacion);
        parameters.Add("@TarifaHora", tarifaHora);
        parameters.Add("@CantidadProyectosActivos", cantidadProyectosActivos);

        var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
            "dbo.sp_ActualizarConsultor",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (int)(result?.FilasAfectadas ?? 0);
    }

    public async Task<int> EliminarAsync(int id, CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);

        var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
            "dbo.sp_EliminarConsultor",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (int)(result?.FilasAfectadas ?? 0);
    }
}
