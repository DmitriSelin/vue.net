using System.Text;
using Api.Common.Constants;

namespace Vue.NET;

public sealed class CodeBuilder
{
    public static string Build(string className, string code)
    {
        if (string.IsNullOrEmpty(className))
            throw new ArgumentNullException(nameof(className), "Classname can not be null or empty");

        if (string.IsNullOrEmpty(code))
            throw new ArgumentNullException(nameof(code), "Code can not be null or empty");

        StringBuilder builder = new();
        AddBaseUsings(ref builder);
        builder.AppendLine("namespace " + CSharpConstants.CodeNamespace + ";");
        builder.AppendLine();
        builder.AppendLine($"public sealed class {className}");
        builder.AppendLine("{");
        builder.AppendLine("public void Do()");
        builder.AppendLine("{");
        builder.AppendLine(code);
        builder.AppendLine("}");
        builder.AppendLine("}");

        return builder.ToString();
    }

    private static void AddBaseUsings(ref StringBuilder builder)
    {
        builder.AppendLine("using System;");
#if false
        builder.AppendLine("using System.Collections.Generic;");
        builder.AppendLine("using System.Linq;");
        builder.AppendLine("using System.Text;");
        builder.AppendLine("using System.Threading.Tasks;");
#endif
    }
}