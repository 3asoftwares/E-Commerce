import type { Meta, StoryObj } from '@storybook/react';
import { OrderCard } from '../components/OrderCard';
import { Address, OrderStatus, PaymentMethod, PaymentStatus, ShippingMethod } from '@e-commerce/types';

const meta = {
  title: 'Components/OrderCard',
  component: OrderCard,
  tags: ['autodocs'],
} satisfies Meta<typeof OrderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOrder = {
  id: 'o1',
  orderNumber: 'ORD-001',
  customerId: 'c1',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  subtotal: 49.99,
  tax: 5.0,
  shipping: 5.0,
  discount: 0,
  total: 59.99,
  status: 'active' as OrderStatus,
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  shippingAddress: {
    id: 'addr1',
    userId: 'c1',
    type: 'shipping',
    isDefault: true,
    fullName: 'Raj',
    phone: '70568',
    addressLine1: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    postalCode: '10001',
  } as Address,
  paymentMethod: 'credit_card' as PaymentMethod,
  paymentStatus: 'paid' as PaymentStatus,
  shippingMethod: 'standard' as ShippingMethod,
  trackingNumber: 'TRK123456789',
  notes: '',
  expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  billingAddress: {
    id: 'addr1',
    userId: 'c1',
    type: 'shipping',
    isDefault: true,
    fullName: 'Raj',
    phone: '70568',
    addressLine1: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    postalCode: '10001',
  } as Address,
  history: [],
};

export const Default: Story = { args: { order: sampleOrder } };
