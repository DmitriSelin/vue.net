import { createApp, reactive } from 'vue';
import ProxyLoader from './ProxyLoader.vue';
import './style.css';

// Store mounted app instances for cleanup
const appInstances = new Map<Element, { app: any; observer: MutationObserver }>();

// Inject minimal default styles (optional, but prevents FOUC)
const injectBaseStyles = () => {
  if (document.getElementById('vue-bridge-base-styles')) return;
  const style = document.createElement('style');
  style.id = 'vue-bridge-base-styles';
  style.textContent = `
    .vue-bridge-wrapper { display: contents; }
  `;
  document.head.appendChild(style);
};

// Core initialization function
const init = (selector = '[data-vue-component]') => {
  injectBaseStyles();

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    // Prevent double mounting
    if (appInstances.has(el)) return;

    const componentName = el.getAttribute('data-vue-component');
    const propsAttr = el.getAttribute('data-props');
    const eventsAttr = el.getAttribute('data-events');

    if (!componentName) {
      console.warn('[VueBridge] Missing data-vue-component attribute.');
      return;
    }

    let initialProps = {};
    let initialEvents = {};

    try {
      if (propsAttr) initialProps = JSON.parse(propsAttr);
      if (eventsAttr) initialEvents = JSON.parse(eventsAttr);
    } catch (e) {
      console.warn('[VueBridge] Invalid JSON in data attributes:', e);
    }

    // Create reactive props that can be updated externally
    const reactiveProps = reactive<Record<string, any>>(initialProps);

    // Watch for changes to the `data-props` attribute (HTMX/Unpoly support)
    const observer = new MutationObserver(() => {
      const newPropsRaw = el.getAttribute('data-props');
      if (newPropsRaw) {
        try {
          const newProps = JSON.parse(newPropsRaw);
          // Synchronize reactive props
          Object.keys(newProps).forEach((key) => {
            reactiveProps[key] = newProps[key];
          });
          // Remove props that are gone
          Object.keys(reactiveProps).forEach((key) => {
            if (!(key in newProps)) {
              delete reactiveProps[key];
            }
          });
        } catch (e) {
          console.warn('[VueBridge] Failed to parse updated data-props:', e);
        }
      }
    });
    observer.observe(el, { attributes: true, attributeFilter: ['data-props'] });

    // Create the Vue app
    const app = createApp(ProxyLoader, {
      component: componentName,
      props: reactiveProps,
      events: initialEvents,
    });

    // Mount it
    app.mount(el);
    appInstances.set(el, { app, observer });

    // Clean up when element is removed
    const cleanup = () => {
      observer.disconnect();
      app.unmount();
      appInstances.delete(el);
    };

    // Use a MutationObserver on the parent to detect removal (robust cleanup)
    const parentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          const isRemoved = Array.from(mutation.removedNodes).some(
            (node) => node === el
          );
          if (isRemoved) {
            cleanup();
            parentObserver.disconnect();
          }
        }
      });
    });
    if (el.parentNode) {
      parentObserver.observe(el.parentNode, { childList: true });
    }
  });
};

const destroy = (selector = '[data-vue-component]') => {
  document.querySelectorAll(selector).forEach((el) => {
    const data = appInstances.get(el);
    if (data) {
      data.observer.disconnect();
      data.app.unmount();
      appInstances.delete(el);
    }
  });
};

const autoInit = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }
};

(window as any).VueMvcBridge = {
  init,
  destroy,
  version: '1.0.0',
};

autoInit();
