namespace ConsultoriaAPI.DTOs.Reportes;

public sealed record ReporteConsultorTopDto(
    int Id,
    string NombreCompleto,
    string EmailCorporativo,
    string AreaEspecializacion,
    decimal TarifaHora,
    int CantidadProyectosActivos,
    decimal FacturacionEstimada,
    int TotalCount);
