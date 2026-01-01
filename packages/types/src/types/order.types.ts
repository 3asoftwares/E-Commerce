/**
 * Order Types
 * Consolidated order-related types for REST API and GraphQL
 */

import { OrderStatus, PaymentStatus, PaymentMethod, ShippingMethod } from '../enums';

// Address Type (shared)
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Order Item Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// GraphQL Response Types (aliases for consistency)
export type OrderItemGraphQL = OrderItem;
export type AddressGraphQL = Address;

// REST API Request Types
export interface CreateOrderRequest {
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shippingAddressId: string;
  billingAddressId: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  customerNotes?: string;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
  comment?: string;
}

export interface GetOrdersRequest {
  userId?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

// GraphQL Input Types
export interface CreateOrderInput {
  customerId: string;
  customerEmail: string;
  items: OrderItemInput[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  paymentMethod: string;
  shippingAddress: AddressInput;
  notes?: string;
}

export interface OrderItemInput {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface AddressInput {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderQueryVariables {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  customerId?: string;
}

// GraphQL Response Type (matches GraphQL schema exactly)
export interface OrderGraphQL {
  estimatedDelivery: string | number | Date;
  status: string;
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  order:string
}

export interface OrderConnection {
  orders: OrderGraphQL[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
