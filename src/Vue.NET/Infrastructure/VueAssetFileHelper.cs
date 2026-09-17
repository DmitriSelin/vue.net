namespace Vue.NET;

internal static class VueAssetFileHelper
{
    internal static IEnumerable<string> GetFileNames(
        string bridgeDirectory,
        string contentRootPath,
        string searchPattern)
    {
        if (string.IsNullOrWhiteSpace(bridgeDirectory))
        {
            return [];
        }

        var directory = Path.IsPathRooted(bridgeDirectory)
            ? bridgeDirectory
            : Path.Combine(contentRootPath, bridgeDirectory);

        if (!Directory.Exists(directory))
        {
            return [];
        }

        return Directory
            .EnumerateFiles(directory, searchPattern, SearchOption.TopDirectoryOnly)
            .Select(Path.GetFileName)
            .Where(fileName => !string.IsNullOrEmpty(fileName))
            .Select(fileName => fileName!)
            .OrderBy(fileName => fileName, StringComparer.Ordinal);
    }
}
