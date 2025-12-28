import type { Config } from 'tailwindcss';

const baseConfig = require('../../packages/utils/src/config/tailwind.config');

const config: Config = {
  ...baseConfig,
  darkMode: 'class', // Ensure dark mode is enabled with class strategy
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
    '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
