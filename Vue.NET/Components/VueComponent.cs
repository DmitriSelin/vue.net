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

        // string html = $@"
        //     <div id=""{componentId}""></div>
        //     <script>
        //         window.mountVueComponent('{name}', '{componentId}');
        //     </script>";
        string html = @"<script src=""/js/components/TheButton.js""></script>";

        await Task.CompletedTask;
        return new HtmlContentViewComponentResult(new HtmlString(html));
    }
}
