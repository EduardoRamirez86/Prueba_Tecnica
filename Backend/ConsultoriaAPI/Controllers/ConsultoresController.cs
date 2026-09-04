using ConsultoriaAPI.DTOs.Consultores;
using ConsultoriaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConsultoriaAPI.Controllers;

[ApiController]
[Route("api/v1/consultores")]
public sealed class ConsultoresController : ControllerBase
{
    private readonly IConsultorService _consultorService;

    public ConsultoresController(IConsultorService consultorService)
    {
        _consultorService = consultorService;
    }

    /// <summary>Lista todos los consultores activos.</summary>
    /// <response code="200">Lista de consultores.</response>
    [Authorize(Roles = "Admin,User")]
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ConsultorDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(CancellationToken cancellationToken)
    {
        var consultores = await _consultorService.ListarAsync(cancellationToken);
        return Ok(consultores);
    }

    /// <summary>Obtiene un consultor por su Id.</summary>
    /// <response code="200">Consultor encontrado.</response>
    /// <response code="404">Consultor no encontrado.</response>
    [Authorize(Roles = "Admin,User")]
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ConsultorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId([FromRoute] int id, CancellationToken cancellationToken)
    {
        var consultor = await _consultorService.ObtenerPorIdAsync(id, cancellationToken);
        return Ok(consultor);
    }

    /// <summary>Crea un nuevo consultor. [Admin]</summary>
    /// <response code="201">Consultor creado con su Id.</response>
    /// <response code="400">Errores de validación.</response>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Crear([FromBody] CrearConsultorDto dto, CancellationToken cancellationToken)
    {
        var nuevoId = await _consultorService.CrearAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = nuevoId }, new { id = nuevoId });
    }

    /// <summary>Actualiza un consultor existente. [Admin]</summary>
    /// <response code="204">Actualización exitosa.</response>
    /// <response code="400">Errores de validación.</response>
    /// <response code="404">Consultor no encontrado.</response>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Actualizar([FromRoute] int id, [FromBody] ActualizarConsultorDto dto, CancellationToken cancellationToken)
    {
        await _consultorService.ActualizarAsync(id, dto, cancellationToken);
        return NoContent();
    }

    /// <summary>Elimina (soft delete) un consultor. [Admin]</summary>
    /// <response code="204">Eliminación exitosa.</response>
    /// <response code="404">Consultor no encontrado.</response>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Eliminar([FromRoute] int id, CancellationToken cancellationToken)
    {
        await _consultorService.EliminarAsync(id, cancellationToken);
        return NoContent();
    }
}
