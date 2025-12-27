/**
 * Cart Entity Types
 *
 * This file defines all cart-related types for the 3a Softwaresplatform.
 *
 * Interfaces:
 * - Cart: Shopping cart
 * - CartItem: Cart item
 * - CartSummary: Cart totals summary
 *
 * Properties:
 * - id: Cart identifier
 * - userId: User ID (null for guest)
 * - items: Cart items
 * - subtotal: Items subtotal
 * - tax: Estimated tax
 * - shipping: Estimated shipping
 * - discount: Discount amount
 * - discountCode: Applied promo code
 * - total: Total amount
 * - itemCount: Total item count
 * - createdAt: Cart creation
 * - updatedAt: Last update
 * - expiresAt: Cart expiration (for guests)
 */

/**
 * Cart Entity Types
 */

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  appliedCoupons?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  variantId?: string;
  variantOptions?: { [key: string]: string };
  sellerId: string;
  sellerName: string;
  quantity: number;
  price: number;
  total: number;
  isAvailable: boolean;
  maxQuantity: number;
}
