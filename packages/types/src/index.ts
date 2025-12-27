/**
 * Types Package - Main Export File
 *
 * Exports all types, interfaces, and enums.
 */

// Domain Entities
export type {
  User,
  UserProfile,
  Address,
  UserPreferences,
  Wishlist,
  Review,
} from './entities/user';
export type {
  Product,
  ProductVariant,
  ProductImage,
  ProductCategory,
  ProductFilter,
} from './entities/product';
export type {
  Order,
  OrderItem,
  OrderHistory,
  OrderTracking,
  TrackingEvent,
} from './entities/order';
export type { Cart, CartItem } from './entities/cart';
export type {
  Seller,
  SellerAddress,
  BankAccount,
  SellerDocument,
  SellerPayout,
  SellerStats,
} from './entities/seller';
export type { Coupon, Offer } from './entities/coupon';
export type { DashboardStats, AdminNotification } from './entities/analytics';
export type { Notification, NotificationSettings } from './entities/notification';

// Enums
export { UserRole } from './enums/userRole';
export { OrderStatus } from './enums/orderStatus';
export { ProductStatus } from './enums/productStatus';
export { PaymentStatus } from './enums/paymentStatus';
export { PaymentMethod } from './enums/paymentMethod';
export { ShippingMethod } from './enums/shippingMethod';

// API Types
export type { ApiResponse, ApiError, PaginatedResponse } from './api/response';
export type {
  GetProductsRequest,
  GetProductsResponse,
  GetProductRequest,
  CreateProductRequest,
  UpdateProductRequest,
} from './api/product';
export type { CreateOrderRequest, UpdateOrderStatusRequest, GetOrdersRequest } from './api/order';
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UpdateProfileRequest,
  CreateAddressRequest,
} from './api/user';
