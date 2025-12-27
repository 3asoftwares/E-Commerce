/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const plugins = [react()];

  const isVitest =
    Boolean(process.env.VITEST) ||
    Boolean(process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.includes('vitest')) ||
    process.argv.join(' ').includes('vitest');

  const config: any = {
    plugins,
    css: {
      postcss: './postcss.config.js',
    },
    resolve: {
      alias: {
        '@e-commerce/ui-library': path.resolve(__dirname, '../../packages/ui-library/src'),
        '@e-commerce/types': path.resolve(__dirname, '../../packages/types/src'),
        '@e-commerce/utils': path.resolve(__dirname, '../../packages/utils/src'),
      },
    },
  };

  if (isVitest) {
    const { storybookTest } = await import('@storybook/addon-vitest/vitest-plugin').catch(() => ({ storybookTest: undefined }));
    const { playwright } = await import('@vitest/browser-playwright').catch(() => ({ playwright: undefined }));

    if (storybookTest) {
      config.test = {
        projects: [
          {
            extends: true,
            plugins: [
              storybookTest({
                configDir: path.join(dirname, '.storybook'),
              }),
            ],
            test: {
              name: 'storybook',
              browser: {
                enabled: true,
                headless: true,
                provider: playwright ? playwright({}) : undefined,
                instances: [{ browser: 'chromium' }],
              },
              setupFiles: ['.storybook/vitest.setup.ts'],
            },
          },
        ],
      };
    }
  }

  return config;
});