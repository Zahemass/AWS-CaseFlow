import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    open: true, // automatically opens browser
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  },

  define: {
    'process.env': {}, // fixes AWS SDK env variable references
  },
});
