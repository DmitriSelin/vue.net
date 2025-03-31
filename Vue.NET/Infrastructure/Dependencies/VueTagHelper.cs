using System.Reflection;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Vue.NET;

[HtmlTargetElement("body", TagStructure = TagStructure.NormalOrSelfClosing)]
public sealed class VueTagHelper : TagHelper
{
    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (context.Items.ContainsKey(VueConstants.ComponentsLoaded))
            return;

        var vueScript = new TagBuilder("script");
        vueScript.Attributes.Add("src", "https://unpkg.com/vue@3/dist/vue.global.js");

        output.PostContent.AppendHtml(vueScript);

        Assembly currentAssembly = Assembly.GetExecutingAssembly();
        string? resourceName = currentAssembly.GetManifestResourceNames()
            .FirstOrDefault(name => name.EndsWith("vue-wrapper.js"));

        if (resourceName == null)
            throw new FileNotFoundException("vue-wrapper.js not found in assembly's resources");

        using Stream? stream = currentAssembly.GetManifestResourceStream(resourceName);

        if (stream == null)
            throw new FileLoadException("vue-wrapper.js is not accessible for caller");

        using StreamReader reader = new(stream);
        string jsCode = reader.ReadToEnd();

        output.PostContent.AppendHtml($@"
            <script>
                {jsCode}
            </script>");

        context.Items[VueConstants.ComponentsLoaded] = true;
    }
}