/**
 * Order API Types
 */

// import type { Order, OrderItem } from '../entities/order';
import { PaymentMethod, ShippingMethod } from '../enums';

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
  status: string;
  comment?: string;
}

export interface GetOrdersRequest {
  userId?: string;
  status?: string;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}
