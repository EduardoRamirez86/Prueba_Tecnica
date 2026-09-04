using System.Data;
using ConsultoriaAPI.Models;
using ConsultoriaAPI.Repositories.Interfaces;
using Dapper;

namespace ConsultoriaAPI.Repositories;

public sealed class AuthRepository : IAuthRepository
{
    private readonly IDbConnection _db;

    public AuthRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<Usuario?> ObtenerUsuarioPorEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Email", email);

        return await _db.QueryFirstOrDefaultAsync<Usuario>(
            "dbo.sp_ObtenerUsuarioPorEmail",
            parameters,
            commandType: CommandType.StoredProcedure);
    }
}
