export type ComponentLoader = () => Promise<any>;

export type ComponentRegistry = Record<string, ComponentLoader>;

/** Shape returned by `import.meta.glob('./components/*.vue')`. */
export type ComponentGlob = Record<string, () => Promise<unknown>>;

export const componentRegistry: ComponentRegistry = {};

export const registerComponent = (name: string, loader: ComponentLoader): void => {
  componentRegistry[name] = loader;
};

export const registerComponents = (components: ComponentRegistry): void => {
  Object.assign(componentRegistry, components);
};
