/**
 * @deprecated This file has been moved to ../types/
 * 
 * All GraphQL types are now in:
 * - ../types/product.types.ts
 * - ../types/order.types.ts
 * - ../types/user.types.ts
 * - ../types/coupon.types.ts
 * - ../types/common.types.ts
 * - ../types/analytics.types.ts
 * 
 * @see packages/types/ORGANIZATION.md
 */

// Re-export from consolidated types for backward compatibility
export type {
  Pagination,
  ApiResponse,
  ApiError,
  PaginatedResponse,
  MutationResponse,
} from '../types/common.types';

export type {
  ProductGraphQL,
  ProductConnection,
  CreateProductInput,
  UpdateProductInput,
  ProductQueryVariables,
  ProductAnalytics,
} from '../types/product.types';

export type {
  OrderGraphQL,
  OrderConnection,
  CreateOrderInput,
  OrderItemInput,
  AddressInput,
  OrderQueryVariables,
  Address,
  OrderItem,
  OrderItemGraphQL,
  AddressGraphQL,
} from '../types/order.types';

export type {
  UserGraphQL,
  UserConnection,
  LoginInput,
  RegisterInput,
  UserQueryVariables,
  AuthPayload,
  AuthResponse,
} from '../types/user.types';

export type {
  CouponGraphQL,
  CouponConnection,
  CreateCouponInput,
  UpdateCouponInput,
  CouponQueryVariables,
} from '../types/coupon.types';

export type {
  DashboardStats,
  SalesAnalytics,
  SalesData,
} from '../types/analytics.types';
