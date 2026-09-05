namespace Vue.NET;

public sealed class Props(Dictionary<string, string> values)
{
    public Dictionary<string, string> Values { get; private set; } = values;

    public static Props DefineProps(params (string, string)[] values)
        => new(values.ToDictionary(x => x.Item1, x => x.Item2));
}
