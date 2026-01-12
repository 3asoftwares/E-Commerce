import { defineConfig, mergeConfig } from 'vitest/config';
import type { UserConfig } from 'vitest/config';

/**
 * Base Vitest configuration for Node.js packages
 */
export function createNodeVitestConfig(
  dirname: string,
  options: {
    coverageExclude?: string[];
  } = {}
): UserConfig {
  return defineConfig({
    test: {
      globals: true,
      environment: 'node',
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.d.ts',
          ...(options.coverageExclude || []),
        ],
      },
      passWithNoTests: true,
    },
  });
}

/**
 * Base Vitest configuration for Browser/React packages
 */
export function createBrowserVitestConfig(
  dirname: string,
  options: {
    coverageExclude?: string[];
    setupFiles?: string[];
  } = {}
): UserConfig {
  return defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      setupFiles: options.setupFiles || [],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.d.ts',
          ...(options.coverageExclude || []),
        ],
      },
      passWithNoTests: true,
    },
  });
}

export default { createNodeVitestConfig, createBrowserVitestConfig };
