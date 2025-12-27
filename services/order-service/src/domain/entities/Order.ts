/**
 * Order Domain Entity
 *
 * Properties:
 * - id, orderNumber, customerId, sellerId
 * - items (OrderItem[])
 * - subtotal, tax, shipping, discount, total
 * - status, paymentStatus, paymentMethod
 * - shippingAddress, billingAddress
 * - trackingNumber, notes
 * - createdAt, updatedAt
 *
 * Methods:
 * - calculateTotal: Calculate order total
 * - canCancel: Check if order can be cancelled
 * - cancel: Cancel order
 * - markAsShipped: Update to shipped status
 * - addTracking: Add tracking information
 * - canRefund: Check if order can be refunded
 *
 * Business Rules:
 * - Order can only be cancelled if not shipped
 * - Payment must be successful to process order
 * - Inventory must be available for all items
 * - Refunds only for delivered/shipped orders
 */

// Order entity with business logic
