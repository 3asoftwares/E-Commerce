# Microservices Architecture

> **Detailed Guide to Backend Service Design and Communication**

## Table of Contents

- [Overview](#overview)
- [What is Microservices Architecture?](#what-is-microservices-architecture)
- [Why Microservices?](#why-microservices)
- [Service Catalog](#service-catalog)
- [Service Responsibilities](#service-responsibilities)
- [Communication Patterns](#communication-patterns)
- [Data Management](#data-management)
- [Resilience Patterns](#resilience-patterns)

---

## Overview

The 3A Softwares E-Commerce Platform implements a **microservices architecture** with 6 independent backend services. Each service is responsible for a specific business domain and can be developed, deployed, and scaled independently.

### Architecture at a Glance

| Metric | Value |
|--------|-------|
| **Total Services** | 6 |
| **API Gateway** | GraphQL (Apollo Server 4) |
| **Database** | MongoDB per domain |
| **Cache** | Redis shared cluster |
| **Real-time** | Socket.io in Order Service |
| **Documentation** | Swagger/OpenAPI 3.0 |

---

## What is Microservices Architecture?

Microservices is an architectural style that structures an application as a collection of **loosely coupled, independently deployable services**. Each service:

- Owns its own data
- Communicates via APIs
- Can use different technologies
- Is organized around business capabilities

### Microservices vs Monolith

| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| **Deployment** | All or nothing | Per service |
| **Scaling** | Vertical (bigger server) | Horizontal (more instances) |
| **Technology** | Single stack | Polyglot friendly |
| **Team Structure** | One large team | Small, focused teams |
| **Failure Impact** | Entire app down | Isolated failures |
| **Complexity** | In the codebase | In the infrastructure |

---

## Why Microservices?

### Benefits for Our Platform

#### 1. Independent Deployment
```
Before (Monolith):
├── Change auth logic
├── Test entire application
└── Deploy everything → 2 hour downtime risk

After (Microservices):
├── Change auth-service
├── Test auth-service only
└── Deploy auth-service → 30 second update
```

#### 2. Technology Flexibility
```
auth-service:     Node.js + Express (fast JWT handling)
product-service:  Node.js + Redis (caching)
order-service:    Node.js + Socket.io (real-time)
// Future possibilities:
analytics:        Python + Pandas (data processing)
search:           Go + Elasticsearch (performance)
```

#### 3. Scalability
```
Black Friday Traffic Pattern:
┌────────────────────────────────────────────┐
│ Service           │ Normal │ Peak          │
├────────────────────────────────────────────┤
│ auth-service      │ 2 pods │ 4 pods        │
│ product-service   │ 3 pods │ 10 pods ⬆️    │
│ order-service     │ 2 pods │ 8 pods ⬆️     │
│ category-service  │ 2 pods │ 2 pods        │
│ coupon-service    │ 1 pod  │ 3 pods        │
└────────────────────────────────────────────┘
```

#### 4. Fault Isolation
```
If product-service fails:
✅ Users can still log in (auth-service)
✅ Sellers can view orders (order-service)
✅ Categories still load (category-service)
❌ Product listing unavailable (graceful degradation)
```

---

## Service Catalog

### Complete Service Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GRAPHQL GATEWAY (4000)                                 │
│            Apollo Server 4 │ Schema Stitching │ Auth Forwarding                 │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │
         ┌──────────────┬──────────────┼──────────────┬──────────────┐
         ▼              ▼              ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│    AUTH     │ │   PRODUCT   │ │    ORDER    │ │  CATEGORY   │ │   COUPON    │
│   SERVICE   │ │   SERVICE   │ │   SERVICE   │ │   SERVICE   │ │   SERVICE   │
│   (4001)    │ │   (4002)    │ │   (4003)    │ │   (4004)    │ │   (4005)    │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ Express 4   │ │ Express 4   │ │ Express 4   │ │ Express 4   │ │ Express 4   │
│ JWT/OAuth   │ │ Redis Cache │ │ Socket.io   │ │ Swagger     │ │ Swagger     │
│ Argon2      │ │ Swagger     │ │ Swagger     │ │             │ │             │
│ Nodemailer  │ │             │ │             │ │             │ │             │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │               │               │
       ▼               ▼               ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MONGODB / REDIS                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Service Details Table

| Service | Port | Database | Key Dependencies | API Docs |
|---------|------|----------|------------------|----------|
| **GraphQL Gateway** | 4000 | - | Apollo Server, Axios | GraphQL Playground |
| **Auth Service** | 4001 | MongoDB | JWT, Argon2, Nodemailer | Swagger |
| **Product Service** | 4002 | MongoDB + Redis | ioredis, Mongoose | Swagger |
| **Order Service** | 4003 | MongoDB | Socket.io, Mongoose | Swagger |
| **Category Service** | 4004 | MongoDB | Mongoose | Swagger |
| **Coupon Service** | 4005 | MongoDB | Mongoose | Swagger |

---

## Service Responsibilities

### 1. GraphQL Gateway

**Purpose**: Single entry point for all client requests

```
┌─────────────────────────────────────────────────────────┐
│                  GRAPHQL GATEWAY                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  RESPONSIBILITIES:                                      │
│  ✓ Schema stitching (combine all service schemas)       │
│  ✓ Request routing to appropriate service               │
│  ✓ Authentication header forwarding                     │
│  ✓ Error aggregation and formatting                     │
│  ✓ Query optimization                                   │
│                                                         │
│  DOES NOT:                                              │
│  ✗ Store any data                                       │
│  ✗ Implement business logic                             │
│  ✗ Validate business rules                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Endpoints**:
- `POST /graphql` - GraphQL queries and mutations
- `GET /graphql` - GraphQL Playground (development)

### 2. Auth Service

**Purpose**: User authentication and authorization

```typescript
// Domain: User Identity & Access
interface AuthServiceDomain {
  // Entities
  User: {
    email: string;
    password: string;  // Argon2 hashed
    role: 'admin' | 'seller' | 'customer';
    verified: boolean;
  };
  
  Session: {
    userId: string;
    accessToken: string;
    refreshToken: string;
  };
  
  // Operations
  register(email, password): User;
  login(email, password): Session;
  verifyEmail(token): boolean;
  resetPassword(token, newPassword): boolean;
  googleOAuth(code): Session;
}
```

**API Endpoints**:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/google` | Google OAuth redirect |
| GET | `/api/auth/google/callback` | OAuth callback |

### 3. Product Service

**Purpose**: Product catalog management

```typescript
// Domain: Product Catalog
interface ProductServiceDomain {
  // Entities
  Product: {
    name: string;
    description: string;
    price: number;
    images: string[];
    category: ObjectId;
    seller: ObjectId;
    inventory: number;
    ratings: Rating[];
  };
  
  // Operations
  createProduct(data): Product;
  updateProduct(id, data): Product;
  deleteProduct(id): boolean;
  searchProducts(query, filters): Product[];
  getProductsByCategory(categoryId): Product[];
  getProductsBySeller(sellerId): Product[];
}
```

**Caching Strategy**:
```
┌─────────────────────────────────────────────────────────┐
│                 PRODUCT CACHING                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Cache Key Pattern:                                     │
│  ├── product:{id}           → Single product (5 min)   │
│  ├── products:page:{n}      → Product list (2 min)     │
│  ├── products:category:{id} → By category (5 min)      │
│  └── products:search:{hash} → Search results (1 min)   │
│                                                         │
│  Invalidation:                                          │
│  ├── On product update → Delete product:{id}           │
│  ├── On product create → Delete products:page:*        │
│  └── On category change → Delete products:category:*   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4. Order Service

**Purpose**: Order processing and real-time tracking

```typescript
// Domain: Order Management
interface OrderServiceDomain {
  // Entities
  Order: {
    userId: ObjectId;
    items: OrderItem[];
    status: OrderStatus;
    shippingAddress: Address;
    paymentMethod: string;
    total: number;
    timeline: StatusChange[];
  };
  
  OrderStatus: 'pending' | 'confirmed' | 'processing' | 
               'shipped' | 'delivered' | 'cancelled';
  
  // Operations
  createOrder(userId, cart): Order;
  updateStatus(orderId, status): Order;
  cancelOrder(orderId): boolean;
  getOrderHistory(userId): Order[];
}
```

**Real-time Updates**:
```javascript
// Socket.io event flow
io.on('connection', (socket) => {
  // Join user-specific room
  socket.join(`user:${userId}`);
  
  // Emit order updates
  orderService.onStatusChange((order) => {
    io.to(`user:${order.userId}`).emit('order:updated', order);
  });
});
```

### 5. Category Service

**Purpose**: Hierarchical category management

```typescript
// Domain: Product Categories
interface CategoryServiceDomain {
  // Entities
  Category: {
    name: string;
    slug: string;
    parentId: ObjectId | null;
    image: string;
    order: number;
  };
  
  // Operations
  createCategory(data): Category;
  getCategoryTree(): CategoryTree;
  getCategoryWithChildren(id): Category[];
  moveCategory(id, newParentId): Category;
}
```

### 6. Coupon Service

**Purpose**: Discount and promotion management

```typescript
// Domain: Promotions
interface CouponServiceDomain {
  // Entities
  Coupon: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minOrderAmount: number;
    maxUses: number;
    currentUses: number;
    expiresAt: Date;
    applicableCategories: ObjectId[];
  };
  
  // Operations
  createCoupon(data): Coupon;
  validateCoupon(code, cartTotal): ValidationResult;
  applyCoupon(code, orderId): boolean;
  getCouponsByCategory(categoryId): Coupon[];
}
```

---

## Communication Patterns

### 1. Synchronous (Request-Response)

**Pattern**: Client → Gateway → Service → Database

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │───▶│ Gateway  │───▶│ Service  │───▶│ Database │
│          │◀───│          │◀───│          │◀───│          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     GraphQL        HTTP           Mongoose
```

**Use Cases**:
- Product search
- User authentication
- Order placement
- Category listing

**Implementation**:
```typescript
// GraphQL Gateway → Product Service
const getProduct = async (id: string) => {
  const response = await axios.get(
    `${PRODUCT_SERVICE_URL}/api/products/${id}`,
    { headers: { Authorization: authHeader } }
  );
  return response.data;
};
```

### 2. Service-to-Service Communication

**Pattern**: Service A → Service B (internal network)

```
┌──────────────────────────────────────────────────────────┐
│                    INTERNAL NETWORK                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Order Service                     Product Service       │
│  ┌──────────────┐                 ┌──────────────┐      │
│  │ Check stock  │────────────────▶│ GET /stock   │      │
│  │              │◀────────────────│              │      │
│  └──────────────┘                 └──────────────┘      │
│                                                          │
│  Auth Service                      Order Service         │
│  ┌──────────────┐                 ┌──────────────┐      │
│  │ Verify user  │────────────────▶│ Verify seller│      │
│  │              │◀────────────────│              │      │
│  └──────────────┘                 └──────────────┘      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3. Real-time (WebSockets)

**Pattern**: Client ⟷ Socket Server

```
┌──────────┐          ┌──────────────────────────┐
│  Client  │◀━━━━━━━━▶│     Order Service        │
│          │ Socket.io│  ┌──────────────────┐    │
│          │          │  │ Event: order:new │    │
│          │          │  │ Event: order:upd │    │
│          │          │  │ Event: order:del │    │
│          │          │  └──────────────────┘    │
└──────────┘          └──────────────────────────┘
```

**Events**:
| Event | Direction | Payload |
|-------|-----------|---------|
| `order:created` | Server → Client | New order details |
| `order:updated` | Server → Client | Status change |
| `order:cancelled` | Server → Client | Cancellation |

### 4. API Gateway Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY PATTERN                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Benefits:                                                  │
│  ✓ Single entry point for all clients                       │
│  ✓ Protocol translation (GraphQL → REST)                   │
│  ✓ Request aggregation (one call, multiple services)       │
│  ✓ Cross-cutting concerns (auth, logging, rate limiting)   │
│                                                             │
│  Example: Get Order with Product Details                    │
│  ┌─────────┐      ┌─────────┐      ┌─────────┐             │
│  │ Client  │─────▶│ Gateway │─┬───▶│ Orders  │             │
│  │         │      │         │ │    └─────────┘             │
│  │         │      │         │ │    ┌─────────┐             │
│  │         │      │         │ └───▶│Products │             │
│  │         │◀─────│ Combine │◀─────┴─────────┘             │
│  └─────────┘      └─────────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Management

### Database Per Service

Each service owns its data exclusively:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Auth DB     │     │ Product DB  │     │ Order DB    │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ users       │     │ products    │     │ orders      │
│ sessions    │     │ reviews     │     │ order_items │
│ tokens      │     │ inventory   │     │ shipments   │
└─────────────┘     └─────────────┘     └─────────────┘
      ▲                   ▲                   ▲
      │                   │                   │
┌─────┴─────┐       ┌─────┴─────┐       ┌─────┴─────┐
│Auth Service│      │Product Svc│       │Order Svc  │
└───────────┘       └───────────┘       └───────────┘
```

### Data Consistency

**Challenge**: Maintain consistency across services

**Solution**: Eventual consistency with compensation

```
Order Creation Flow:
1. Order Service → Create order (status: pending)
2. Product Service → Reserve inventory
3. Payment Service → Process payment
4. If payment fails:
   ├── Product Service → Release inventory
   └── Order Service → Mark cancelled
5. If success:
   └── Order Service → Mark confirmed
```

---

## Resilience Patterns

### 1. Circuit Breaker

```typescript
// If service fails repeatedly, open circuit
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 10000,
});

const callProductService = circuitBreaker.wrap(async () => {
  return axios.get(`${PRODUCT_SERVICE_URL}/api/products`);
});
```

### 2. Retry with Backoff

```typescript
const retryConfig = {
  retries: 3,
  backoff: 'exponential',
  initialDelay: 100,
  maxDelay: 2000,
};

const fetchWithRetry = async (url: string) => {
  let delay = retryConfig.initialDelay;
  for (let i = 0; i < retryConfig.retries; i++) {
    try {
      return await axios.get(url);
    } catch (error) {
      await sleep(delay);
      delay = Math.min(delay * 2, retryConfig.maxDelay);
    }
  }
  throw new Error('Service unavailable');
};
```

### 3. Timeout

```typescript
const axiosInstance = axios.create({
  timeout: 5000, // 5 second timeout
});
```

### 4. Health Checks

```typescript
// Each service exposes /health endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    checks: {
      mongodb: mongoose.connection.readyState === 1,
      redis: redisClient.isReady,
    },
  };
  res.json(health);
});
```

---

## Related Documentation

- [System Architecture](system-architecture.md) - High-level overview
- [API Documentation](../api/api-documentation.md) - Endpoint details
- [Docker Architecture](../devops/docker-architecture.md) - Container setup
