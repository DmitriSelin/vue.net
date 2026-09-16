export type ComponentLoader = () => Promise<any>;

export type ComponentRegistry = Record<string, ComponentLoader>;

export const componentRegistry: ComponentRegistry = {};

export const registerComponent = (name: string, loader: ComponentLoader): void => {
  componentRegistry[name] = loader;
};

export const registerComponents = (components: ComponentRegistry): void => {
  Object.assign(componentRegistry, components);
};
