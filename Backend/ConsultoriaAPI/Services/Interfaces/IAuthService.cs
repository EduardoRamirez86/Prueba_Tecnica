using ConsultoriaAPI.DTOs.Auth;

namespace ConsultoriaAPI.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
}
