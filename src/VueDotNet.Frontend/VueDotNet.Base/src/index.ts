export {
  componentRegistry,
  registerComponent,
  registerComponents,
} from './registry';
export type { ComponentGlob, ComponentLoader, ComponentRegistry } from './registry';

export {
  normalizeComponentPath,
  normalizeComponentPatterns,
} from './component-paths';

export { createBridge } from './bridge';
export type { BridgeOptions, VueDotnetBridge } from './bridge';

export { destroy, init } from './runtime/mount';

export type { VueDotnetBuildOptions, VueDotnetProvider } from './provider';
