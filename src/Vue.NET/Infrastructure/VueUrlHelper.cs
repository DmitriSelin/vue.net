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
}
