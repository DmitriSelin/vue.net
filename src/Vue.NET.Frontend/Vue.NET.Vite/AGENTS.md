# Vue.NET.Vite (vue-dotnet-vite)

- The frontend build consumes `vue-dotnet-vite`'s `dist/` (via the `vue-dotnet-vite/vite` plugin and runtime), so build (or watch-build) the lib before building the frontend.
- The frontend build writes `vue.net.umd.js` + `vue.net.css` directly into `src/DocumentationApp/wwwroot/`.
