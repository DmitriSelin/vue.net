import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vueDotnet } from 'vue-dotnet-vite/vite';

export default defineConfig({
  plugins: [
    vue(),
    vueDotnet({
      // Write the built bridge + styles straight into the MVC app's wwwroot.
      outDir: '../wwwroot',
      emptyOutDir: false,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5155/',
        changeOrigin: true,
      },
    },
  },
});
