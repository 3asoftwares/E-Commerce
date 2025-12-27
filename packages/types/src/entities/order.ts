/**
 * Order Entity Types
 */

import { OrderStatus } from '../enums/orderStatus';
import { PaymentMethod, PaymentStatus } from '../enums';
import { ShippingMethod } from '../enums/shippingMethod';
import { Address } from './user';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  customerNotes?: string;
  history: OrderHistory[];
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
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
  status: OrderStatus;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  comment?: string;
  createdBy?: string;
  createdAt: Date;
}

export interface OrderTracking {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  location?: string;
  estimatedDelivery?: Date;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  status: string;
  location: string;
  description: string;
  timestamp: Date;
}
