const baseConfig = require('../../packages/ui-library/tailwind.config.base');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}',
  ],
};
