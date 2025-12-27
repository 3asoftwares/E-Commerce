import type { Config } from 'tailwindcss';
import baseConfig from '../../packages/utils/src/config/tailwind.config.ts';

const config: Config = {
  ...baseConfig,
    content: ['./src/**/*.{js,ts,jsx,tsx}', '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}'],
};

export default config;
