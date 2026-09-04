namespace ConsultoriaAPI.Models;

public sealed class Usuario
{
    public int Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string PasswordHash { get; init; } = string.Empty;
    public string Rol { get; init; } = string.Empty;
    public bool Activo { get; init; }
    public DateTime FechaCreacion { get; init; }
}
