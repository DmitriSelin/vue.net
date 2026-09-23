# Vue.NET.Webpack (vue-dotnet-webpack)

- `vue-dotnet-webpack` is a build-tool provider that implements `VueDotnetProvider` from `vue-dotnet-base`.
- `vue-dotnet-webpack` depends on `vue-dotnet-base` (`../Vue.NET.Base`), so `vue-dotnet-base` must be built (or watch-built) first.
- Build order: `vue-dotnet-base` -> `vue-dotnet-webpack`.
- `vueDotnet(options)` returns a complete webpack configuration (generated `require.context` entry, UMD output, vue/css/ts loaders, `vue` externalized to the global `Vue`).
- `VueDotnetWebpackPlugin` embeds the same setup into an existing webpack configuration.
- The build writes `vue.net.umd.js` + `vue.net.css` into `dist/` (configurable via `outDir`, `jsFileName`, `cssFileName`).
- The package is ESM-only; use an ESM webpack config (`"type": "module"` or `webpack.config.mjs`).
- Components with `<script lang="ts">` need a `tsconfig.json` with at least one TS input (the standard Vue layout includes an `env.d.ts`); otherwise ts-loader reports "No inputs were found".
- The root export stays browser-safe (runtime only re-exports `vue-dotnet-base`); import `vueDotnet`/`VueDotnetWebpackPlugin` from the `vue-dotnet-webpack/webpack` subpath.
