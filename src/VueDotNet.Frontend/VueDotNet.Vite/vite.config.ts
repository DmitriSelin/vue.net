import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        vite: 'src/vite.ts',
        style: 'src/style.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style',
    },
    rollupOptions: {
      // `vue` and the base runtime are provided by the host project; node
      // builtins are used for config-time file validation.
      external: ['vue', 'vue-dotnet-base', /^node:/],
    },
    cssCodeSplit: false,
  },
});
