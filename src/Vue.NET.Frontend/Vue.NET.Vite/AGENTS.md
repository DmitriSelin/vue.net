# Vue.NET.Vite (vue-dotnet-vite)

- `vue-dotnet-vite` is a build-tool provider that implements `VueDotnetProvider` from `vue-dotnet-base`.
- `vue-dotnet-vite` depends on `vue-dotnet-base` (`../Vue.NET.Base`), so `vue-dotnet-base` must be built (or watch-built) first.
- Build order: `vue-dotnet-base` -> `vue-dotnet-vite` -> frontend.
- The frontend build writes `vue.net.umd.js` + `vue.net.css` directly into `src/DocumentationApp/wwwroot/`.
