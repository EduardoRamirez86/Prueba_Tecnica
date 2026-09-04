using ConsultoriaAPI.DTOs.Paquetes;
using ConsultoriaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConsultoriaAPI.Controllers;

[ApiController]
[Route("api/v1/paquetes")]
public sealed class PaquetesController : ControllerBase
{
    private readonly IPaqueteService _paqueteService;

    public PaquetesController(IPaqueteService paqueteService)
    {
        _paqueteService = paqueteService;
    }

    /// <summary>Lista todos los paquetes activos.</summary>
    /// <response code="200">Lista de paquetes.</response>
    [Authorize(Roles = "Admin,User")]
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PaqueteDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(CancellationToken cancellationToken)
    {
        var paquetes = await _paqueteService.ListarAsync(cancellationToken);
        return Ok(paquetes);
    }

    /// <summary>Obtiene un paquete por su Id.</summary>
    /// <response code="200">Paquete encontrado.</response>
    /// <response code="404">Paquete no encontrado.</response>
    [Authorize(Roles = "Admin,User")]
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PaqueteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId([FromRoute] int id, CancellationToken cancellationToken)
    {
        var paquete = await _paqueteService.ObtenerPorIdAsync(id, cancellationToken);
        return Ok(paquete);
    }

    /// <summary>Crea un nuevo paquete. [Admin]</summary>
    /// <response code="201">Paquete creado con su Id.</response>
    /// <response code="400">Errores de validación.</response>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Crear([FromBody] CrearPaqueteDto dto, CancellationToken cancellationToken)
    {
        var nuevoId = await _paqueteService.CrearAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = nuevoId }, new { id = nuevoId });
    }

    /// <summary>Actualiza un paquete existente. [Admin]</summary>
    /// <response code="204">Actualización exitosa.</response>
    /// <response code="400">Errores de validación.</response>
    /// <response code="404">Paquete no encontrado.</response>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Actualizar([FromRoute] int id, [FromBody] ActualizarPaqueteDto dto, CancellationToken cancellationToken)
    {
        await _paqueteService.ActualizarAsync(id, dto, cancellationToken);
        return NoContent();
    }

    /// <summary>Elimina (soft delete) un paquete. [Admin]</summary>
    /// <response code="204">Eliminación exitosa.</response>
    /// <response code="404">Paquete no encontrado.</response>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Eliminar([FromRoute] int id, CancellationToken cancellationToken)
    {
        await _paqueteService.EliminarAsync(id, cancellationToken);
        return NoContent();
    }
}
