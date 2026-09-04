namespace ConsultoriaAPI.DTOs.Consultores;

public sealed record ActualizarConsultorDto(
    string NombreCompleto,
    string EmailCorporativo,
    string AreaEspecializacion,
    decimal TarifaHora,
    int CantidadProyectosActivos);
