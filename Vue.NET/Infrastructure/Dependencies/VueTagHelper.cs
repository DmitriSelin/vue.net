using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Vue.NET;

[HtmlTargetElement("body", TagStructure = TagStructure.NormalOrSelfClosing)]
public sealed class VueTagHelper : TagHelper
{
    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var vueScript = new TagBuilder("script");
        vueScript.Attributes.Add("src", "https://unpkg.com/vue@3/dist/vue.global.js");

        var wrapperScript = new TagBuilder("script");
        wrapperScript.Attributes.Add("src", "~/js/vue-wrapper.js");

        output.PostContent.AppendHtml(wrapperScript);
        output.PostContent.AppendHtml(vueScript);
    }
}