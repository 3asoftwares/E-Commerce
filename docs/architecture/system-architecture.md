# System Architecture

> **Enterprise-Grade E-Commerce Platform Architecture**

## Table of Contents

- [Overview](#overview)
- [What is System Architecture?](#what-is-system-architecture)
- [Why It's Important](#why-its-important)
- [Architecture Diagram](#architecture-diagram)
- [Component Layers](#component-layers)
- [Communication Flow](#communication-flow)
- [Technology Benefits](#technology-benefits)

---

## Overview

The 3A Softwares E-Commerce Platform is built on a **microservices architecture** that combines multiple frontend applications with independent backend services. This design enables scalability, maintainability, and rapid development across teams.

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Microservices** | Independent scaling, deployment, and technology choices per service |
| **GraphQL Gateway** | Unified API layer, reduces over-fetching, type-safe contracts |
| **Micro-frontends** | Team autonomy, independent deployments, technology flexibility |
| **Monorepo** | Shared code, atomic changes, simplified dependency management |
| **Event-Driven** | Real-time updates via WebSockets, loose coupling |

---

## What is System Architecture?

System architecture is the **conceptual model** that defines the structure, behavior, and relationships between components in a software system. It includes:

- **Component Design**: How the system is divided into independent modules
- **Communication Patterns**: How components interact (REST, GraphQL, WebSockets)
- **Data Flow**: How data moves through the system
- **Deployment Strategy**: How components are deployed and scaled

### Benefits for Our Application

1. **Scalability**: Each service can scale independently based on load
2. **Fault Isolation**: Failure in one service doesn't cascade
3. **Technology Flexibility**: Teams can choose appropriate tech per service
4. **Faster Development**: Parallel team development without conflicts
5. **Easy Maintenance**: Smaller, focused codebases are easier to understand

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────────┐ │
│  │   Shell App     │  │   Admin App     │  │         Seller App              │ │
│  │   (Port 3000)   │  │   (Port 3001)   │  │         (Port 3002)             │ │
│  │   ─────────     │  │   ─────────     │  │         ─────────               │ │
│  │   Webpack 5     │  │   Vite 4        │  │         Vite 4                  │ │
│  │   Zustand       │  │   Redux Toolkit │  │         Redux Toolkit           │ │
│  │   React 18      │  │   TanStack Query│  │         TanStack Query          │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │ HTTP/HTTPS
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              NGINX REVERSE PROXY                                 │
│                    Rate Limiting │ Load Balancing │ SSL Termination             │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                                      │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │                    GraphQL Gateway (Port 4000)                             │ │
│  │                    ───────────────────────────                             │ │
│  │    Apollo Server 4  │  Schema Stitching  │  Auth Forwarding  │  Express   │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │ Internal HTTP
         ┌─────────────┬───────────┼───────────┬─────────────┐
         ▼             ▼           ▼           ▼             ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MICROSERVICES LAYER                                    │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────┐ │
│  │   Auth    │ │  Product  │ │   Order   │ │ Category  │ │      Coupon       │ │
│  │  Service  │ │  Service  │ │  Service  │ │  Service  │ │      Service      │ │
│  │  (4001)   │ │  (4002)   │ │  (4003)   │ │  (4004)   │ │      (4005)       │ │
│  │───────────│ │───────────│ │───────────│ │───────────│ │───────────────────│ │
│  │ JWT/OAuth │ │   Redis   │ │ Socket.io │ │  Swagger  │ │     Swagger       │ │
│  │ Argon2    │ │  Caching  │ │ Real-time │ │    API    │ │       API         │ │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                            │
│  ┌───────────────────────────────────┐  ┌─────────────────────────────────────┐ │
│  │          MongoDB 7.0              │  │           Redis 7                   │ │
│  │    ─────────────────────          │  │     ─────────────────               │ │
│  │    • Users Collection             │  │     • Session Cache                 │ │
│  │    • Products Collection          │  │     • Product Cache                 │ │
│  │    • Orders Collection            │  │     • Rate Limiting                 │ │
│  │    • Categories Collection        │  │     • Token Blacklist               │ │
│  │    • Coupons Collection           │  │                                     │ │
│  └───────────────────────────────────┘  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Layers

### 1. Presentation Layer (Frontend Apps)

| Application | Purpose | Technology | Port |
|-------------|---------|------------|------|
| **Shell App** | Main entry point, auth gateway, navigation | React 18, Webpack 5, Zustand | 3000 |
| **Admin App** | Platform administration dashboard | React 18, Vite, Redux Toolkit | 3001 |
| **Seller App** | Seller portal for inventory/orders | React 18, Vite, Redux Toolkit | 3002 |

**Why Micro-frontends?**
- **Independent Deployment**: Each app can be deployed without affecting others
- **Team Autonomy**: Different teams can own different apps
- **Technology Freedom**: Each app can choose its own build tools (Webpack vs Vite)
- **Incremental Upgrades**: Upgrade React versions per app, not all at once

### 2. API Gateway Layer

The **GraphQL Gateway** serves as the single entry point for all client requests:

| Feature | Benefit |
|---------|---------|
| **Schema Stitching** | Combines all service schemas into one unified API |
| **Authentication Forwarding** | Passes JWT tokens to downstream services |
| **Query Optimization** | Reduces over-fetching with precise field selection |
| **Error Aggregation** | Unified error handling across services |

### 3. Microservices Layer

| Service | Responsibility | Key Features |
|---------|---------------|--------------|
| **Auth Service** | User authentication & authorization | JWT tokens, Google OAuth, Argon2 hashing |
| **Product Service** | Product catalog management | Redis caching, search, filtering |
| **Order Service** | Order processing & tracking | Real-time WebSocket updates |
| **Category Service** | Category hierarchy | Hierarchical structure, slugs |
| **Coupon Service** | Discount management | Validation, usage limits |

### 4. Data Layer

**MongoDB** (Primary Database):
- Document-based storage for flexible schemas
- Text indexes for search functionality
- Replication for high availability

**Redis** (Caching & Sessions):
- In-memory caching for product data
- Session storage for scalability
- Rate limiting counters

---

## Communication Flow

### Request Flow Example: Product Search

```
1. User → Shell App (React)
        │
        ▼
2. Shell App → GraphQL Gateway (/graphql)
        │       Query: { products(search: "laptop") { id, name, price } }
        ▼
3. GraphQL Gateway → Product Service (HTTP/REST)
        │       GET /api/products?search=laptop
        ▼
4. Product Service → Redis (Cache Check)
        │       GET products:search:laptop
        ▼
5. If Cache Miss → MongoDB Query
        │       db.products.find({ $text: { $search: "laptop" } })
        ▼
6. Product Service → Redis (Cache Write)
        │       SET products:search:laptop (TTL: 5min)
        ▼
7. Response flows back through the chain
```

### Real-Time Communication (WebSockets)

```
Order Status Updates:
┌─────────┐     ┌─────────────┐     ┌─────────────┐
│ Client  │◄────│ Socket.io   │◄────│   Order     │
│  App    │     │  Server     │     │  Service    │
└─────────┘     └─────────────┘     └─────────────┘
     │                │                    │
     │   Subscribe    │                    │
     │───────────────►│                    │
     │                │   Order Updated    │
     │                │◄───────────────────│
     │   Push Update  │                    │
     │◄───────────────│                    │
```

---

## Technology Benefits

### Why This Architecture?

| Aspect | Traditional Monolith | Our Microservices |
|--------|---------------------|-------------------|
| **Scaling** | Scale entire app | Scale individual services |
| **Deployment** | Deploy everything | Deploy only changed services |
| **Fault Tolerance** | One bug crashes all | Isolated failures |
| **Team Structure** | Everyone on one codebase | Teams own services |
| **Technology** | One stack for all | Best tool per job |

### Performance Optimizations

1. **Redis Caching**: Reduces database load by 70%+ for read-heavy operations
2. **CDN Ready**: Static assets can be served from edge locations
3. **Connection Pooling**: MongoDB connection reuse across requests
4. **Lazy Loading**: Frontend apps load modules on-demand

### Security Layers

1. **NGINX**: Rate limiting, DDoS protection, SSL termination
2. **JWT Tokens**: Stateless authentication with short expiry
3. **Role-Based Access**: Fine-grained permissions (Admin/Seller/Customer)
4. **Input Validation**: express-validator on all endpoints

---

## Next Steps

- [Monorepo Structure](monorepo-structure.md) - Understand the code organization
- [Microservices Architecture](microservices-architecture.md) - Deep dive into services
- [Docker Architecture](../devops/docker-architecture.md) - Container setup
