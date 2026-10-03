# Agent development guide

## Basic rules

* Agents can read, write, update, delete files and folders.
* Agents can perform git operations only after my permission.
* Agents can request PRs, issues

## Directory structure

* VueDotNet - main .NET library: core logic of lib
* VueDotNet.Frontend - frontend (TypeScript/Vue) libraries
  * VueDotNet.Base - build-tool-agnostic base runtime (npm package: vue-dotnet-base)
  * VueDotNet.Vite - Vite build-tool provider (npm package: vue-dotnet-vite)
  * VueDotNet.Webpack - Webpack build-tool provider (npm package: vue-dotnet-webpack)

## Commands
- Install (from repo root, pnpm workspaces): `pnpm install`
- Run dev:
  - vue-dotnet-base (watch build): `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Base dev`
  - vue-dotnet-vite (watch build): `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Vite dev`
  - vue-dotnet-webpack (watch build): `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Webpack dev`
- Build:
  - vue-dotnet-base: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Base build`
  - vue-dotnet-vite: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Vite build`
  - vue-dotnet-webpack: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Webpack build`
- Typecheck:
  - vue-dotnet-base: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Base typecheck`
  - vue-dotnet-vite: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Vite typecheck`
  - vue-dotnet-webpack: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Webpack typecheck`
- Test:
  - no tests now
