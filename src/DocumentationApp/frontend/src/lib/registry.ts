export type ComponentRegistry = Record<string, () => Promise<any>>;

export const componentRegistry: ComponentRegistry = {
  'TheButton': () => import('../components/TheButton.vue')
};
