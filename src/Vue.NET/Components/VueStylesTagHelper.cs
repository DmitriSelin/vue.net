using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Vue.NET;

[HtmlTargetElement("head", TagStructure = TagStructure.NormalOrSelfClosing)]
public sealed class VueStylesTagHelper : TagHelper
{
    private const string StylesLoadedKey = "Vue.NET.StylesLoaded";

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

        var settings = VueSettings.Default;

        var link = new TagBuilder("link")
        {
            TagRenderMode = TagRenderMode.SelfClosing
        };
        link.Attributes.Add("rel", "stylesheet");
        link.Attributes.Add("href", VueUrlHelper.Content(ViewContext, settings.StylePath));

        output.PostContent.AppendHtml(link);

        items[StylesLoadedKey] = true;
    }
}
