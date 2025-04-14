import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  build: {
    outDir: '../wwwroot/js/components',
    emptyOutDir: true,
    lib: {
      entry: 'src/components/TheButton.vue',
      name: 'TheButton',
      formats: ['es'],
      fileName: 'TheButton'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5155/',
        changeOrigin: true
      }
    }
  }
})
