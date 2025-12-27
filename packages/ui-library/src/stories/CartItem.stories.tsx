import type { Meta, StoryObj } from '@storybook/react';
import { CartItem } from '../components/CartItem';

const meta = {
  title: 'Components/CartItem',
  component: CartItem,
  tags: ['autodocs'],
} satisfies Meta<typeof CartItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockItem = {
  id: '1',
  cartId: 'cart-1',
  productId: 'prod-1',
  sku: 'SKU-001',
  sellerId: 'seller-1',
  productName: 'Test Product',
  productImage: 'https://via.placeholder.com/150',
  sellerName: 'Demo Seller',
  quantity: 2,
  maxQuantity: 10,
  price: 19.99,
  total: 39.98,
  isAvailable: true,
};

export const Default: Story = { args: { item: mockItem } };

export const OutOfStock: Story = {
  args: { item: { ...mockItem, isAvailable: false } },
};

export const LargeQuantity: Story = {
  args: { item: { ...mockItem, quantity: 99, maxQuantity: 999 } },
};

export const NoImage: Story = {
  args: { item: { ...mockItem, productImage: '' } },
};
