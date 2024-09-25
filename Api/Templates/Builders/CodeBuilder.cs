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
        builder.AppendLine(CSharpConstants.CodeNamespace + ";");
        builder.AppendLine();
        builder.AppendLine($"public sealed class {className}");
        builder.AppendLine("{");
        builder.AppendLine(code);
        builder.AppendLine("}");

        return builder.ToString();
    }
}