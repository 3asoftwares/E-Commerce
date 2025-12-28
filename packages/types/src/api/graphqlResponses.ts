/**
 * @deprecated This file has been moved to ../types/ folder
 * 
 * Import GraphQL types directly from '@e-commerce/types':
 * - ProductGraphQL from types/product.types.ts
 * - OrderGraphQL, OrderItemGraphQL, AddressGraphQL from types/order.types.ts
 * - UserGraphQL from types/user.types.ts
 * - CouponGraphQL from types/coupon.types.ts
 * 
 * @see packages/types/ORGANIZATION.md
 */

// Re-export from consolidated types for backward compatibility
export type {
  ProductGraphQL,
  ProductConnection,
} from '../types/product.types';

export type {
  OrderGraphQL,
  OrderItemGraphQL,
  AddressGraphQL,
  OrderConnection,
} from '../types/order.types';

export type {
  UserGraphQL,
  UserConnection,
} from '../types/user.types';

export type {
  CouponGraphQL,
  CouponConnection,
} from '../types/coupon.types';
