import {
  componentRegistry,
  registerComponent,
  registerComponents,
} from './registry';
import type { ComponentGlob, ComponentRegistry } from './registry';
import { destroy, init } from './runtime/mount';
import { version } from './version';

export interface BridgeOptions {
  /** `import.meta.glob(...)` map (path -> loader) of Vue components to register. */
  components?: ComponentGlob;
  /** Auto-initialize on DOM ready. Default: true. */
  autoInit?: boolean;
  /** Root selector scanned by init/destroy. Default: '[data-vue-component]'. */
  selector?: string;
}

export interface VueDotnetBridge {
  init: typeof init;
  destroy: typeof destroy;
  registerComponent: typeof registerComponent;
  registerComponents: typeof registerComponents;
  componentRegistry: ComponentRegistry;
  version: string;
}

const toKebabCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const componentNameFromPath = (filePath: string): string => {
  const normalized = filePath.replace(/\\/g, '/').replace(/\/$/, '');
  const segments = normalized.split('/');
  let base = segments.pop() ?? normalized;
  if (base.endsWith('.vue')) {
    base = base.slice(0, -'.vue'.length);
  }
  if (base === 'index' && segments.length > 0) {
    base = segments.pop() ?? base;
  }
  return base;
};

export function createBridge(options: BridgeOptions = {}): VueDotnetBridge {
  const { components, autoInit = true, selector = '[data-vue-component]' } = options;

  if (components) {
    for (const [filePath, loader] of Object.entries(components)) {
      const name = componentNameFromPath(filePath);
      registerComponent(name, loader);
      registerComponent(toKebabCase(name), loader);
    }
  }

  if (autoInit) {
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init(selector));
      } else {
        init(selector);
      }
    }
  }

  return {
    init,
    destroy,
    registerComponent,
    registerComponents,
    componentRegistry,
    version,
  };
}
