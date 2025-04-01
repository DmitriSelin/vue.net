async function mountVueComponent(componentName, elementId, props = {}) {
    try {
        const component = await import(`./components/${componentName}.js`);
        const app = Vue.createApp(component.default, props);
        app.mount(`#${elementId}`);
        return app;
    }
    catch (error) {
        console.error(`Error loading the component ${componentName}:`, error);
    }
}

window.mountVueComponent = mountVueComponent;
