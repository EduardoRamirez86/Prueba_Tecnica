namespace ConsultoriaAPI.DTOs.Paquetes;

public sealed record PaqueteDto(
    int Id,
    string Nombre,
    string Descripcion,
    string Area,
    decimal Precio,
    bool Activo,
    DateTime FechaCreacion);
