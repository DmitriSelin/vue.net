# VueDotNet

Framework for embedding Vue.js components in an ASP.NET MVC app

[About](#about) · [Download](#download) · [Documentation](https://github.com/DmitriSelin/vue.net/blob/main/DOCUMENTATION.md) · [Contributing](https://github.com/DmitriSelin/vue.net/blob/main/CONTRIBUTING.md)

## About

VueDotNet is a framework that lets you embed Vue components directly into ASP.NET MVC views (`.cshtml` files). There's no need to create a separate SPA. You register components on the frontend and render them from Razor with a `<vue-component>`, passing props and event mappings. The frontend library then auto-mounts every component, keeps props reactive, and injects the generated scripts and styles on the web page.

## Download

The framework consists of the following parts:

- [VueDotNet](https://www.nuget.org/packages/VueDotNet) — NuGet package
- [vue-dotnet-vite](https://www.npmjs.com/package/vue-dotnet-vite) — npm package for applications using Vite
- [vue-dotnet-webpack](https://www.npmjs.com/package/vue-dotnet-webpack) — npm package for applications using Webpack

## Documentation

See the [documentation](https://github.com/DmitriSelin/vue.net/blob/main/DOCUMENTATION.md)

## Contributing

If you have any ideas, issues, etc. regarding VueDotNet or you want to make PRs, please check out the [contributing guide](https://github.com/DmitriSelin/vue.net/blob/main/CONTRIBUTING.md)
