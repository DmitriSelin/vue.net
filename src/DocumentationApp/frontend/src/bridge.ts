import {
  init,
  destroy,
  registerComponent,
  registerComponents,
  componentRegistry,
  version,
} from 'vue-dotnet';

// Register the components that the DocumentationApp exposes to ASP.NET MVC.
registerComponent('TheButton', () => import('./components/TheButton.vue'));

export {
  init,
  destroy,
  registerComponent,
  registerComponents,
  componentRegistry,
  version,
};

// Auto-initialize the bridge when this bundle is loaded as a classic script.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
} else {
  init();
}
