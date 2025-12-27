import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '../components/SearchBar';

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: (value: string) => console.log('onChange:', value),
    onSearch: (value: string) => console.log('onSearch:', value),
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    onChange: (value: string) => console.log('onChange:', value),
    onSearch: (value: string) => console.log('onSearch:', value),
    placeholder: 'Search products...',
  },
};

export const WithQuery: Story = {
  args: {
    value: 'laptop',
    onChange: (value: string) => console.log('onChange:', value),
    onSearch: (value: string) => console.log('onSearch:', value),
  },
};
