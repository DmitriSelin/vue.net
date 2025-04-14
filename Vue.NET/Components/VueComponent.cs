using System.ComponentModel;
using System.Text.Json;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;

namespace Vue.NET;

public class VueComponent : ViewComponent
{
    public virtual async Task<IViewComponentResult> InvokeAsync(string name, Props props)
    {
        string componentId = $"vue-component-{Guid.NewGuid():N}";
        string propsJson = JsonSerializer.Serialize(props.Values);
        await BuildVueComponentAsync(name);

        string html = $@"
            <div id=""{componentId}""></div>
            <script>
                window.mountVueComponent('{name}', '{componentId}');
            </script>";

        await Task.CompletedTask;
        return new HtmlContentViewComponentResult(new HtmlString(html));
    }

    private static async Task BuildVueComponentAsync(string name)
    {
        string filePath = $"wwwroot/js/components/{name}.js";

        string[] lines = await File.ReadAllLinesAsync(filePath);

        for (int i = 0; i < lines.Length; i++)
        {
            if (lines[i].Contains("from \"vue\""))
            {
                lines[i] = lines[i]
                    .Replace("import", "const")
                    .Replace("from \"vue\"", "= Vue");
            }
        }

        await File.WriteAllLinesAsync(filePath, lines);
    }
}
