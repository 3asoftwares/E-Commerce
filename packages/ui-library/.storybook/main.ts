import { fileURLToPath } from 'url';

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  async viteFinal(config) {
    config.plugins = config.plugins || [];

    config.plugins.push({
      name: 'fix-mdx-react-shim-file-url',
      enforce: 'pre',
      resolveId(id) {
        if (id.startsWith('file://') && id.includes('mdx-react-shim')) {
          return fileURLToPath(id);
        }
      },
    });

    return config;
  },
};

export default config;