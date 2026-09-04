using ConsultoriaAPI.DTOs.Paquetes;

namespace ConsultoriaAPI.Services.Interfaces;

public interface IPaqueteService
{
    Task<IEnumerable<PaqueteDto>> ListarAsync(CancellationToken cancellationToken = default);
    Task<PaqueteDto> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<int> CrearAsync(CrearPaqueteDto dto, CancellationToken cancellationToken = default);
    Task ActualizarAsync(int id, ActualizarPaqueteDto dto, CancellationToken cancellationToken = default);
    Task EliminarAsync(int id, CancellationToken cancellationToken = default);
}
