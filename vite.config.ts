import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'pinia']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true // Enable network access
  },
  preview: {
    port: 4173,
    open: true,
    host: true
  },
  // Enable type checking in development
  optimizeDeps: {
    include: ['vue', 'pinia']
  }
})