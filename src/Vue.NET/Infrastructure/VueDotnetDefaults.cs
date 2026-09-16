using System.Text.Json;

namespace Vue.NET;

/// <summary>
/// Seeds <see cref="VueDotnetOptions"/> from the embedded <c>vue.net.json</c>
/// shipped with the package. Callers may override these values afterwards.
/// </summary>
internal static class VueDotnetDefaults
{
    private const string SettingsResourceName = "vue.net.json";

    public static void Apply(VueDotnetOptions options)
    {
        var assembly = typeof(VueDotnetDefaults).Assembly;
        using var stream = assembly.GetManifestResourceStream(SettingsResourceName);
        if (stream is null)
        {
            return;
        }

        var loaded = JsonSerializer.Deserialize<VueDotnetOptions>(stream, JsonHelper.BaseOptions);
        if (loaded is null)
        {
            return;
        }

        if (!string.IsNullOrEmpty(loaded.GlobalScriptUrl))
        {
            options.GlobalScriptUrl = loaded.GlobalScriptUrl;
        }

        if (!string.IsNullOrEmpty(loaded.ScriptPath))
        {
            options.ScriptPath = loaded.ScriptPath;
        }

        if (!string.IsNullOrEmpty(loaded.StylePath))
        {
            options.StylePath = loaded.StylePath;
        }
    }
}
