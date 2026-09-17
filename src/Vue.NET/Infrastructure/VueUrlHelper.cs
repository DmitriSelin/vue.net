using System.IO;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Vue.NET;

internal static class VueUrlHelper
{
    internal static string Content(ViewContext viewContext, string contentPath)
    {
        var path = contentPath.StartsWith("~/")
            ? contentPath["~".Length..] // "~/vue.net.css" -> "/vue.net.css"
            : contentPath;

        var pathBase = viewContext.HttpContext.Request.PathBase.Value ?? string.Empty;
        return pathBase + path;
    }

    /// <summary>
    /// Builds the URL for a bridge file served under a directory named after
    /// <paramref name="bridgeDirectory"/> (e.g. "frontend/dist" -> "~/dist/file").
    /// </summary>
    internal static string BridgeFileUrl(
        ViewContext viewContext,
        string bridgeDirectory,
        string fileName)
    {
        var directoryName = VueAssetFileHelper.GetDirectoryName(bridgeDirectory);
        var urlBase = string.IsNullOrEmpty(directoryName)
            ? string.Empty
            : "~/" + directoryName;

        return Content(viewContext, $"{urlBase}/{fileName}");
    }
}
