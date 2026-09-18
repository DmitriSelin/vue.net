# Vue.NET Documentation

## Get started

Vue.NET has two parts: one NuGet package for your ASP.NET Core MVC app, and one
npm package for your frontend build tool. Pick the frontend package that matches
your build tool (Vite or Webpack).

### Backend — NuGet

Install the single NuGet package:

```
dotnet add package Vue.NET
```

### Frontend — choose one build-tool provider

**Vite — `vue-dotnet-vite`**

```
pnpm add vue
pnpm add -D vite @vitejs/plugin-vue vue-dotnet-vite
```

**Webpack — `vue-dotnet-webpack`**

```
pnpm add vue
pnpm add -D webpack vue-loader vue-dotnet-webpack
```

## Wire up C# and register your `.vue` components

### C# usings and configuration

Add the `Vue.NET` using in `Program.cs`, register the services, and point the
library at your built frontend output:

```csharp
using Vue.NET;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
builder.Services.AddVueDotNet(builder.Configuration, options =>
{
    options.BridgeDirectory = Path.Combine(builder.Environment.ContentRootPath, "frontend", "dist");
});

var app = builder.Build();
app.UseVueDotNet();
// ... rest of your middleware and route mapping
```

Register the package in `Views/_ViewImports.cshtml`:

```cshtml
@using Vue.NET
@addTagHelper *, Vue.NET
```

The `<head>` and `<body>` tag helpers inject the built CSS and JS
automatically, so make sure your layout has those elements.

### Configure via appsettings.json

By default Vue.NET injects the Vue 3 global build from unpkg:
`https://unpkg.com/vue@3/dist/vue.global.prod.js`.

To use a different Vue version or a self-hosted build, override the
`VueDotNet:GlobalScriptUrl` key in `appsettings.json`:

```json
{
  "VueDotNet": {
    "GlobalScriptUrl": "https://unpkg.com/vue@3/dist/vue.global.prod.js"
  }
}
```

### Frontend — register your `.vue` components

**Vite:** add the plugin to `vite.config.ts`:

```ts
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

By default the plugin registers every component matching
`src/components/**/*.vue`. Each component is registered under its file basename
in **both** PascalCase and kebab-case. So `src/components/TheButton.vue` becomes
available as `TheButton` and `the-button`.

Example `src/components/TheButton.vue` with simple props and an event:

```vue
<script setup lang="ts">
defineProps<{
  label: string;
  count?: number;
}>();

const emit = defineEmits<{
  clicked: [count: number];
}>();
</script>

<template>
  <button type="button" @click="emit('clicked', (count ?? 0) + 1)">
    {{ label }} ({{ count ?? 0 }})
  </button>
</template>
```

Build the frontend so the bridge files exist where `BridgeDirectory` points:

```
pnpm build
```

## Use the component from C#

In any Razor view, use the `<vue-component>`. The `name` works in both registered styles:

```html
<!-- PascalCase -->
<vue-component name="TheButton"
               props="new { label = "Click me", count = 1 }"
               events="new { clicked = "onButtonClicked" }" />

<!-- kebab-case -->
<vue-component name="the-button"
               props="new { label = "Click me", count = 1 }"
               events="new { clicked = "onButtonClicked" }" />
```

Both render a mount point and are equivalent.

- `props` accepts anonymous objects, C# models, or raw JSON strings, e.g.
  `props='{"label":"Click me","count":1}'`.
- `events` maps a Vue event to a custom DOM event dispatched on the wrapper
  element. Listen to it from vanilla JavaScript:

```html
<script>
  document.addEventListener('onButtonClicked', (e) => {
    console.log(e.detail); // payload emitted by the component
  });
</script>
```
