# Storefront App - GraphQL Implementation

This storefront application now uses **Apollo Client** integrated with **TanStack Query** for optimal data fetching and caching.

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd apps/storefront-app
npm install
```

This will install:
- `@apollo/client` - GraphQL client
- `graphql` - GraphQL language support
- `@tanstack/react-query` - Query state management (already installed)

### 2. Configure GraphQL Endpoint

Create a `.env.local` file in the storefront-app directory:

```bash
cp .env.local.example .env.local
```

Update the GraphQL endpoint:
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

### 3. Run the Application

```bash
npm run dev
```

The app will run on `http://localhost:3003`

## 📁 Architecture Overview

### GraphQL + TanStack Query Integration

We're using a hybrid approach that combines the best of both worlds:

- **Apollo Client**: Handles GraphQL queries/mutations, authentication, caching
- **TanStack Query**: Provides React hooks, optimistic updates, and state management

### Project Structure

```
apps/storefront-app/
├── lib/
│   ├── apollo/
│   │   ├── client.ts           # Apollo Client configuration
│   │   └── queries/
│   │       ├── auth.ts         # Authentication queries/mutations
│   │       ├── products.ts     # Product queries
│   │       └── orders.ts       # Order queries/mutations
│   └── hooks/
│       ├── useAuth.ts          # Auth hooks (login, signup, logout)
│       ├── useProducts.ts      # Product fetching hooks
│       ├── useOrders.ts        # Order management hooks
│       └── index.ts            # Consolidated exports
└── app/
    ├── login/page.tsx          # ✅ Implemented with GraphQL
    ├── signup/page.tsx         # ✅ Implemented with GraphQL
    ├── products/
    │   ├── page.tsx            # ✅ Implemented with GraphQL
    │   └── [id]/page.tsx       # ✅ Implemented with GraphQL
    ├── orders/
    │   ├── page.tsx            # ✅ Implemented with GraphQL
    │   └── [id]/page.tsx       # ✅ Implemented with GraphQL
    └── checkout/page.tsx       # ✅ Implemented with GraphQL
```

## ✅ Implemented Features

### Authentication
- **Login** (`/login`) - Uses `LOGIN_MUTATION` from `@e-commerce/types`
- **Signup** (`/signup`) - Uses `REGISTER_MUTATION` from `@e-commerce/types`
- **Logout** - Clears tokens and Apollo cache
- **Current User** - Auto-fetches and caches user data

### Products
- **Product List** (`/products`) - Filterable by category, price, search
- **Product Detail** (`/products/[id]`) - Full product information
- **Categories** - Fetches available categories

### Orders
- **Order List** (`/orders`) - Paginated order history
- **Order Detail** (`/orders/[id]`) - Detailed order information
- **Create Order** (`/checkout`) - Place new orders with cart items

## 🎯 Key Features

### Apollo Client Configuration

- **Authentication**: Automatically adds JWT token to requests
- **Error Handling**: Catches auth errors and redirects to login
- **Caching**: Intelligent cache policies for different query types
- **Network Policies**: 
  - `cache-and-network` for lists
  - `cache-first` for details
  - `network-only` for mutations

### TanStack Query Integration

```typescript
// Example: Fetch products with filters
const { data, isLoading, error } = useProducts(page, limit, filters);

// Example: Create order mutation
const { mutateAsync: createOrder, isPending } = useCreateOrder();
await createOrder(orderData);

// Example: Login
const { login, isLoading, error } = useLogin();
await login({ email, password });
```

### Type Safety

All types are imported from `@e-commerce/types` package:
- `UserGraphQL`, `AuthPayload`
- `ProductGraphQL`, `ProductConnection`
- `OrderGraphQL`, `CreateOrderInput`

## 🔐 Authentication Flow

1. User logs in/signs up
2. Server returns `accessToken` and `refreshToken`
3. Tokens stored in `localStorage`
4. Apollo Client adds token to all requests via `authLink`
5. User data cached in TanStack Query
6. On error, tokens cleared and redirected to login

## 📝 Usage Examples

### Login
```typescript
const { login, isLoading, error } = useLogin();

const handleLogin = async () => {
  try {
    await login({ email, password });
    router.push('/');
  } catch (err) {
    console.error('Login failed:', err);
  }
};
```

### Fetch Products
```typescript
const { data, isLoading } = useProducts(1, 20, {
  category: 'Electronics',
  minPrice: 100,
  maxPrice: 1000,
});

const products = data?.products || [];
```

### Create Order
```typescript
const { mutateAsync: createOrder } = useCreateOrder();

const handleCheckout = async () => {
  const order = await createOrder({
    customerId,
    customerEmail,
    items: [...],
    shippingAddress: {...},
    total,
  });
  
  router.push(`/orders/${order.id}`);
};
```

## 🔧 Environment Variables

```env
# Required
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# Optional (for production)
NEXT_PUBLIC_API_TIMEOUT=30000
```

## 🚨 Important Notes

1. **GraphQL Server Required**: Make sure your GraphQL server is running
2. **Schema Compatibility**: Queries match the schema in `packages/types`
3. **Token Storage**: Uses `localStorage` (consider httpOnly cookies for production)
4. **Error Handling**: All errors are caught and displayed to users

## 🔄 Migration from REST

If you previously used REST APIs, this implementation replaces:
- `apiService.getProducts()` → `useProducts()`
- `apiService.login()` → `useLogin()`
- `apiService.createOrder()` → `useCreateOrder()`

## 🧪 Testing

Ensure your GraphQL server supports these operations:
- `Query`: `products`, `product`, `orders`, `order`, `me`, `categories`
- `Mutation`: `login`, `register`, `logout`, `createOrder`

## 📚 Resources

- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [GraphQL Docs](https://graphql.org/learn/)

## 🐛 Troubleshooting

**Issue**: `Cannot find module '@apollo/client'`
**Solution**: Run `npm install` in the storefront-app directory

**Issue**: Network error / GraphQL endpoint not found
**Solution**: Check your `.env.local` file and ensure the GraphQL server is running

**Issue**: Authentication errors
**Solution**: Check that tokens are being stored in localStorage and sent with requests

## 📧 Support

For issues or questions, check the main project README or create an issue in the repository.
