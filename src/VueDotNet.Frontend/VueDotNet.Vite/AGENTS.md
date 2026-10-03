# VueDotNet.Vite (vue-dotnet-vite)

- `vue-dotnet-vite` is a build-tool provider that implements `VueDotnetProvider` from `vue-dotnet-base`.
- `vue-dotnet-vite` depends on `vue-dotnet-base` (`../VueDotNet.Base`), so `vue-dotnet-base` must be built (or watch-built) first.
- Build order: `vue-dotnet-base` -> `vue-dotnet-vite` -> frontend.
- The frontend build writes `VueDotNet.umd.js` + `VueDotNet.css` into the consuming frontend's `dist/` directory (the provider's fixed output directory).
