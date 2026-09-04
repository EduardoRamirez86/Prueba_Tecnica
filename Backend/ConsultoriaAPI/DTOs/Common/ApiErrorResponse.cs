namespace ConsultoriaAPI.DTOs.Common;

public sealed class ApiErrorResponse
{
    public int Status { get; init; }
    public string Message { get; init; } = string.Empty;
    public IEnumerable<string> Errors { get; init; } = [];
}
