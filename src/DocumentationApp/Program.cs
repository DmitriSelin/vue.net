using Microsoft.Extensions.FileProviders;
using Vue.NET;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddVueDotNet(builder.Configuration);
builder.Services.AddVueDotNet(options =>
{
    options.BridgeDirectory = Path.Combine(builder.Environment.ContentRootPath, "frontend", "dist");
    options.BridgeUrlBase = "~/dist";
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Serve the fixed-location bridge bundle emitted by vue-dotnet-vite.
var vueDotnetDist = Path.Combine(app.Environment.ContentRootPath, "frontend", "dist");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(vueDotnetDist),
    RequestPath = "/dist"
});

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
