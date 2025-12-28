import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { OrderCard } from '../../src/components/OrderCard/OrderCard';
import { Order, OrderStatus } from '@e-commerce/types';

const mockOrder: Order = {
  id: 'order-1',
  orderNumber: '12345',
  userId: 'user-1',
  status: OrderStatus.CONFIRMED,
  items: [
    {
      id: 'item-1',
      productId: 'prod-1',
      productName: 'Product 1',
      productImage: '/product1.jpg',
      variantId: 'var-1',
      quantity: 2,
      price: 50,
      total: 100,
    },
    {
      id: 'item-2',
      productId: 'prod-2',
      productName: 'Product 2',
      productImage: '/product2.jpg',
      quantity: 1,
      price: 30,
      total: 30,
    },
  ],
  subtotal: 130,
  tax: 10,
  shipping: 5,
  total: 145,
  shippingAddress: {} as any,
  billingAddress: {} as any,
  paymentMethod: 'card',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date(),
};

describe('OrderCard', () => {
  it('renders order number', () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText('Order #12345')).toBeInTheDocument();
  });

  it('renders order date', () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument();
  });

  it('renders order status', () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText(/CONFIRMED/)).toBeInTheDocument();
  });

  it('renders order total', () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText('$145.00')).toBeInTheDocument();
  });

  it('renders first two items', () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('shows more items indicator when more than 2 items', () => {
    const orderWithManyItems = {
      ...mockOrder,
      items: [
        ...mockOrder.items,
        {
          id: 'item-3',
          productId: 'prod-3',
          productName: 'Product 3',
          productImage: '/product3.jpg',
          quantity: 1,
          price: 20,
          total: 20,
        },
      ],
    };
    render(<OrderCard order={orderWithManyItems} />);
    expect(screen.getByText('+1 more items')).toBeInTheDocument();
  });

  it('calls onViewDetails when view details is clicked', () => {
    const onViewDetails = vi.fn();
    render(<OrderCard order={mockOrder} onViewDetails={onViewDetails} />);
    fireEvent.click(screen.getByText('View Details'));
    expect(onViewDetails).toHaveBeenCalledWith('order-1');
  });

  it('shows track order button for shipped orders', () => {
    const shippedOrder = { ...mockOrder, status: OrderStatus.SHIPPED };
    render(<OrderCard order={shippedOrder} onTrackOrder={vi.fn()} />);
    expect(screen.getByText('Track Order')).toBeInTheDocument();
  });

  it('calls onTrackOrder when track button is clicked', () => {
    const onTrackOrder = vi.fn();
    const shippedOrder = { ...mockOrder, status: OrderStatus.SHIPPED };
    render(<OrderCard order={shippedOrder} onTrackOrder={onTrackOrder} />);
    fireEvent.click(screen.getByText('Track Order'));
    expect(onTrackOrder).toHaveBeenCalledWith('order-1');
  });

  it('shows cancel button for pending orders', () => {
    const pendingOrder = { ...mockOrder, status: OrderStatus.PENDING };
    render(<OrderCard order={pendingOrder} onCancelOrder={vi.fn()} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onCancelOrder when cancel button is clicked', () => {
    const onCancelOrder = vi.fn();
    const pendingOrder = { ...mockOrder, status: OrderStatus.PENDING };
    render(<OrderCard order={pendingOrder} onCancelOrder={onCancelOrder} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancelOrder).toHaveBeenCalledWith('order-1');
  });

  it('does not show actions when showActions is false', () => {
    render(<OrderCard order={mockOrder} showActions={false} />);
    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
  });

  it('applies correct status color for different statuses', () => {
    const { rerender } = render(<OrderCard order={{ ...mockOrder, status: OrderStatus.DELIVERED }} />);
    expect(screen.getByText(/DELIVERED/)).toHaveClass('bg-green-100', 'text-green-800');

    rerender(<OrderCard order={{ ...mockOrder, status: OrderStatus.CANCELLED }} />);
    expect(screen.getByText(/CANCELLED/)).toHaveClass('bg-red-100', 'text-red-800');

    rerender(<OrderCard order={{ ...mockOrder, status: OrderStatus.PENDING }} />);
    expect(screen.getByText(/PENDING/)).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('renders product images', () => {
    render(<OrderCard order={mockOrder} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('src', '/product1.jpg');
  });
});
