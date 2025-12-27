import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@e-commerce/ui-library': path.resolve(__dirname, '../../packages/ui-library/src'),
      '@ecommerce/types': path.resolve(__dirname, '../../packages/types/src'),
      '@e-commerce/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
});
