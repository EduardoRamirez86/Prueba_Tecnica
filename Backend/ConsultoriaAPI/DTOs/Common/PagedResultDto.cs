namespace ConsultoriaAPI.DTOs.Common;

public sealed class PagedResultDto<T>
{
    public IEnumerable<T> Data { get; init; } = [];
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)TotalCount / PageSize) : 0;
}
