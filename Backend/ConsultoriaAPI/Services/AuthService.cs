using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ConsultoriaAPI.DTOs.Auth;
using ConsultoriaAPI.Repositories.Interfaces;
using ConsultoriaAPI.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ConsultoriaAPI.Services;

public sealed class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IAuthRepository authRepository, IConfiguration configuration)
    {
        _authRepository = authRepository;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var usuario = await _authRepository.ObtenerUsuarioPorEmailAsync(request.Email, cancellationToken);

        

        if (usuario is null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
            throw new UnauthorizedAccessException("Credenciales inválidas.");

        if (!usuario.Activo)
            throw new UnauthorizedAccessException("Usuario inactivo.");

        var token = GenerarToken(usuario.Id, usuario.Email, usuario.Rol);
        var expiracion = DateTime.UtcNow.AddMinutes(
            int.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "60"));

        return new LoginResponseDto(token, usuario.Email, usuario.Rol, expiracion);
    }

    private string GenerarToken(int userId, string email, string rol)
    {
        var jwtSection = _configuration.GetSection("Jwt");
        var secretKey = jwtSection["SecretKey"]
            ?? throw new InvalidOperationException("JWT SecretKey is not configured.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, rol)
        };

        var expirationMinutes = int.Parse(jwtSection["ExpirationMinutes"] ?? "60");

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
