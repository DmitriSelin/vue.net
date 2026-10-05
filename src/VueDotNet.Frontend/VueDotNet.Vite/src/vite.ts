import fs from 'node:fs';
import path from 'node:path';
import {
  normalizeComponentPath,
  normalizeComponentPatterns,
} from 'vue-dotnet-base';
import type { VueDotnetBuildOptions, VueDotnetProvider } from 'vue-dotnet-base';

/**
 * Fixed output directory for the built bridge. The provider always writes here
 * so it never has to know the host application's wwwroot/static layout.
 * Consumers reference the emitted files through their C# `VueDotnetOptions`.
 */
export const VUE_DOTNET_OUT_DIR = 'dist';
/** UMD bundle file name (including extension). */
export const VUE_DOTNET_JS_FILE_NAME = 'VueDotNet.umd.js';
/** CSS file base name (Vite appends `.css`). */
export const VUE_DOTNET_CSS_FILE_NAME = 'VueDotNet';

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
  configResolved?: (config: VueDotnetResolvedConfig) => void;
}

/** Minimal shape of Vite's `ResolvedConfig` used by `configResolved`. */
export interface VueDotnetResolvedConfig {
  logger?: {
    warn: (msg: string, options?: { timestamp?: boolean }) => void;
  };
}

const VIRTUAL_ID = 'virtual:vue-dotnet-vite/entry';

const DEFAULT_COMPONENTS = 'src/components';

/**
 * Makes a project-root-relative path absolute to Vite's root, as required by
 * `import.meta.glob` and dynamic imports inside the virtual entry.
 */
const toRootPath = (value: string): string => '/' + value;

export function vueDotnet(options: VueDotnetVitePluginOptions = {}): VueDotnetVitePlugin {
  const {
    components: componentsOption,
    registerComponents = {},
    entry,
    autoInit = true,
    selector = '[data-vue-component]',
    name = 'VueMvcBridge',
    base = '/',
    emptyOutDir,
  } = options;

  const patterns =
    componentsOption === false
      ? []
      : normalizeComponentPatterns(componentsOption ?? DEFAULT_COMPONENTS);
  const globPatterns = patterns.map(toRootPath);

  const registrations = Object.entries(registerComponents).map(
    ([componentName, filePath]) => {
      const normalized = normalizeComponentPath(filePath);
      const absolute = path.resolve(process.cwd(), normalized);
      const stat = fs.statSync(absolute, { throwIfNoEntry: false });
      if (!stat) {
        throw new Error(
          `[vue-dotnet-vite] registerComponents: component "${componentName}" was not found at "${filePath}" ` +
            `(resolved to ${absolute}).`,
        );
      }
      if (!stat.isFile()) {
        throw new Error(
          `[vue-dotnet-vite] registerComponents: component "${componentName}" points to "${filePath}", ` +
            `which is not a file.`,
        );
      }
      return { name: componentName, file: toRootPath(normalized) };
    },
  );

  const hasEntry = entry != null;
  const hasSources = patterns.length > 0 || registrations.length > 0;
  const hasConfiguredSources =
    componentsOption !== undefined || registrations.length > 0;
  const warnNoSources = !hasEntry && !hasSources;
  const warnIgnoredOptions = hasEntry && hasConfiguredSources;

  return {
    name: 'vue-dotnet-vite',
    enforce: 'pre',

    resolveId(id) {
      if (id === VIRTUAL_ID) return VIRTUAL_ID;
    },

    load(id) {
      if (id !== VIRTUAL_ID) return;

      const globArg = JSON.stringify(globPatterns.length === 1 ? globPatterns[0] : globPatterns);

      const lines = [
        `import { createBridge } from 'vue-dotnet-vite';`,
        `import 'vue-dotnet-vite/style.css';`,
        ``,
        globPatterns.length > 0
          ? `const components = import.meta.glob(${globArg});`
          : `const components = {};`,
        `const bridge = createBridge({ components, autoInit: ${JSON.stringify(autoInit)}, selector: ${JSON.stringify(selector)} });`,
      ];

      for (const { name: componentName, file } of registrations) {
        lines.push(
          `bridge.registerComponent(${JSON.stringify(componentName)}, () => import(${JSON.stringify(file)}));`,
        );
      }

      lines.push(``);
      return lines.join('\n');
    },

    configResolved(config) {
      const logger = config.logger ?? console;
      if (warnNoSources) {
        logger.warn(
          '[vue-dotnet-vite] No component sources configured. The built bundle will not register any components. ' +
            'Remove `components: false` or pass `components` / `registerComponents` sources.',
          { timestamp: true },
        );
      }
      if (warnIgnoredOptions) {
        logger.warn(
          '[vue-dotnet-vite] `components` and `registerComponents` are ignored when `entry` is provided.',
          { timestamp: true },
        );
      }
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
