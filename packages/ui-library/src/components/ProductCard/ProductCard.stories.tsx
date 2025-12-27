import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductCard } from './ProductCard';

const meta = {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProduct = {
  id: 'p1',
  name: 'Demo Product',
  price: 29.99,
  compareAtPrice: 39.99,
  rating: 4.5,
  reviewCount: 12,
  images: [{ url: 'https://via.placeholder.com/300', isPrimary: true }],
  inventory: 5,
  shortDescription: 'Short description',
  isFeatured: true,
  category: { name: 'Category' },
};

export const Grid: Story = { args: { product: mockProduct, variant: 'grid' } };
export const List: Story = { args: { product: mockProduct, variant: 'list' } };
