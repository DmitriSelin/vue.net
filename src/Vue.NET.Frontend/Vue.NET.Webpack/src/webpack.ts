import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { VueDotnetBuildOptions, VueDotnetProvider } from 'vue-dotnet-base';

/**
 * Webpack tooling is resolved against this package's own `node_modules` so the
 * generated configuration works regardless of how the host project hoists its
 * dependencies. All paths end up as absolute loader/module specifiers.
 */
const require = createRequire(import.meta.url);
const vueLoaderPath = require.resolve('vue-loader');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const tsLoaderPath = require.resolve('ts-loader');
const cssLoaderPath = require.resolve('css-loader');
// `vue-dotnet-base` only exposes ESM conditions in its `exports`, so it must
// be resolved with import semantics (`require.resolve` would throw).
const baseEntryPath = fileURLToPath(import.meta.resolve('vue-dotnet-base'));
const baseCssPath = fileURLToPath(
  import.meta.resolve('vue-dotnet-base/style.css'),
);

/**
 * Fixed output directory for the built bridge. The provider always writes here
 * so it never has to know the host application's wwwroot/static layout.
 * Consumers reference the emitted files through their C# `VueDotnetOptions`.
 */
export const VUE_DOTNET_OUT_DIR = 'dist';
/** UMD bundle file name (including extension). */
export const VUE_DOTNET_JS_FILE_NAME = 'vue.net.umd.js';
/** CSS bundle file name (including extension). */
export const VUE_DOTNET_CSS_FILE_NAME = 'vue.net.css';

export interface VueDotnetWebpackPluginOptions extends VueDotnetBuildOptions {
  /** UMD global name. Default: 'VueMvcBridge'. */
  name?: string;
  /** webpack `output.path`, relative to the project root. Default: 'dist'. */
  outDir?: string;
  /** JS bundle file name (including extension). */
  jsFileName?: string;
  /** CSS bundle file name (including extension). */
  cssFileName?: string;
  /** webpack `output.publicPath`. Default: webpack's 'auto'. */
  publicPath?: string;
  /** webpack `output.clean`. Default: true. */
  clean?: boolean;
  /** webpack `mode`. Default: 'production'. */
  mode?: 'development' | 'production' | 'none';
}

/**
 * Minimal structural webpack types. Kept independent of `webpack`'s own types
 * so the published declaration file never references the package's local
 * `webpack` installation.
 */
export interface VueDotnetWebpackPluginLike {
  apply(compiler: unknown): void;
}

export interface VueDotnetWebpackExternalsVue {
  root: string;
  commonjs: string;
  commonjs2: string;
  amd: string;
}

export interface VueDotnetWebpackConfig {
  mode: 'development' | 'production' | 'none';
  entry: string;
  output: {
    path: string;
    filename: string;
    library: { name: string; type: 'umd' };
    globalObject: string;
    publicPath?: string;
    clean?: boolean;
  };
  externals: { vue: VueDotnetWebpackExternalsVue };
  resolve: { extensions: string[] };
  module: { rules: unknown[] };
  plugins: VueDotnetWebpackPluginLike[];
}

interface RequireContextSpec {
  dir: string;
  recursive: boolean;
  regex: RegExp;
}

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Converts a glob into `require.context(dir, recursive, regex)` arguments.
 * Static segments become the context directory; `**` turns on recursion; the
 * remaining pattern is translated into a regexp matched against context keys
 * (which are always prefixed with `./`).
 */
function globToRequireContext(glob: string): RequireContextSpec {
  const normalized = glob
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');

  const segments = normalized.split('/').filter((s) => s.length > 0);

  const dirSegments: string[] = [];
  let recursive = false;
  while (segments.length > 0) {
    const segment = segments[0];
    if (segment === '**') {
      recursive = true;
      segments.shift();
      continue;
    }
    if (
      segment.includes('*') ||
      segment.includes('?') ||
      segment.includes('[')
    ) {
      break;
    }
    if (recursive) break;
    dirSegments.push(segment);
    segments.shift();
  }

  const dir = path.resolve(dirSegments.join('/') || '.');
  const pattern = segments.join('/') || '**/*';

  let source = '';
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === '*') {
      if (pattern[i + 1] === '*') {
        if (pattern[i + 2] === '/') {
          // `**/` matches zero or more directories (minimatch semantics).
          source += '(?:.*/)?';
          i += 2;
        } else {
          source += '.*';
          i += 1;
        }
      } else {
        source += '[^/]*';
      }
    } else if (ch === '?') {
      source += '[^/]';
    } else {
      source += escapeRegExp(ch);
    }
  }

  return { dir, recursive, regex: new RegExp(`^\\./${source}$`) };
}

interface GeneratedEntryOptions {
  autoInit: boolean;
  selector: string;
}

/**
 * Generates the bridge entry module. Components are collected at compile time
 * via `require.context`, so globs never need to be expanded on disk and watch
 * builds pick up added/removed components. Imports use absolute specifiers
 * because the entry lives in an OS temp directory, outside the host project's
 * module resolution paths.
 *
 * The source is CommonJS on purpose: webpack only expands `require.context`
 * when the module is parsed as CommonJS, so no `import`/`export` syntax is used.
 */
function generateEntrySource(
  contexts: RequireContextSpec[],
  options: GeneratedEntryOptions,
): string {
  const contextArgs = contexts.map(
    (ctx) =>
      `require.context(${JSON.stringify(ctx.dir)}, ${ctx.recursive ? 'true' : 'false'}, ${ctx.regex})`,
  );

  return [
    `// Generated by vue-dotnet-webpack. Keep CommonJS: webpack requires it for \`require.context\`.`,
    `const { createBridge } = require(${JSON.stringify(baseEntryPath)});`,
    `require(${JSON.stringify(baseCssPath)});`,
    ``,
    `const contexts = [${contextArgs.join(', ')}];`,
    `const components = {};`,
    `for (const req of contexts) {`,
    `  for (const key of req.keys()) {`,
    `    components[key] = () => Promise.resolve(req(key)).then((m) => (m && m.default) || m);`,
    `  }`,
    `}`,
    ``,
    `createBridge({ components, autoInit: ${JSON.stringify(options.autoInit)}, selector: ${JSON.stringify(options.selector)} });`,
    ``,
  ].join('\n');
}

/** Writes the generated entry into an OS temp directory. */
function writeTempEntry(source: string): { file: string; dir: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-dotnet-webpack-'));
  const file = path.join(dir, 'entry.cjs');
  fs.writeFileSync(file, source, 'utf8');
  return { file, dir };
}

interface WebpackHook {
  tap(name: string, fn: () => void): void;
}

interface WebpackCompilerHooks {
  afterDone: WebpackHook;
  watchRun: WebpackHook;
  watchClose: WebpackHook;
}

/**
 * Removes the temp entry directory once it is no longer needed. Watch builds
 * keep the entry until the watcher closes, otherwise it is removed right after
 * the first emit.
 */
class TempEntryCleanupPlugin {
  readonly name = 'vue-dotnet-webpack/cleanup';
  private readonly dir: string;
  private watching = false;

  constructor(dir: string) {
    this.dir = dir;
  }

  apply(compiler: unknown): void {
    const hooks = (compiler as { hooks: WebpackCompilerHooks }).hooks;
    const cleanup = (): void => {
      fs.rmSync(this.dir, { recursive: true, force: true });
    };
    hooks.watchRun.tap(this.name, () => {
      this.watching = true;
    });
    hooks.afterDone.tap(this.name, () => {
      if (!this.watching) cleanup();
    });
    hooks.watchClose.tap(this.name, cleanup);
  }
}

/**
 * Builds a complete webpack configuration for the Vue.NET bridge:
 * UMD library output, a `require.context`-based generated entry (or a custom
 * one), `vue` externalized to the global `Vue`, and the vue/css/ts loader
 * rules required by the bridge and its SFC components.
 */
export function vueDotnet(
  options: VueDotnetWebpackPluginOptions = {},
): VueDotnetWebpackConfig {
  const {
    components = 'src/components/**/*.vue',
    entry,
    autoInit = true,
    selector = '[data-vue-component]',
    name = 'VueMvcBridge',
    outDir = VUE_DOTNET_OUT_DIR,
    jsFileName = VUE_DOTNET_JS_FILE_NAME,
    cssFileName = VUE_DOTNET_CSS_FILE_NAME,
    publicPath,
    clean = true,
    mode = 'production',
  } = options;

  const patterns = Array.isArray(components) ? components : [components];
  const contexts = patterns.map(globToRequireContext);

  const plugins: VueDotnetWebpackPluginLike[] = [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: cssFileName }),
  ];

  let entryPoint: string;
  if (entry) {
    entryPoint = entry;
  } else {
    const temp = writeTempEntry(
      generateEntrySource(contexts, { autoInit, selector }),
    );
    entryPoint = temp.file;
    plugins.push(new TempEntryCleanupPlugin(temp.dir));
  }

  return {
    mode,
    entry: entryPoint,
    output: {
      path: path.resolve(outDir),
      filename: jsFileName,
      library: { name, type: 'umd' },
      globalObject: 'this',
      ...(publicPath !== undefined ? { publicPath } : {}),
      ...(clean ? { clean: true } : {}),
    },
    externals: {
      vue: { root: 'Vue', commonjs: 'vue', commonjs2: 'vue', amd: 'vue' },
    },
    resolve: {
      extensions: ['.js', '.mjs', '.json', '.vue', '.ts', '.tsx', '.jsx'],
    },
    module: {
      rules: [
        { test: /\.vue$/, loader: vueLoaderPath },
        {
          test: /\.tsx?$/,
          loader: tsLoaderPath,
          options: { transpileOnly: true, appendTsSuffixTo: [/\.vue$/] },
        },
        { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, cssLoaderPath] },
      ],
    },
    plugins,
  };
}

interface WebpackOptionsLike {
  mode?: unknown;
  entry?: unknown;
  output?: Record<string, unknown>;
  externals?: unknown;
  resolve?: { extensions?: string[] };
  module?: { rules?: unknown[] };
  plugins?: unknown[];
}

/**
 * Applies the same setup as `vueDotnet(...)` but as a plugin, so it can be
 * embedded into an existing webpack configuration. The plugin owns entry and
 * output; pass `entry` via its options to use a custom one.
 */
export class VueDotnetWebpackPlugin {
  readonly name = 'vue-dotnet-webpack';
  private readonly config: VueDotnetWebpackConfig;

  constructor(options: VueDotnetWebpackPluginOptions = {}) {
    this.config = vueDotnet(options);
  }

  apply(compiler: unknown): void {
    const opts = (compiler as { options: WebpackOptionsLike }).options;
    const existingExternals = opts.externals;
    const vueExternal = this.config.externals.vue;

    opts.mode = this.config.mode;
    // The plugin mutates already-normalized webpack options, so `entry` must
    // use the normalized description-object shape, not a plain string.
    opts.entry = { main: { import: [this.config.entry] } };
    opts.output = { ...(opts.output ?? {}), ...this.config.output };
    opts.externals = Array.isArray(existingExternals)
      ? [...existingExternals, { vue: vueExternal }]
      : existingExternals && typeof existingExternals === 'object'
        ? { ...existingExternals, vue: vueExternal }
        : { vue: vueExternal };
    opts.resolve = {
      ...opts.resolve,
      extensions: [
        ...(opts.resolve?.extensions ?? []),
        ...this.config.resolve.extensions,
      ],
    };
    opts.module = {
      ...opts.module,
      rules: [...(opts.module?.rules ?? []), ...this.config.module.rules],
    };
    // Append in place: webpack applies plugins by iterating this exact array,
    // so replacing it would silently skip the appended plugins.
    (opts.plugins ??= []).push(...this.config.plugins);
  }
}

/** Webpack implementation of the `VueDotnetProvider` strategy. */
export class WebpackBuildProvider
  implements VueDotnetProvider<VueDotnetWebpackPluginOptions>
{
  readonly name = 'webpack';

  build(options: VueDotnetWebpackPluginOptions = {}): VueDotnetWebpackConfig {
    return vueDotnet(options);
  }
}

export const webpackProvider = new WebpackBuildProvider();
