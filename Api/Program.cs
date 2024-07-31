using Vue.NET;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");
Evaluator evaluator = new();
evaluator.Evaluate();

app.Run();
