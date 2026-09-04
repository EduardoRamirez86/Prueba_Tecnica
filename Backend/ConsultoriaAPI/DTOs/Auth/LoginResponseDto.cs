namespace ConsultoriaAPI.DTOs.Auth;

public sealed record LoginResponseDto(string Token, string Email, string Rol, DateTime Expiracion);
