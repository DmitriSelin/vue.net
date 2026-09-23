# Agent development guide

## Basic rules

* Agents can read, write, update, delete files and folders.
* Agents can perform git operations only after my permission.
* Agents can request PRs, issues

## Directory structure

* DocumentationApp - web-app for demonstrating this lib's opportunities and docs
* Vue.NET - main .NET library: core logic of lib
* Vue.NET.Frontend - frontend (TypeScript/Vue) libraries
  * Vue.NET.Base - build-tool-agnostic base runtime (npm package: vue-dotnet-base)
  * Vue.NET.Vite - Vite build-tool provider (npm package: vue-dotnet-vite)

## Commands
- Run dev:
  - Backend: `dotnet build --project src/DocumentationApp`
  - Frontend: `pnpm --dir src/DocumentationApp/frontend dev`
  - vue-dotnet-base (watch build): `pnpm --dir src/Vue.NET.Frontend/Vue.NET.Base dev`
  - vue-dotnet-vite (watch build): `pnpm --dir src/Vue.NET.Frontend/Vue.NET.Vite dev`
  - vue-dotnet-webpack (watch build): `pnpm --dir src/Vue.NET.Frontend/Vue.NET.Webpack dev`
- Build:
  - Backend: `dotnet build --project src/DocumentationApp`
  - vue-dotnet-base: `pnpm --dir src/Vue.NET.Frontend/Vue.NET.Base build`
  - vue-dotnet-vite: `pnpm --dir src/Vue.NET.Frontend/Vue.NET.Vite build`
  - vue-dotnet-webpack: `pnpm --dir src/Vue.NET.Frontend/Vue.NET.Webpack build`
  - Frontend: `pnpm --dir src/DocumentationApp/frontend build`
- Typecheck:
  - vue-dotnet-base: `pnpm --dir src/Vue.NET.Frontend/Vue.NET.Base typecheck`
  - vue-dotnet-vite: `pnpm --dir src/Vue.NET.Frontend/Vue.NET.Vite typecheck`
  - vue-dotnet-webpack: `pnpm --dir src/Vue.NET.Frontend/Vue.NET.Webpack typecheck`
- Test:
  - no tests now
