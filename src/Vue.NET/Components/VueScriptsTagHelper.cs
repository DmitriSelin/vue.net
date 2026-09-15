using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Vue.NET;

[HtmlTargetElement("body", TagStructure = TagStructure.NormalOrSelfClosing)]
public sealed class VueScriptsTagHelper : TagHelper
{
    private const string ScriptsLoadedKey = "Vue.NET.ScriptsLoaded";

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

        var settings = VueSettings.Default;

        var vueScript = new TagBuilder("script");
        vueScript.Attributes.Add("src", settings.GlobalScriptUrl);

        var bridgeScript = new TagBuilder("script");
        bridgeScript.Attributes.Add("src", VueUrlHelper.Content(ViewContext, settings.ScriptPath));

        output.PostContent.AppendHtml(vueScript);
        output.PostContent.AppendHtml(bridgeScript);

        items[ScriptsLoadedKey] = true;
    }
}
