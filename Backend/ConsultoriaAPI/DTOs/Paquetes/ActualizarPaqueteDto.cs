namespace ConsultoriaAPI.DTOs.Paquetes;

public sealed record ActualizarPaqueteDto(
    string Nombre,
    string Descripcion,
    string Area,
    decimal Precio);
