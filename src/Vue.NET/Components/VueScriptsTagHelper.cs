using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace Vue.NET;

[HtmlTargetElement("body", TagStructure = TagStructure.NormalOrSelfClosing)]
public sealed class VueScriptsTagHelper : TagHelper
{
    private const string ScriptsLoadedKey = "Vue.NET.ScriptsLoaded";
    private readonly VueDotnetOptions _options;
    private readonly IHostEnvironment _environment;

    public VueScriptsTagHelper(IOptions<VueDotnetOptions> options, IHostEnvironment environment)
    {
        _options = options.Value;
        _environment = environment;
    }

    [HtmlAttributeNotBound]
    [ViewContext]
    public ViewContext ViewContext { get; set; } = null!;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var items = ViewContext.HttpContext.Items;
        if (items.ContainsKey(ScriptsLoadedKey))
        {
            return;
        }

        if (!string.IsNullOrEmpty(_options.GlobalScriptUrl))
        {
            var vueScript = new TagBuilder("script");
            vueScript.Attributes.Add("src", _options.GlobalScriptUrl);
            output.PostContent.AppendHtml(vueScript);
        }

        foreach (var fileName in VueAssetFileHelper.GetFileNames(
                     _options.BridgeDirectory,
                     _environment.ContentRootPath,
                     "*.js"))
        {
            var bridgeScript = new TagBuilder("script");
            bridgeScript.Attributes.Add(
                "src",
                VueUrlHelper.Content(ViewContext, _options.BridgeUrlBase, fileName));
            output.PostContent.AppendHtml(bridgeScript);
        }

        items[ScriptsLoadedKey] = true;
    }
}
