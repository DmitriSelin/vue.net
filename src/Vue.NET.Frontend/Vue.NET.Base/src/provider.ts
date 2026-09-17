/**
 * Provider-agnostic build options shared by every Vue.NET build-tool provider.
 */
export interface VueDotnetBuildOptions {
  /**
   * Glob(s) of Vue components to auto-register, relative to the project root.
   * Component names are derived from file basenames and registered under both
   * PascalCase and kebab-case.
   */
  components?: string | string[];
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
 * webpack). It converts common Vue.NET options into tool-specific build
 * configuration/plugins.
 */
export interface VueDotnetProvider<TOptions extends VueDotnetBuildOptions = VueDotnetBuildOptions> {
  /** Build tool name, e.g. "vite". */
  readonly name: string;
  /** Produces the provider-specific build plugin/configuration. */
  build(options?: TOptions): unknown;
}
