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
    vueDotnet({
      components: ['src/components', 'src/ui'],
      registerComponents: {
        Toast: 'src/legacy/toast.vue',
      },
    }),
  ],
});
```

Then build:

```bash
npx vite build
```

The plugin auto-registers every component under its file basename in both PascalCase and kebab-case (`TheButton.vue` → `TheButton` / `the-button`), builds a UMD bridge with `vue` externalized to the global `Vue`, and writes:

- `dist/VueDotNet.umd.js`
- `dist/VueDotNet.css`

## Component sources

By default the plugin scans `src/components/**/*.vue`. Configure which components are registered with two independent options:

### `components` — scanned directories, files, or globs

Replaces the default scan. Each entry (relative to the project root) may be a directory, a single `.vue` file, or a glob (`*`, `**`, `?`, `[...]`):

```ts
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

```ts
vueDotnet({
  components: 'src/ui',
  registerComponents: {
    Toast: 'src/legacy/toast.vue',
  },
});
```

Both options may be omitted: then `src/components` is scanned and nothing is registered individually.
