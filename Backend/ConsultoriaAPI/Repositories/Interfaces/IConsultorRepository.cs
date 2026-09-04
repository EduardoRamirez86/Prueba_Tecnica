using ConsultoriaAPI.Models;

namespace ConsultoriaAPI.Repositories.Interfaces;

public interface IConsultorRepository
{
    Task<IEnumerable<Consultor>> ListarAsync(CancellationToken cancellationToken = default);
    Task<Consultor?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<int> CrearAsync(string nombreCompleto, string emailCorporativo, string areaEspecializacion, decimal tarifaHora, int cantidadProyectosActivos, CancellationToken cancellationToken = default);
    Task<int> ActualizarAsync(int id, string nombreCompleto, string emailCorporativo, string areaEspecializacion, decimal tarifaHora, int cantidadProyectosActivos, CancellationToken cancellationToken = default);
    Task<int> EliminarAsync(int id, CancellationToken cancellationToken = default);
}
