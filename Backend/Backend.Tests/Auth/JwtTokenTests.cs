using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Xunit;

namespace Backend.Tests.Auth;

/// <summary>
/// Pruebas unitarias de generación y validación de JWT por rol.
/// Patrón: Arrange - Act - Assert
/// </summary>
public sealed class JwtTokenTests
{
    private const string SecretKey = "TestSecretKey_ForUnitTests_32Chars!";
    private const string Issuer = "ConsultoriaAPI";
    private const string Audience = "ConsultoriaAPI-Clients";

    private static string GenerarToken(int userId, string email, string rol)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, rol)
        };

        var token = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(60),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static ClaimsPrincipal ValidarToken(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var parameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Issuer,
            ValidAudience = Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey)),
            ClockSkew = TimeSpan.Zero
        };

        return handler.ValidateToken(token, parameters, out _);
    }

    [Fact]
    public void GenerarToken_ConRolAdmin_DebeContenerClaimRolAdmin()
    {
        // Arrange
        const int userId = 1;
        const string email = "admin@consultoria.com";
        const string rol = "Admin";

        // Act
        var token = GenerarToken(userId, email, rol);
        var principal = ValidarToken(token);

        // Assert
        principal.Should().NotBeNull();
        principal.FindFirst(ClaimTypes.Role)?.Value.Should().Be("Admin");
    }

    [Fact]
    public void GenerarToken_ConRolUser_DebeContenerClaimRolUser()
    {
        // Arrange
        const int userId = 2;
        const string email = "user@consultoria.com";
        const string rol = "User";

        // Act
        var token = GenerarToken(userId, email, rol);
        var principal = ValidarToken(token);

        // Assert
        principal.Should().NotBeNull();
        principal.FindFirst(ClaimTypes.Role)?.Value.Should().Be("User");
    }

    [Fact]
    public void GenerarToken_DebeContenerClaimEmailYUserId()
    {
        // Arrange
        const int userId = 5;
        const string email = "test@consultoria.com";
        const string rol = "Admin";

        // Act
        var token = GenerarToken(userId, email, rol);
        var principal = ValidarToken(token);

        // Assert
        principal.FindFirst(ClaimTypes.Email)?.Value.Should().Be(email);
        principal.FindFirst(ClaimTypes.NameIdentifier)?.Value.Should().Be(userId.ToString());
    }

    [Fact]
    public void ValidarToken_ConSecretKeyIncorrecta_DebeLanzarSecurityTokenException()
    {
        // Arrange
        var tokenValido = GenerarToken(1, "admin@test.com", "Admin");
        var handler = new JwtSecurityTokenHandler();
        var parametrosInvalidos = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ClaveIncorrecta_32CharsAtLeast!!!")),
            ValidateIssuer = false,
            ValidateAudience = false
        };

        // Act
        var act = () => handler.ValidateToken(tokenValido, parametrosInvalidos, out _);

        // Assert
        act.Should().Throw<SecurityTokenException>();
    }
}
