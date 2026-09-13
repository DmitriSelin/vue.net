using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Vue.NET;

[HtmlTargetElement("vue-component")]
public sealed class VueComponentTagHelper : TagHelper
{
    /// <summary>
    /// The registered Vue component name (e.g., 'MyButton').
    /// </summary>
    [HtmlAttributeName("name")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Props passed to the Vue component.
    /// Supports: anonymous objects, C# models, or raw JSON strings.
    /// </summary>
    [HtmlAttributeName("props")]
    public object? Props { get; set; }

    /// <summary>
    /// Event mappings: Vue event name => Custom DOM event name.
    /// Example: new { click = "onButtonClick" }
    /// </summary>
    [HtmlAttributeName("events")]
    public object? Events { get; set; }

    /// <summary>
    /// Optional CSS class to add to the wrapper div.
    /// </summary>
    [HtmlAttributeName("class")]
    public string? WrapperClass { get; set; }

    [HtmlAttributeNotBound]
    [ViewContext]
    public ViewContext ViewContext { get; set; } = null!;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Ensure the tag is rendered as a <div>
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        // 1. Set component name
        output.Attributes.SetAttribute("data-vue-component", Name);

        // 2. Serialize Props
        string propsJson = "{}";
        if (Props != null)
        {
            // If it's a string that looks like JSON, pass it raw.
            if (Props is string rawJson && (rawJson.Trim().StartsWith("{") || rawJson.Trim().StartsWith("[")))
            {
                propsJson = rawJson;
            }
            else
            {
                propsJson = JsonSerializer.Serialize(Props, JsonHelper.BaseOptions);
            }
        }
        output.Attributes.SetAttribute("data-props", propsJson);

        // 3. Serialize Events
        if (Events != null)
        {
            var eventJson = JsonSerializer.Serialize(Events, JsonHelper.BaseOptions);
            output.Attributes.SetAttribute("data-events", eventJson);
        }

        // 4. Add wrapper class (if provided, or default)
        if (!string.IsNullOrEmpty(WrapperClass))
        {
            output.Attributes.Add("class", WrapperClass);
        }
        else
        {
            output.Attributes.Add("class", "vue-bridge-wrapper");
        }

        // 5. Preserve any child content? Usually not, but we leave it empty.
        output.Content.SetHtmlContent(string.Empty);
    }
}
