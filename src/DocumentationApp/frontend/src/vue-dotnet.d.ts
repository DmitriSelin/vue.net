// Public API surface of the `vue-dotnet` package.
// Kept here so the DocumentationApp type-checks against the package API
// without pulling the linked package's source into this project.
declare module 'vue-dotnet' {
  export type ComponentLoader = () => Promise<any>;
  export type ComponentRegistry = Record<string, ComponentLoader>;

  export const componentRegistry: ComponentRegistry;
  export const registerComponent: (name: string, loader: ComponentLoader) => void;
  export const registerComponents: (components: ComponentRegistry) => void;
  export const version: string;
  export const init: (selector?: string) => void;
  export const destroy: (selector?: string) => void;
}
