import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'vue-dotnet-vite',
      cssFileName: 'vue-dotnet-vite',
    },
    rollupOptions: {
      external: ['vue'],
    },
    cssCodeSplit: false,
  },
});
