import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our complete catalog of quality products. Filter by category, price, and rating to find exactly what you need.',
  keywords: ['products', 'shop', 'catalog', 'online shopping'],
  openGraph: {
    title: 'Shop All Products | ShopHub',
    description: 'Browse our complete catalog of quality products.',
    type: 'website',
  },
};

export { default } from './page';
