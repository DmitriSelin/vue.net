# Agent development guide

## Basic rules

* Agents can read, write, update, delete files and folders.
* If folder or file starts with '.' symbol, agents have no right to read, update, delete it (until I get my permission).
* Agents can perform git operations only after my permission.
* Agents can request PRs, issues

## Directory structure

* Vue.NET.CLI - empty project for future CLI application
* DocumentationApp - web-app for demonstrating this lib's opportunities and docs
* Vue.NET - main .NET library: core logic of lib
* vue-dotnet - frontend (TypeScript/Vue) library for Vue.NET

## Commands
- Run dev:
  - Backend: `dotnet build --project src/DocumentationApp`
  - Frontend: `pnpm --dir src/DocumentationApp/frontend dev`
  - vue-dotnet (watch build): `pnpm --dir src/vue-dotnet dev`
- Build:
  - Backend:
  - Frontend: `pnpm --dir src/DocumentationApp/frontend build`
  - vue-dotnet: `pnpm --dir src/vue-dotnet build`
- Typecheck:
  - vue-dotnet: `pnpm --dir src/vue-dotnet typecheck`
- Test:
  - no tests now
