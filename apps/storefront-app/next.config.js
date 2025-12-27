/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile shared packages
  transpilePackages: ['@ecommerce/ui-library', '@ecommerce/types', '@ecommerce/utils'],

  // Image optimization
  images: {
    domains: ['localhost', 'your-cdn-domain.com'],
  },

  // Standalone output for production
  output: 'standalone',

  // Allow imports from outside the app directory (monorepo support)
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
