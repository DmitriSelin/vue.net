namespace Vue.NET;

public sealed class VueDotnetOptions
{
    public const string SectionName = "VueDotNet";

    /// <summary>URL of the global Vue build injected before the bridge script.</summary>
    public string GlobalScriptUrl { get; set; } = string.Empty;

    /// <summary>Application-relative path to the built bridge script.</summary>
    public string ScriptPath { get; set; } = string.Empty;

    /// <summary>Application-relative path to the built bridge stylesheet.</summary>
    public string StylePath { get; set; } = string.Empty;
}
