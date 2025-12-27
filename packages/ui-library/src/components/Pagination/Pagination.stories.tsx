import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { current: 1, total: 10 } };

export const FirstPage: Story = { args: { current: 1, total: 5 } };

export const MiddlePage: Story = { args: { current: 3, total: 5 } };

export const LastPage: Story = { args: { current: 5, total: 5 } };

export const ManyPages: Story = { args: { current: 10, total: 50 } };
