namespace ConsultoriaAPI.DTOs.Paquetes;

public sealed record CrearPaqueteDto(
    string Nombre,
    string Descripcion,
    string Area,
    decimal Precio);
