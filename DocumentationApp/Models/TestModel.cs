namespace DocumentationApp.Models.Test;

public sealed class TestModel(int id, string name)
{
    public int Id { get; init; } = id;

    public string Name { get; init; } = name;
}