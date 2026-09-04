namespace ConsultoriaAPI.DTOs.Consultores;

public sealed record ConsultorDto(
    int Id,
    string NombreCompleto,
    string EmailCorporativo,
    string AreaEspecializacion,
    decimal TarifaHora,
    int CantidadProyectosActivos,
    bool Activo,
    DateTime FechaCreacion);
