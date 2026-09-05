using ConsultoriaAPI.DTOs.Consultores;
using ConsultoriaAPI.Repositories.Interfaces;
using ConsultoriaAPI.Services.Interfaces;

namespace ConsultoriaAPI.Services;

public sealed class ConsultorService : IConsultorService
{
    private readonly IConsultorRepository _repository;

    public ConsultorService(IConsultorRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ConsultorDto>> ListarAsync(CancellationToken cancellationToken = default)
    {
        var consultores = await _repository.ListarAsync(cancellationToken);
        return consultores.Select(c => new ConsultorDto(
            c.Id, c.NombreCompleto, c.EmailCorporativo, c.AreaEspecializacion,
            c.TarifaHora, c.CantidadProyectosActivos, c.Activo, c.FechaCreacion));
    }

    public async Task<ConsultorDto> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var consultor = await _repository.ObtenerPorIdAsync(id, cancellationToken);
        if (consultor is null)
            throw new KeyNotFoundException($"Consultor con Id {id} no encontrado.");

        return new ConsultorDto(
            consultor.Id, consultor.NombreCompleto, consultor.EmailCorporativo,
            consultor.AreaEspecializacion, consultor.TarifaHora,
            consultor.CantidadProyectosActivos, consultor.Activo, consultor.FechaCreacion);
    }

    public async Task<int> CrearAsync(CrearConsultorDto dto, CancellationToken cancellationToken = default)
    {
        return await _repository.CrearAsync(
            dto.NombreCompleto, dto.EmailCorporativo, dto.AreaEspecializacion,
            dto.TarifaHora, dto.CantidadProyectosActivos, cancellationToken);
    }

    public async Task ActualizarAsync(int id, ActualizarConsultorDto dto, CancellationToken cancellationToken = default)
    {
        var filasAfectadas = await _repository.ActualizarAsync(
            id, dto.NombreCompleto, dto.EmailCorporativo, dto.AreaEspecializacion,
            dto.TarifaHora, dto.CantidadProyectosActivos, dto.Activo, cancellationToken);

        if (filasAfectadas == 0)
            throw new KeyNotFoundException($"Consultor con Id {id} no encontrado o ya eliminado.");
    }

    public async Task EliminarAsync(int id, CancellationToken cancellationToken = default)
    {
        var filasAfectadas = await _repository.EliminarAsync(id, cancellationToken);
        if (filasAfectadas == 0)
            throw new KeyNotFoundException($"Consultor con Id {id} no encontrado o ya eliminado.");
    }
}
