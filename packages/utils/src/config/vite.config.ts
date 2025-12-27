import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export function createBaseViteConfig(rootDir: string): UserConfig {
  return defineConfig({
    plugins: [react()],
    css: {
      postcss: path.resolve(rootDir, 'postcss.config.js'),
    },
    resolve: {
      alias: {
        '@e-commerce/ui-library': path.resolve(rootDir, '../../packages/ui-library/src'),
        '@e-commerce/types': path.resolve(rootDir, '../../packages/types/src'),
        '@e-commerce/utils': path.resolve(rootDir, '../../packages/utils/src'),
      },
    },
  });
}

export default createBaseViteConfig;
