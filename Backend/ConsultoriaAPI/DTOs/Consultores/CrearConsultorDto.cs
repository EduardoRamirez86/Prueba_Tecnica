namespace ConsultoriaAPI.DTOs.Consultores;

public sealed record CrearConsultorDto(
    string NombreCompleto,
    string EmailCorporativo,
    string AreaEspecializacion,
    decimal TarifaHora,
    int CantidadProyectosActivos);
