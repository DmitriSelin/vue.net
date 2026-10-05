# vue-dotnet-webpack

Webpack build-tool provider for embedding Vue.js components in ASP.NET MVC views. Part of the [VueDotNet](https://github.com/DmitriSelin/vue.net) framework.

## Install

```bash
npm install -D webpack webpack-cli vue-loader vue-dotnet-webpack
```

`vue` (v3.5+) and `webpack` (v5+) are required peer dependencies.

## Usage

Generate a ready-to-run webpack configuration:

```js
// webpack.config.mjs
import { vueDotnet } from 'vue-dotnet-webpack/webpack';

export default vueDotnet({
  components: ['src/components', 'src/ui'],
  registerComponents: {
    Toast: 'src/legacy/toast.vue',
  },
});
```

Then build:

```bash
npx webpack
```

Or embed the provider into an existing configuration as a plugin:

```js
// webpack.config.mjs
import { VueDotnetWebpackPlugin } from 'vue-dotnet-webpack/webpack';

export default {
  plugins: [
    new VueDotnetWebpackPlugin({
      components: 'src/ui',
    }),
  ],
};
```

> The package is ESM-only, so use an ESM webpack config (`webpack.config.mjs` or `"type": "module"`).

The provider auto-registers every component under its file basename in both PascalCase and kebab-case (`TheButton.vue` → `TheButton` / `the-button`), builds a UMD bridge with `vue` externalized to the global `Vue`, and writes:

- `dist/VueDotNet.umd.js`
- `dist/VueDotNet.css`

Components with `<script lang="ts">` need a `tsconfig.json` with at least one TypeScript input (e.g. an `env.d.ts`), otherwise ts-loader reports "No inputs were found".

## Component sources

By default the provider scans `src/components/**/*.vue`. Configure which components are registered with two independent options:

### `components` — scanned directories, files, or globs

Replaces the default scan. Each entry (relative to the project root) may be a directory, a single `.vue` file, or a glob (`*`, `**`, `?`, `[...]`):

```js
vueDotnet({
  components: 'src/ui',                                 // directory
  // components: ['src/ui', 'src/views/Dashboard.vue'], // many sources
  // components: 'src/views/**/*.vue',                  // glob
  // components: ['src/components', 'src/ui'],          // default + extra
  // components: false,                                 // disable scanning
});
```

To keep the default `src/components` scan and add more sources, include it explicitly.

### `registerComponents` — individually named components

Registers components under explicit names (name → `.vue` file, relative to the project root). Names are used verbatim. Works alongside `components`; on a name collision the individually registered component wins. Each path must exist and be a file — otherwise the build fails with an error.

```js
vueDotnet({
  components: 'src/ui',
  registerComponents: {
    Toast: 'src/legacy/toast.vue',
  },
});
```

Both options may be omitted: then `src/components` is scanned and nothing is registered individually.
