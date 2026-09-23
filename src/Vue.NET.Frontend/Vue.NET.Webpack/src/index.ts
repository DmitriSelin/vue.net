/**
 * Runtime entry point. This module is meant to be bundled for the browser
 * (e.g. from a custom bridge entry), so it must not re-export the Node-only
 * webpack provider at runtime — use the `vue-dotnet-webpack/webpack` subpath
 * for that. The provider's types are re-exported here for convenience.
 */
export * from 'vue-dotnet-base';

export type {
  VueDotnetWebpackConfig,
  VueDotnetWebpackExternalsVue,
  VueDotnetWebpackPluginLike,
  VueDotnetWebpackPluginOptions,
} from './webpack';
