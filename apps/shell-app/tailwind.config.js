const baseConfig = require('../../packages/ui-library/tailwind.config.base');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
    '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}',
  ],
};
