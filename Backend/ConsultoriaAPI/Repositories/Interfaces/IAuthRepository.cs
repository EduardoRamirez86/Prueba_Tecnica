using ConsultoriaAPI.Models;

namespace ConsultoriaAPI.Repositories.Interfaces;

public interface IAuthRepository
{
    Task<Usuario?> ObtenerUsuarioPorEmailAsync(string email, CancellationToken cancellationToken = default);
}
