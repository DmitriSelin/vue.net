using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Vue.NET;

public static class VueDotnetServiceCollectionExtensions
{
    /// <summary>Registers the Vue.NET bridge seeded from the embedded vue.net.json.</summary>
    public static IServiceCollection AddVueDotNet(this IServiceCollection services)
    {
        services.AddOptions<VueDotnetOptions>();
        services.Configure<VueDotnetOptions>(VueDotnetDefaults.Apply);
        return services;
    }

    /// <summary>
    /// Registers the Vue.NET bridge seeded from vue.net.json, then overrides it with
    /// values from the "VueDotNet" configuration section (if present).
    /// </summary>
    public static IServiceCollection AddVueDotNet(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var section = configuration.GetSection(VueDotnetOptions.SectionName);
        return services.AddVueDotNet(options =>
        {
            if (section["GlobalScriptUrl"] is { Length: > 0 } globalScriptUrl)
            {
                options.GlobalScriptUrl = globalScriptUrl;
            }

            if (section["ScriptPath"] is { Length: > 0 } scriptPath)
            {
                options.ScriptPath = scriptPath;
            }

            if (section["StylePath"] is { Length: > 0 } stylePath)
            {
                options.StylePath = stylePath;
            }
        });
    }

    /// <summary>
    /// Registers the Vue.NET bridge seeded from vue.net.json, then applies the
    /// provided configuration action on top.
    /// </summary>
    public static IServiceCollection AddVueDotNet(
        this IServiceCollection services,
        Action<VueDotnetOptions> configure)
    {
        services.AddVueDotNet();
        services.Configure(configure);
        return services;
    }
}
