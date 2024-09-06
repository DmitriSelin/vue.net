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

            string sourceFile;
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
        CodeNamespaceImport[] namespaces = GetNameSpaces(code);
        CodeNamespaceImport[] defaultNamespaces = GetDefaultNameSpaces();
        codeNamespace.Imports.AddRange(defaultNamespaces);
        codeNamespace.Imports.AddRange(namespaces);

        CodeTypeDeclaration currentClass = new("Class1");
        codeNamespace.Types.Add(currentClass);

        CodeEntryPointMethod entryPoint = new();
        currentClass.Members.Add(entryPoint);

        return compileUnit;
    }

    private static CodeNamespaceImport[] GetDefaultNameSpaces()
    {
        string[] defaultNameSpaces =
        [
            "System", "System.Collections.Generic",
            "System.Linq", "System.Text",
            "System.Threading.Tasks"
        ];

        return defaultNameSpaces
            .Select(x => new CodeNamespaceImport(x))
            .ToArray();
    }

    private static CodeNamespaceImport[] GetNameSpaces(string code)
    {
        int startSymbolIndex = code.IndexOf("using ");
        int endSymbolIndex = code.IndexOf(";");
        List<CodeNamespaceImport> imports = new();

        if (startSymbolIndex >= 0 && endSymbolIndex >= 0)
        {
            string currentNamespace = code.Substring(startSymbolIndex + 1, endSymbolIndex - startSymbolIndex - 1);
            string fullNamespace = code[startSymbolIndex..endSymbolIndex];
            imports.Add(new CodeNamespaceImport(currentNamespace));
            return GetNameSpaces(code.Replace(fullNamespace, string.Empty));
        }
        else
        {
            return [..imports];
        }
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
        string[] referenceAssemblies = ["System.dll"];
        CompilerParameters cp = new(referenceAssemblies, exeFile, false)
        {
            GenerateExecutable = true
        };

        CompilerResults cr = provider.CompileAssemblyFromFile(cp, sourceFile);
        return cr;
    }
}