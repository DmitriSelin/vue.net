using System.Text;
using Api.Common.Constants;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis;
using System.Reflection;
using System.Runtime;
using Microsoft.CodeAnalysis.Emit;
using System.Runtime.Loader;

namespace Vue.NET;

public sealed class Evaluator
{
    public void Evaluate()
    {
        FileInfo[] vueFiles = Directory
            .GetFiles(Directory.GetCurrentDirectory(), $"*{VueConstants.FileExtension}", SearchOption.AllDirectories)
            .Select(x => new FileInfo(x))
            .ToArray();

        foreach (FileInfo file in vueFiles)
        {
            using FileStream fs = new(file.FullName, FileMode.Open);
            using StreamReader sr = new(fs);
            string? line;
            StringBuilder codeBuilder = new();
            bool canReadCode = false;

            while ((line = sr.ReadLine()) != null)
            {
                line = line.Trim();

                if (line == CSharpConstants.OpenTag)
                {
                    canReadCode = true;
                    continue;
                }
                else if (line == CSharpConstants.CloseTag)
                {
                    canReadCode = false;
                    continue;
                }

                if (canReadCode)
                    codeBuilder.AppendLine(line);
            }

            string code = CodeBuilder.Build("Test", codeBuilder.ToString());

            SyntaxTree syntaxTree = CSharpSyntaxTree.ParseText(code);
            string assemblyName = Path.GetRandomFileName();

            string[] refPaths =
                [
                typeof(object).GetTypeInfo().Assembly.Location,
                typeof(Console).GetTypeInfo().Assembly.Location,
                Path.Combine(Path.GetDirectoryName(typeof(GCSettings).GetTypeInfo().Assembly.Location)!, "System.Runtime.dll")
                ];
            MetadataReference[] references = refPaths.Select(r => MetadataReference.CreateFromFile(r)).ToArray();

            CSharpCompilation compilation = CSharpCompilation.Create(
                assemblyName,
                syntaxTrees: [syntaxTree],
                references: references,
                options: new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

            using MemoryStream ms = new();
            EmitResult result = compilation.Emit(ms);

            if (result.Success)
            {
                ms.Seek(0, SeekOrigin.Begin);

                Assembly assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
                Type? type = assembly.GetType($"{CSharpConstants.CodeNamespace}.Test");
                object? instance = assembly.CreateInstance($"{CSharpConstants.CodeNamespace}.Test");
                MethodInfo? meth = type?.GetMember("Do").First() as MethodInfo;
                meth?.Invoke(instance, []);
            }
            else
            {
                IEnumerable<Diagnostic> failures = result.Diagnostics.Where(diagnostic =>
                    diagnostic.IsWarningAsError ||
                    diagnostic.Severity == DiagnosticSeverity.Error);

                foreach (Diagnostic diagnostic in failures)
                {
                    Console.Error.WriteLine("\t{0}: {1}", diagnostic.Id, diagnostic.GetMessage());
                }
            }
        }
    }
}