export {
  componentRegistry,
  registerComponent,
  registerComponents,
} from './registry';
export type { ComponentGlob, ComponentLoader, ComponentRegistry } from './registry';

export { createBridge } from './bridge';
export type { BridgeOptions, VueDotnetBridge } from './bridge';

export { destroy, init } from './runtime/mount';
export { version } from './version';
