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

export default vueDotnet();
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
  plugins: [new VueDotnetWebpackPlugin()],
};
```

> The package is ESM-only, so use an ESM webpack config (`webpack.config.mjs` or `"type": "module"`).

The provider auto-registers every component matching `src/components/**/*.vue` under its file basename in both PascalCase and kebab-case (`TheButton.vue` → `TheButton` / `the-button`), builds a UMD bridge with `vue` externalized to the global `Vue`, and writes:

- `dist/VueDotNet.umd.js`
- `dist/VueDotNet.css`

Components with `<script lang="ts">` need a `tsconfig.json` with at least one TypeScript input (e.g. an `env.d.ts`), otherwise ts-loader reports "No inputs were found".
