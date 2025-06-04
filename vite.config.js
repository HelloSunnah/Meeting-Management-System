import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor_vue';
            if (id.includes('axios')) return 'vendor_axios';
            if (id.includes('lodash')) return 'vendor_lodash';
            return 'vendor_misc';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500, 
  },
});
