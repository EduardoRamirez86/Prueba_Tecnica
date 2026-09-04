using ConsultoriaAPI.DTOs.Consultores;

namespace ConsultoriaAPI.Services.Interfaces;

public interface IConsultorService
{
    Task<IEnumerable<ConsultorDto>> ListarAsync(CancellationToken cancellationToken = default);
    Task<ConsultorDto> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<int> CrearAsync(CrearConsultorDto dto, CancellationToken cancellationToken = default);
    Task ActualizarAsync(int id, ActualizarConsultorDto dto, CancellationToken cancellationToken = default);
    Task EliminarAsync(int id, CancellationToken cancellationToken = default);
}
