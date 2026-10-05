/**
 * Provider-agnostic build options shared by every VueDotNet build-tool provider.
 */
export interface VueDotnetBuildOptions {
  /**
   * Component sources to auto-register, relative to the project root. Each
   * entry may be a directory (`src/ui` scans `src/ui/**\/*.vue`), a single
   * `.vue` file, or a glob (`*`, `**`, `?`, `[...]`). Component names are
   * derived from file basenames and registered under both PascalCase and
   * kebab-case.
   *
   * Default: `src/components`. Passing a value replaces the default — include
   * `src/components` explicitly to keep scanning it. Pass `false` to disable
   * scanning entirely (e.g. when only `registerComponents` is used).
   */
  components?: string | string[] | false;
  /**
   * Individually registered components: name -> path of the `.vue` file,
   * relative to the project root. Names are used verbatim (no case
   * conversion). Merged with scanned components; on a name collision the
   * individually registered component wins.
   *
   * Each path is validated at config time: a missing file (or a path that is
   * not a file) throws an error.
   */
  registerComponents?: Record<string, string>;
  /**
   * Custom build entry. When provided, the provider's generated entry is not
   * used, so the caller is responsible for calling `createBridge(...)` there.
   */
  entry?: string;
  /** Auto-initialize on DOM ready. Default: true. */
  autoInit?: boolean;
  /** Selector scanned by init/destroy. Default: '[data-vue-component]'. */
  selector?: string;
}

/**
 * Strategy interface implemented by each build-tool provider (e.g. Vite,
 * webpack). It converts common VueDotNet options into tool-specific build
 * configuration/plugins.
 */
export interface VueDotnetProvider<TOptions extends VueDotnetBuildOptions = VueDotnetBuildOptions> {
  /** Build tool name, e.g. "vite". */
  readonly name: string;
  /** Produces the provider-specific build plugin/configuration. */
  build(options?: TOptions): unknown;
}
