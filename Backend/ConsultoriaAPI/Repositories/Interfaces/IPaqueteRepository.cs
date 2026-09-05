using ConsultoriaAPI.Models;

namespace ConsultoriaAPI.Repositories.Interfaces;

public interface IPaqueteRepository
{
    Task<IEnumerable<Paquete>> ListarAsync(CancellationToken cancellationToken = default);
    Task<Paquete?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<int> CrearAsync(string nombre, string descripcion, string area, decimal precio, CancellationToken cancellationToken = default);
    Task<int> ActualizarAsync(int id, string nombre, string descripcion, string area, decimal precio, bool activo, CancellationToken cancellationToken = default);
    Task<int> EliminarAsync(int id, CancellationToken cancellationToken = default);
}
