async function mountVueComponent(componentName, elementId, props = {}) {
    try {
        if (!window[componentName]) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `./js/components/${componentName}.js`;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        // Component is now in window[componentName]
        const component = window[componentName].default || window[componentName];
        
        // Check if Vue is available (it's bundled with component)
        if (typeof Vue === 'undefined') {
            console.error('Vue is not loaded');
            return;
        }
        
        const app = Vue.createApp(component, props);
        app.mount(`#${elementId}`);
        
        return app;
    }
    catch (error) {
        console.error(`Error loading the component ${componentName}:`, error);
    }
}

window.mountVueComponent = mountVueComponent;
