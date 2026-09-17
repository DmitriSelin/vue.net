using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Vue.NET;

public static class VueDotnetServiceCollectionExtensions
{
    /// <summary>
    /// Registers the Vue.NET bridge, applies values from the "VueDotNet"
    /// configuration section (if present), then applies the provided
    /// configuration action on top.
    /// </summary>
    public static IServiceCollection AddVueDotNet(
        this IServiceCollection services,
        IConfiguration configuration,
        Action<VueDotnetOptions> configure)
    {
        services.AddVueDotNet(configuration);
        services.Configure(configure);
        return services;
    }

    /// <summary>
    /// Registers the Vue.NET bridge, then applies values from the "VueDotNet"
    /// configuration section (if present).
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

            if (section["BridgeDirectory"] is { Length: > 0 } bridgeDirectory)
            {
                options.BridgeDirectory = bridgeDirectory;
            }
        });
    }

    /// <summary>
    /// Registers the Vue.NET bridge, then applies the provided configuration
    /// action on top.
    /// </summary>
    public static IServiceCollection AddVueDotNet(
        this IServiceCollection services,
        Action<VueDotnetOptions> configure)
    {
        services.AddVueDotNet();
        services.Configure(configure);
        return services;
    }

    /// <summary>Registers the Vue.NET bridge services.</summary>
    internal static IServiceCollection AddVueDotNet(this IServiceCollection services)
    {
        services.AddOptions<VueDotnetOptions>();
        return services;
    }
}
