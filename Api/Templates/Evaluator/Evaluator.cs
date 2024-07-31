using System.Text;
using Api.Common.Constants;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Diagnostics;

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

            string code = codeBuilder.ToString();
            CodeCompileUnit compileUnit = BuildGraph(code);
            CodeDomProvider provider = CodeDomProvider.CreateProvider("CSharp");
            GenerateCode(provider, compileUnit);

            String sourceFile;
            if (provider.FileExtension[0] == '.')
            {
                sourceFile = "TestGraph" + provider.FileExtension;
            }
            else
            {
                sourceFile = "TestGraph." + provider.FileExtension;
            }

            CompilerResults cr = CompileCode(provider, sourceFile, "TestGraph.exe");

            if (cr.Errors.Count > 0)
            {
                //TODO: Create compile error handling
            }
            else
            {
                Process.Start("TestGraph.exe");
            }
        }
    }

    public static CodeCompileUnit BuildGraph(string code)
    {
        CodeCompileUnit compileUnit = new();

        CodeNamespace codeNamespace = new(CSharpConstants.CodeNamespace);
        compileUnit.Namespaces.Add(codeNamespace);
        codeNamespace.Imports.Add(new CodeNamespaceImport("System"));

        CodeTypeDeclaration currentClass = new("Class1");
        codeNamespace.Types.Add(currentClass);

        CodeEntryPointMethod entryPoint = new();
        currentClass.Members.Add(entryPoint);

        return compileUnit;
    }

    public static void GenerateCode(CodeDomProvider provider, CodeCompileUnit codeCompile)
    {
        string sourceFile;

        if (provider.FileExtension[0] == '.')
        {
            sourceFile = "TestGraph" + provider.FileExtension;
        }
        else
        {
            sourceFile = "TestGraph." + provider.FileExtension;
        }

        IndentedTextWriter tw = new(new StreamWriter(sourceFile, false), "    ");
        provider.GenerateCodeFromCompileUnit(codeCompile, tw, new CodeGeneratorOptions());
        tw.Close();
    }

    public static CompilerResults CompileCode(CodeDomProvider provider, string sourceFile, string exeFile)
    {
        String[] referenceAssemblies = ["System.dll"];
        CompilerParameters cp = new(referenceAssemblies, exeFile, false)
        {
            GenerateExecutable = true
        };

        CompilerResults cr = provider.CompileAssemblyFromFile(cp, sourceFile);
        return cr;
    }
}