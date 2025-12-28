import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { CartItem } from '../../src/components/CartItem/CartItem';
import { CartItem as CartItemType } from '@e-commerce/types';

const mockCartItem: CartItemType = {
  id: 'item-1',
  userId: 'user-1',
  productId: 'prod-1',
  productName: 'Test Product',
  productImage: '/product.jpg',
  variantId: 'var-1',
  sellerId: 'seller-1',
  sellerName: 'Test Seller',
  quantity: 2,
  price: 50,
  total: 100,
  maxQuantity: 10,
  isAvailable: true,
};

describe('CartItem', () => {
  it('renders product name', () => {
    render(<CartItem item={mockCartItem} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders seller name', () => {
    render(<CartItem item={mockCartItem} />);
    expect(screen.getByText('Test Seller')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<CartItem item={mockCartItem} />);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('renders total price', () => {
    render(<CartItem item={mockCartItem} />);
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('renders product image', () => {
    render(<CartItem item={mockCartItem} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', '/product.jpg');
  });

  it('displays current quantity', () => {
    render(<CartItem item={mockCartItem} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onUpdateQuantity when increment is clicked', () => {
    const onUpdateQuantity = vi.fn();
    render(<CartItem item={mockCartItem} onUpdateQuantity={onUpdateQuantity} />);
    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);
    expect(onUpdateQuantity).toHaveBeenCalledWith('item-1', 3);
  });

  it('calls onUpdateQuantity when decrement is clicked', () => {
    const onUpdateQuantity = vi.fn();
    render(<CartItem item={mockCartItem} onUpdateQuantity={onUpdateQuantity} />);
    const decrementButton = screen.getByText('-');
    fireEvent.click(decrementButton);
    expect(onUpdateQuantity).toHaveBeenCalledWith('item-1', 1);
  });

  it('disables decrement button when quantity is 1', () => {
    const itemWithMinQuantity = { ...mockCartItem, quantity: 1 };
    render(<CartItem item={itemWithMinQuantity} onUpdateQuantity={vi.fn()} />);
    const decrementButton = screen.getByText('-');
    expect(decrementButton).toBeDisabled();
  });

  it('disables increment button when quantity reaches max', () => {
    const itemAtMax = { ...mockCartItem, quantity: 10, maxQuantity: 10 };
    render(<CartItem item={itemAtMax} onUpdateQuantity={vi.fn()} />);
    const incrementButton = screen.getByText('+');
    expect(incrementButton).toBeDisabled();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<CartItem item={mockCartItem} onRemove={onRemove} />);
    fireEvent.click(screen.getByText('Remove'));
    expect(onRemove).toHaveBeenCalledWith('item-1');
  });

  it('shows unavailable message when product is not available', () => {
    const unavailableItem = { ...mockCartItem, isAvailable: false };
    render(<CartItem item={unavailableItem} />);
    expect(screen.getByText('Currently unavailable')).toBeInTheDocument();
  });

  it('displays variant options', () => {
    const itemWithVariants = {
      ...mockCartItem,
      variantOptions: { Size: 'Large', Color: 'Blue' },
    };
    render(<CartItem item={itemWithVariants} />);
    expect(screen.getByText('Size:')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getByText('Color:')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('hides quantity controls in readonly mode', () => {
    render(<CartItem item={mockCartItem} readonly />);
    expect(screen.queryByText('+')).not.toBeInTheDocument();
    expect(screen.queryByText('-')).not.toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
  });

  it('hides remove button in readonly mode', () => {
    render(<CartItem item={mockCartItem} readonly />);
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
  });

  it('does not call handlers in readonly mode', () => {
    const onUpdateQuantity = vi.fn();
    const onRemove = vi.fn();
    render(<CartItem item={mockCartItem} readonly onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />);
    // In readonly mode, buttons are not rendered, so handlers won't be called
    expect(onUpdateQuantity).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });
});
