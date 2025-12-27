import type { Meta, StoryObj } from '@storybook/react-vite';
import { OrderCard } from './OrderCard';

const meta = {
  title: 'Components/OrderCard',
  component: OrderCard,
  tags: ['autodocs'],
} satisfies Meta<typeof OrderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOrder = {
  id: 'o1',
  total: 59.99,
  status: 'processing',
  items: [],
};

export const Default: Story = { args: { order: sampleOrder } };
