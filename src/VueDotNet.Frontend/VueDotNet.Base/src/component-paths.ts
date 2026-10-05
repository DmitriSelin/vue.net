/**
 * Shared helpers for normalizing component sources. Both build-tool providers
 * (Vite, webpack) consume these so the same `components` / `registerComponents`
 * configuration behaves identically everywhere.
 *
 * All paths are relative to the project root. A leading `./` or `/` is
 * optional and stripped; backslashes are converted to forward slashes.
 */

const hasGlobMagic = (value: string): boolean =>
  value.includes('*') || value.includes('?') || value.includes('[');

/**
 * Normalizes a single project-root-relative path: backslashes to slashes,
 * optional leading `./` or `/` removed, trailing slash removed.
 */
export const normalizeComponentPath = (value: string): string =>
  value
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

/**
 * Converts component sources into concrete globs:
 * - a path containing glob magic (`*`, `**`, `?`, `[...]`) is used as-is;
 * - a path ending in `.vue` is treated as a single component file;
 * - anything else is treated as a directory and scans `**\/*.vue` recursively.
 *
 * Empty entries are dropped and duplicates are removed.
 */
export const normalizeComponentPatterns = (
  input: string | string[],
): string[] => {
  const entries = Array.isArray(input) ? input : [input];
  const patterns = entries
    .map((entry) => normalizeComponentPath(entry))
    .filter((entry) => entry !== '' && entry !== '.')
    .map((entry) => {
      if (hasGlobMagic(entry) || /\.vue$/i.test(entry)) {
        return entry;
      }
      return `${entry}/**/*.vue`;
    });

  return [...new Set(patterns)];
};
