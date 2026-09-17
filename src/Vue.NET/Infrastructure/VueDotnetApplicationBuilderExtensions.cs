using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace Vue.NET;

public static class VueDotnetApplicationBuilderExtensions
{
    /// <summary>
    /// Serves the configured <see cref="VueDotnetOptions.BridgeDirectory"/> under
    /// <c>/&lt;directory-name&gt;</c>, matching the URLs emitted by the tag helpers.
    /// </summary>
    public static IApplicationBuilder UseVueDotNet(this IApplicationBuilder app)
    {
        app.UseStaticFiles();
        var environment = app.ApplicationServices.GetRequiredService<IHostEnvironment>();
        var options = app.ApplicationServices.GetRequiredService<IOptions<VueDotnetOptions>>().Value;

        if (string.IsNullOrWhiteSpace(options.BridgeDirectory))
        {
            return app;
        }

        var bridgeDirectory = Path.IsPathRooted(options.BridgeDirectory)
            ? options.BridgeDirectory
            : Path.Combine(environment.ContentRootPath, options.BridgeDirectory);

        var requestPath = "/" + VueAssetFileHelper.GetDirectoryName(bridgeDirectory);

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(bridgeDirectory),
            RequestPath = requestPath
        });

        return app;
    }
}
