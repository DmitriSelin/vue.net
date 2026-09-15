import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const RCL_BASE_PATH = "/_content/Vue.NET/VueDotNet/";

export default defineConfig({
  base: RCL_BASE_PATH,
  plugins: [vue()],
  resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  build: {
    lib: {
      entry: "src/bridge.ts",
      name: "VueMvcBridge",
      fileName: () => "vue.net.umd.js",
      cssFileName: "vue.net",
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        chunkFileNames: "chunks/[name].[hash].js",
        entryFileNames: "vue.net.umd.js",
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
