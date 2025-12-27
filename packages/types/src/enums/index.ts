/**
 * Shared Enums
 *
 * UserRole:
 * - ADMIN: Platform administrator
 * - SELLER: Product seller
 * - CUSTOMER: Regular customer
 *
 * OrderStatus:
 * - PENDING: Order received
 * - PROCESSING: Being processed
 * - SHIPPED: Shipped to customer
 * - DELIVERED: Delivered
 * - CANCELLED: Cancelled
 * - REFUNDED: Refunded
 *
 * ProductStatus:
 * - DRAFT: Not submitted
 * - PENDING: Awaiting approval
 * - APPROVED: Approved and visible
 * - REJECTED: Rejected
 *
 * PaymentStatus:
 * - PENDING: Payment pending
 * - COMPLETED: Payment successful
 * - FAILED: Payment failed
 * - REFUNDED: Payment refunded
 *
 * PaymentMethod:
 * - CREDIT_CARD: Credit/debit card
 * - PAYPAL: PayPal
 * - STRIPE: Stripe
 *
 * ShippingMethod:
 * - STANDARD: Standard shipping
 * - EXPRESS: Express shipping
 * - OVERNIGHT: Overnight shipping
 */

/**
 * Shared Enums - Exports
 */

export { UserRole } from './userRole';
export { OrderStatus } from './orderStatus';
export { ProductStatus } from './productStatus';
export { PaymentStatus } from './paymentStatus';
export { PaymentMethod } from './paymentMethod';
export { ShippingMethod } from './shippingMethod';
