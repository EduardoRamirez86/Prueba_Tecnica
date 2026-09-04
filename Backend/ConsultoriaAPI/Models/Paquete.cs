namespace ConsultoriaAPI.Models;

public sealed class Paquete
{
    public int Id { get; init; }
    public string Nombre { get; init; } = string.Empty;
    public string Descripcion { get; init; } = string.Empty;
    public string Area { get; init; } = string.Empty;
    public decimal Precio { get; init; }
    public bool Activo { get; init; }
    public DateTime FechaCreacion { get; init; }
}
