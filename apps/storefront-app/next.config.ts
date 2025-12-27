/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@e-commerce/ui-library', '@e-commerce/types', '@e-commerce/utils'],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'your-cdn-domain.com' },
    ],
  },
  output: 'standalone',
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
