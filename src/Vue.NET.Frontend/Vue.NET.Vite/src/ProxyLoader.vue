<template>
  <component
    v-if="AsyncComponent"
    :is="AsyncComponent"
    v-bind="reactiveProps"
    v-on="eventListeners"
  />
  <div v-else-if="isError" class="vue-bridge-error">
    ⚠️ Failed to load component: {{ componentName }}
  </div>
  <div v-else class="vue-bridge-loading">
    <span class="spinner"></span> Loading...
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, shallowRef, reactive, watch, computed, onErrorCaptured, ref } from 'vue';
import { componentRegistry } from './registry';

const props = defineProps<{
  component: string;
  props?: Record<string, any>;
  events?: Record<string, string>; // e.g., { 'click': 'onVueClick' }
}>();

const componentName = props.component;
const reactiveProps = reactive(props.props || {});
const AsyncComponent = shallowRef<any>(null);
const isError = ref(false);

// Deep watch props to support external updates (HTMX/MutationObserver)
watch(
  () => props.props,
  (newProps) => {
    if (!newProps) return;
    // Update existing properties without losing reactivity
    Object.keys(newProps).forEach((key) => {
      reactiveProps[key] = newProps[key];
    });
    // Remove props that are no longer present
    Object.keys(reactiveProps).forEach((key) => {
      if (!(key in newProps)) {
        delete reactiveProps[key];
      }
    });
  },
  { deep: true }
);

// Build v-on event listeners
const emit = defineEmits<{
  (e: 'bridge-event', payload: { eventName: string; args: any[] }): void;
}>();

const eventListeners = computed(() => {
  if (!props.events) return {};
  return Object.fromEntries(
    Object.entries(props.events).map(([vueEvent, customEventName]) => {
      return [
        vueEvent,
        (...args: any[]) => {
          // 1. Emit up to the parent component (if needed)
          emit('bridge-event', { eventName: customEventName, args });

          // 2. Dispatch a native CustomEvent for vanilla JS/MVC consumers
          const container = document.querySelector(
            `[data-vue-component="${componentName}"]`
          ) as HTMLElement | null;
          if (container) {
            container.dispatchEvent(
              new CustomEvent(customEventName, {
                detail: args.length === 1 ? args[0] : args,
                bubbles: true
              })
            );
          }
        },
      ];
    })
  );
});

// Load the async component
const loadComponent = async (name: string) => {
  isError.value = false;
  const loader = componentRegistry[name];
  if (!loader) {
    console.error(`[VueBridge] Component "${name}" not found in registry.`);
    isError.value = true;
    AsyncComponent.value = null;
    return;
  }

  AsyncComponent.value = defineAsyncComponent({
    loader,
    delay: 200,
    timeout: 10000,
    onError: (error) => {
      console.error(`[VueBridge] Failed to load "${name}":`, error);
      isError.value = true;
    },
  });
};

// Watch the component name and load it
watch(
  () => props.component,
  (newName) => {
    if (newName) loadComponent(newName);
  },
  { immediate: true }
);

// Global error capture for rendering errors
onErrorCaptured((err) => {
  console.error('[VueBridge] Render error:', err);
  isError.value = true;
  return false; // Prevent propagation
});
</script>

<style scoped>
.vue-bridge-loading {
  padding: 0.5rem 1rem;
  color: #6c757d;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.vue-bridge-error {
  padding: 0.5rem 1rem;
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
  display: inline-block;
}
.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #e9ecef;
  border-top-color: #6c757d;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
