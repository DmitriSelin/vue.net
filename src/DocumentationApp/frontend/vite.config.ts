import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const RCL_BASE_PATH = "/_content/Vue.NET/VueDotNet/";

// https://vite.dev/config/
export default defineConfig({
  base: RCL_BASE_PATH,
  plugins: [vue()],
  build: {
    lib: {
      entry: "src/lib/index.ts",
      name: "VueMvcBridge",
      fileName: () => "vue-mvc-bridge.umd.js",
      formats: ["umd"],
    },
    rollupOptions: {
      // Vue is a peer dependency - must be loaded separately by the consumer
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        // Chunks get hashed, but their paths resolve relative to base
        chunkFileNames: "chunks/[name].[hash].js",
        // Keep entry file name static
        entryFileNames: "vue-mvc-bridge.umd.js",
      },
    },
    cssCodeSplit: false,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5155/",
        changeOrigin: true
      },
    },
  },
});
