using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace Vue.NET;

[HtmlTargetElement("head", TagStructure = TagStructure.NormalOrSelfClosing)]
public sealed class VueStylesTagHelper : TagHelper
{
    private const string StylesLoadedKey = "Vue.NET.StylesLoaded";
    private readonly VueDotnetOptions _options;
    private readonly IHostEnvironment _environment;

    public VueStylesTagHelper(IOptions<VueDotnetOptions> options, IHostEnvironment environment)
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
        if (items.ContainsKey(StylesLoadedKey))
        {
            return;
        }

        foreach (var fileName in VueAssetFileHelper.GetFileNames(
                     _options.BridgeDirectory,
                     _environment.ContentRootPath,
                     "*.css"))
        {
            var link = new TagBuilder("link")
            {
                TagRenderMode = TagRenderMode.SelfClosing
            };
            link.Attributes.Add("rel", "stylesheet");
            link.Attributes.Add(
                "href",
                VueUrlHelper.Content(ViewContext, _options.BridgeUrlBase, fileName));
            output.PostContent.AppendHtml(link);
        }

        items[StylesLoadedKey] = true;
    }
}
