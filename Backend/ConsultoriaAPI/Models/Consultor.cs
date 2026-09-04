namespace ConsultoriaAPI.Models;

public sealed class Consultor
{
    public int Id { get; init; }
    public string NombreCompleto { get; init; } = string.Empty;
    public string EmailCorporativo { get; init; } = string.Empty;
    public string AreaEspecializacion { get; init; } = string.Empty;
    public decimal TarifaHora { get; init; }
    public int CantidadProyectosActivos { get; init; }
    public bool Activo { get; init; }
    public DateTime FechaCreacion { get; init; }
}
