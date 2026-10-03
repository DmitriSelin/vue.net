# vue-dotnet-vite

Vite build-tool provider for embedding Vue.js components in ASP.NET MVC views. Part of the [VueDotNet](https://github.com/DmitriSelin/vue.net) framework.

## Install

```bash
npm install -D vite @vitejs/plugin-vue vue-dotnet-vite
```

`vue` (v3.5+) is a required peer dependency.

## Usage

Add the plugin to your Vite config:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vueDotnet } from 'vue-dotnet-vite/vite';

export default defineConfig({
  plugins: [
    vue(),
    vueDotnet(),
  ],
});
```

Place your Vue components under `src/components/` and build:

```bash
npx vite build
```

The plugin auto-registers every component matching `src/components/**/*.vue` under its file basename in both PascalCase and kebab-case (`TheButton.vue` → `TheButton` / `the-button`), builds a UMD bridge with `vue` externalized to the global `Vue`, and writes:

- `dist/VueDotNet.umd.js`
- `dist/VueDotNet.css`
