# Order Service

Order management and processing microservice for the e-commerce platform.

## Responsibilities

### 1. Order Creation

- Create orders from cart
- Validate cart items
- Check inventory availability
- Calculate totals (tax, shipping, discounts)
- Generate order number

### 2. Payment Processing

- Integrate with payment gateway (Stripe)
- Process payments
- Handle payment confirmations
- Manage payment failures
- Process refunds

### 3. Order Fulfillment

- Track order status
- Update shipping information
- Add tracking numbers
- Notify customers of status changes
- Handle cancellations

### 4. Order Management

- List customer orders
- Get order details
- Order history
- Search and filter orders
- Export order data

### 5. Seller Integration

- Route orders to sellers
- Seller order fulfillment
- Multi-seller order splitting
- Seller payouts calculation

### 6. Returns & Refunds

- Process return requests
- Approve/reject returns
- Issue refunds
- Track return status

## Architecture

Clean Architecture with layers:

1. **Presentation** - Controllers
2. **Application** - Use Cases (CreateOrder, ProcessPayment, etc.)
3. **Domain** - Order entity with business logic
4. **Infrastructure** - Repositories, payment gateway, notifications

## API Endpoints

### Customer Endpoints

- POST /orders - Create order
- GET /orders - List customer's orders
- GET /orders/:id - Get order details
- POST /orders/:id/cancel - Cancel order
- POST /orders/:id/return - Request return

### Seller Endpoints

- GET /seller/orders - List seller's orders
- PUT /seller/orders/:id/status - Update order status
- POST /seller/orders/:id/tracking - Add tracking info
- PUT /seller/orders/:id/ship - Mark as shipped

### Admin Endpoints

- GET /admin/orders - List all orders
- GET /admin/orders/:id - Get order details
- PUT /admin/orders/:id/refund - Process refund
- GET /admin/orders/analytics - Order analytics

## Database Schema

### Orders Table

- id, order_number, customer_id, seller_id
- subtotal, tax, shipping, discount, total
- status, payment_status, payment_method
- shipping_address, billing_address
- tracking_number, notes
- created_at, updated_at

### OrderItems Table

- id, order_id, product_id, variant_id
- name, sku, price, quantity, subtotal

### OrderHistory Table

- id, order_id, status, notes, created_at, created_by

### Payments Table

- id, order_id, amount, status, method
- transaction_id, created_at

## Order States

1. **PENDING**: Order created, awaiting payment
2. **PROCESSING**: Payment confirmed, being prepared
3. **SHIPPED**: Order shipped to customer
4. **DELIVERED**: Order delivered
5. **CANCELLED**: Order cancelled
6. **REFUNDED**: Order refunded

## Technology Stack

- Node.js + Express
- TypeScript
- PostgreSQL
- TypeORM
- Stripe (payment processing)
- RabbitMQ (optional, for async processing)
