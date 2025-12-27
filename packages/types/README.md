# Types Package

Shared TypeScript types and interfaces for the e-commerce platform.

## Purpose

Provides type safety and consistency across all applications by defining:

- Domain entities (Product, Order, User)
- API contracts (request/response types)
- Enums and constants
- Utility types

## Structure

### Domain Entities

- User: User/customer entity
- Product: Product entity
- Order: Order entity
- Cart: Shopping cart
- Address: Address entity
- Payment: Payment information
- Review: Product review

### Enums

- UserRole: admin, seller, customer
- OrderStatus: pending, processing, shipped, delivered, cancelled
- ProductStatus: draft, pending, approved, rejected
- PaymentStatus: pending, completed, failed
- ShippingMethod: standard, express, overnight

### API Types

- Request types (CreateProductRequest, UpdateOrderRequest)
- Response types (ProductResponse, OrderListResponse)
- Pagination types
- Error types

### Utility Types

- Common utility types
- Type guards
- Type helpers

## Usage

All apps import types from this package:

```
import type { Product, Order, UserRole } from '@e-commerce/types';
```

## Benefits

1. **Type Safety**: Catch errors at compile time
2. **Consistency**: Same types across frontend and backend
3. **Documentation**: Types serve as documentation
4. **Refactoring**: Easy to update types in one place
5. **IDE Support**: Better autocomplete and IntelliSense
