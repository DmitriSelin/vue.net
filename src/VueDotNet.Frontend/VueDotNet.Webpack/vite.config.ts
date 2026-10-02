import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        webpack: 'src/webpack.ts',
        style: 'src/style.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style',
    },
    rollupOptions: {
      // Webpack tooling is resolved at config time via `createRequire`, so the
      // published bundle must not embed it; `vue` is externalized by consumers.
      external: ['vue', 'vue-dotnet-base', /^node:/],
    },
    cssCodeSplit: false,
  },
});
