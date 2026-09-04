namespace ConsultoriaAPI.DTOs.Reportes;

public sealed record ReportePaquetePorAreaDto(
    string Area,
    int CantidadPaquetes,
    decimal ValorTotalEconomico,
    decimal PrecioPromedio,
    int TotalCount);
