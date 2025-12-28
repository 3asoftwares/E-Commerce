import type { Config } from 'tailwindcss';
import baseConfig from '../../packages/utils/src/config/tailwind.config';

const config: Config = {
  ...baseConfig,
  darkMode: baseConfig.darkMode || 'class',
  content: [
    ...(Array.isArray(baseConfig.content) ? baseConfig.content : []),
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
