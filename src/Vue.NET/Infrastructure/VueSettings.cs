using System.Text.Json;

namespace Vue.NET;

internal sealed class VueSettings
{
    private const string SettingsResourceName = "vue.net.json";
    public string GlobalScriptUrl { get; init; } = "https://unpkg.com/vue@3/dist/vue.global.prod.js";
    public string ScriptPath { get; init; } = "~/vue.net.umd.js";
    public string StylePath { get; init; } = "~/vue.net.css";

    public static VueSettings Default { get; } = Load();

    private static VueSettings Load()
    {
        var defaults = new VueSettings();

        var assembly = typeof(VueSettings).Assembly;
        using var stream = assembly.GetManifestResourceStream(SettingsResourceName);
        if (stream is null)
        {
            return defaults;
        }

        var loaded = JsonSerializer.Deserialize<VueSettings>(stream, JsonHelper.BaseOptions);
        if (loaded is null)
        {
            return defaults;
        }

        return new VueSettings
        {
            GlobalScriptUrl = loaded.GlobalScriptUrl ?? defaults.GlobalScriptUrl,
            ScriptPath = loaded.ScriptPath ?? defaults.ScriptPath,
            StylePath = loaded.StylePath ?? defaults.StylePath,
        };
    }
}
