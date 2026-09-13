using System.Text.Json;

namespace Vue.NET;

internal static class JsonHelper
{
    internal static JsonSerializerOptions BaseOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };
}
