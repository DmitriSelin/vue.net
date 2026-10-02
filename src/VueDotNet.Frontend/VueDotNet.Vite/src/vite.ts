import type { VueDotnetBuildOptions, VueDotnetProvider } from 'vue-dotnet-base';

/**
 * Fixed output directory for the built bridge. The provider always writes here
 * so it never has to know the host application's wwwroot/static layout.
 * Consumers reference the emitted files through their C# `VueDotnetOptions`.
 */
export const VUE_DOTNET_OUT_DIR = 'dist';
/** UMD bundle file name (including extension). */
export const VUE_DOTNET_JS_FILE_NAME = 'vue.net.umd.js';
/** CSS file base name (Vite appends `.css`). */
export const VUE_DOTNET_CSS_FILE_NAME = 'vue.net';

export interface VueDotnetVitePluginOptions extends VueDotnetBuildOptions {
  /** UMD global name. Default: 'VueMvcBridge'. */
  name?: string;
  /** Vite `base`. Default: '/'. */
  base?: string;
  /** Vite `build.emptyOutDir`. */
  emptyOutDir?: boolean;
}

/**
 * Minimal structural Vite plugin type. Kept independent of `vite`'s own types so
 * the published declaration file never references the package's local `vite`.
 */
export interface VueDotnetVitePlugin {
  name: string;
  enforce?: 'pre' | 'post';
  resolveId?: (id: string) => string | undefined;
  load?: (id: string) => string | undefined;
  config?: () => Record<string, unknown>;
}

const VIRTUAL_ID = 'virtual:vue-dotnet-vite/entry';

const normalizeGlob = (glob: string): string => '/' + glob.replace(/^\.?\//, '');

export function vueDotnet(options: VueDotnetVitePluginOptions = {}): VueDotnetVitePlugin {
  const {
    components = 'src/components/**/*.vue',
    entry,
    autoInit = true,
    selector = '[data-vue-component]',
    name = 'VueMvcBridge',
    base = '/',
    emptyOutDir,
  } = options;

  const patterns = (Array.isArray(components) ? components : [components]).map(normalizeGlob);

  return {
    name: 'vue-dotnet-vite',
    enforce: 'pre',

    resolveId(id) {
      if (id === VIRTUAL_ID) return VIRTUAL_ID;
    },

    load(id) {
      if (id !== VIRTUAL_ID) return;

      const globArg = JSON.stringify(patterns.length === 1 ? patterns[0] : patterns);

      return [
        `import { createBridge } from 'vue-dotnet-vite';`,
        `import 'vue-dotnet-vite/style.css';`,
        ``,
        `const components = import.meta.glob(${globArg});`,
        `createBridge({ components, autoInit: ${JSON.stringify(autoInit)}, selector: ${JSON.stringify(selector)} });`,
        ``,
      ].join('\n');
    },

    config() {
      const usesVirtualEntry = entry == null;

      return {
        base,
        build: {
          lib: {
            entry: entry ?? VIRTUAL_ID,
            name,
            formats: ['umd'],
            fileName: () => VUE_DOTNET_JS_FILE_NAME,
            cssFileName: VUE_DOTNET_CSS_FILE_NAME,
          },
          rolldownOptions: {
            // Vite path-resolves `lib.entry`, so a virtual module must be passed
            // as the rolldown input instead to go through plugin resolveId.
            ...(usesVirtualEntry ? { input: VIRTUAL_ID } : {}),
            external: ['vue'],
            output: {
              globals: { vue: 'Vue' },
            },
          },
          cssCodeSplit: false,
          outDir: VUE_DOTNET_OUT_DIR,
          ...(emptyOutDir !== undefined ? { emptyOutDir } : {}),
        },
      };
    },
  };
}

/** Vite implementation of the `VueDotnetProvider` strategy. */
export class ViteBuildProvider implements VueDotnetProvider<VueDotnetVitePluginOptions> {
  readonly name = 'vite';

  build(options: VueDotnetVitePluginOptions = {}): VueDotnetVitePlugin {
    return vueDotnet(options);
  }
}

export const viteProvider = new ViteBuildProvider();
