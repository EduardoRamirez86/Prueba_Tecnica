using System.Data;
using ConsultoriaAPI.Models;
using ConsultoriaAPI.Repositories.Interfaces;
using Dapper;

namespace ConsultoriaAPI.Repositories;

public sealed class PaqueteRepository : IPaqueteRepository
{
    private readonly IDbConnection _db;

    public PaqueteRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Paquete>> ListarAsync(CancellationToken cancellationToken = default)
    {
        return await _db.QueryAsync<Paquete>(
            "dbo.sp_ListarPaquetes",
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Paquete?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);

        return await _db.QueryFirstOrDefaultAsync<Paquete>(
            "dbo.sp_ObtenerPaquetePorId",
            parameters,
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> CrearAsync(string nombre, string descripcion, string area, decimal precio, CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Nombre", nombre);
        parameters.Add("@Descripcion", descripcion);
        parameters.Add("@Area", area);
        parameters.Add("@Precio", precio);

        var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
            "dbo.sp_CrearPaquete",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (int)(result?.Id ?? 0);
    }

    public async Task<int> ActualizarAsync(int id, string nombre, string descripcion, string area, decimal precio, CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);
        parameters.Add("@Nombre", nombre);
        parameters.Add("@Descripcion", descripcion);
        parameters.Add("@Area", area);
        parameters.Add("@Precio", precio);

        var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
            "dbo.sp_ActualizarPaquete",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (int)(result?.FilasAfectadas ?? 0);
    }

    public async Task<int> EliminarAsync(int id, CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);

        var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
            "dbo.sp_EliminarPaquete",
            parameters,
            commandType: CommandType.StoredProcedure);

        return (int)(result?.FilasAfectadas ?? 0);
    }
}
