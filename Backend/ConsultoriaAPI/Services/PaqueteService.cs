using ConsultoriaAPI.DTOs.Paquetes;
using ConsultoriaAPI.Repositories.Interfaces;
using ConsultoriaAPI.Services.Interfaces;

namespace ConsultoriaAPI.Services;

public sealed class PaqueteService : IPaqueteService
{
    private readonly IPaqueteRepository _repository;

    public PaqueteService(IPaqueteRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<PaqueteDto>> ListarAsync(CancellationToken cancellationToken = default)
    {
        var paquetes = await _repository.ListarAsync(cancellationToken);
        return paquetes.Select(p => new PaqueteDto(
            p.Id, p.Nombre, p.Descripcion, p.Area, p.Precio, p.Activo, p.FechaCreacion));
    }

    public async Task<PaqueteDto> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var paquete = await _repository.ObtenerPorIdAsync(id, cancellationToken);
        if (paquete is null)
            throw new KeyNotFoundException($"Paquete con Id {id} no encontrado.");

        return new PaqueteDto(
            paquete.Id, paquete.Nombre, paquete.Descripcion, paquete.Area,
            paquete.Precio, paquete.Activo, paquete.FechaCreacion);
    }

    public async Task<int> CrearAsync(CrearPaqueteDto dto, CancellationToken cancellationToken = default)
    {
        return await _repository.CrearAsync(
            dto.Nombre, dto.Descripcion, dto.Area, dto.Precio, cancellationToken);
    }

    public async Task ActualizarAsync(int id, ActualizarPaqueteDto dto, CancellationToken cancellationToken = default)
    {
        var filasAfectadas = await _repository.ActualizarAsync(
            id, dto.Nombre, dto.Descripcion, dto.Area, dto.Precio, cancellationToken);

        if (filasAfectadas == 0)
            throw new KeyNotFoundException($"Paquete con Id {id} no encontrado o ya eliminado.");
    }

    public async Task EliminarAsync(int id, CancellationToken cancellationToken = default)
    {
        var filasAfectadas = await _repository.EliminarAsync(id, cancellationToken);
        if (filasAfectadas == 0)
            throw new KeyNotFoundException($"Paquete con Id {id} no encontrado o ya eliminado.");
    }
}
