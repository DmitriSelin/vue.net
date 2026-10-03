# vue-dotnet-base

Build-tool base runtime for embedding Vue.js components in ASP.NET MVC views. Part of the [VueDotNet](https://github.com/DmitriSelin/vue.net) framework.

> In most projects you won't install this directly. [`vue-dotnet-vite`](https://www.npmjs.com/package/vue-dotnet-vite) or [`vue-dotnet-webpack`](https://www.npmjs.com/package/vue-dotnet-webpack) should be dependencies of your project. Use it directly only if you build your frontend with another toolchain.

## Install

```bash
npm install -D vue-dotnet-base
```

`vue` (v3.5+) is a required peer dependency.

## Usage

Create a bridge entry that registers your `.vue` components and boots the runtime:

```ts
import { createBridge } from 'vue-dotnet-base';
import 'vue-dotnet-base/style.css';

const components = import.meta.glob('./components/**/*.vue');
createBridge({ components });
```

`createBridge` registers every component under its file basename in both PascalCase and kebab-case (`TheButton.vue` → `TheButton` / `the-button`) and auto-mounts any element rendered by the ASP.NET side.

You can also register components manually and control mounting:

```ts
import { createBridge } from 'vue-dotnet-base';

const bridge = createBridge({ autoInit: false });

bridge.registerComponent('TheButton', () => import('./TheButton.vue'));
// or several at once:
bridge.registerComponents({ TheButton: () => import('./TheButton.vue') });

bridge.init();    // mount all [data-vue-component] elements
bridge.destroy(); // unmount them
```

Bundle this entry as a UMD library with `vue` externalized to the global `Vue`, named `VueMvcBridge`, and emit `VueDotNet.umd.js` + `VueDotNet.css`. Point the C# `BridgeDirectory` at the output folder.

## API

- `createBridge({ components?, autoInit?, selector? })` — registers components and auto-initializes on DOM ready. By default `autoInit: true`, `selector: '[data-vue-component]'`.
- `registerComponent(name, loader)` / `registerComponents(registry)` — register component loaders.
- `init(selector?)` / `destroy(selector?)` — mount/unmount rendered `<vue-component>` elements.
