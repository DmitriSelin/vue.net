namespace Vue.NET;

public sealed class VueDotnetOptions
{
    public const string SectionName = "VueDotNet";

    /// <summary>Default global Vue build used when no explicit value is configured.</summary>
    public const string DefaultGlobalScriptUrl = "https://unpkg.com/vue@3/dist/vue.global.prod.js";

    /// <summary>
    /// URL of the global Vue build injected before the bridge scripts. Overridable
    /// via the "VueDotNet:GlobalScriptUrl" configuration key.
    /// </summary>
    public string GlobalScriptUrl { get; set; } = DefaultGlobalScriptUrl;

    /// <summary>
    /// Filesystem directory containing the built bridge files. May be absolute
    /// or relative to the application's content root. The tag helpers emit one
    /// tag per .js/.css file found in this directory and serve them under
    /// <c>~/&lt;directory-name&gt;</c>.
    /// </summary>
    public string BridgeDirectory { get; set; } = string.Empty;
}
