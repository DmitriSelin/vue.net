# Agent development guide

## Basic rules

* Agents can read, write, update, delete files and folders.
* Agents can perform git operations only after my permission.
* Agents can request PRs, issues

## Directory structure

* DocumentationApp - web-app for demonstrating this lib's opportunities and docs
* VueDotNet - main .NET library: core logic of lib
* VueDotNet.Frontend - frontend (TypeScript/Vue) libraries
  * VueDotNet.Base - build-tool-agnostic base runtime (npm package: vue-dotnet-base)
  * VueDotNet.Vite - Vite build-tool provider (npm package: vue-dotnet-vite)
  * VueDotNet.Webpack - Webpack build-tool provider (npm package: vue-dotnet-webpack)

## Commands
- Install (from repo root, pnpm workspaces): `pnpm install`
- Run dev:
  - Backend: `dotnet build --project src/DocumentationApp`
  - Frontend: `pnpm --dir src/DocumentationApp/frontend dev`
  - vue-dotnet-base (watch build): `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Base dev`
  - vue-dotnet-vite (watch build): `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Vite dev`
  - vue-dotnet-webpack (watch build): `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Webpack dev`
- Build:
  - Backend: `dotnet build --project src/DocumentationApp`
  - vue-dotnet-base: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Base build`
  - vue-dotnet-vite: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Vite build`
  - vue-dotnet-webpack: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Webpack build`
  - Frontend: `pnpm --dir src/DocumentationApp/frontend build`
- Typecheck:
  - vue-dotnet-base: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Base typecheck`
  - vue-dotnet-vite: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Vite typecheck`
  - vue-dotnet-webpack: `pnpm --dir src/VueDotNet.Frontend/VueDotNet.Webpack typecheck`
- Test:
  - no tests now

## Releases

- One shared `MAJOR.MINOR.PATCH` version for the C# library and all npm packages, managed by release-please (see `.github/`).
- Use Conventional Commit messages (`feat:`, `fix:`, `feat!:`/`BREAKING CHANGE:`) — they drive version bumps.
- After the first `1.0.0` release, remove `"release-as"` from `.github/release-please-config.json`.
