/**
 * @deprecated This file has been moved to ../types/order.types.ts
 * 
 * Use OrderGraphQL, CreateOrderInput, etc.
 * from '@e-commerce/types' instead
 * 
 * @see packages/types/ORGANIZATION.md
 */

import { PaymentMethod, ShippingMethod } from '../enums';
import { OrderStatus } from '../enums';

// Re-export from consolidated types
export type {
  OrderGraphQL,
  OrderConnection,
  CreateOrderInput,
  OrderQueryVariables,
  Address,
  OrderItem,
  OrderItemGraphQL,
  AddressGraphQL,
} from '../types/order.types';

// Legacy types kept for backward compatibility
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
