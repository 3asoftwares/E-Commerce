# Monorepo Structure

> **Organizing Code Across Multiple Applications and Services**

## Table of Contents

- [Overview](#overview)
- [What is a Monorepo?](#what-is-a-monorepo)
- [Why We Use Monorepo](#why-we-use-monorepo)
- [Directory Structure](#directory-structure)
- [Workspace Organization](#workspace-organization)
- [Dependency Management](#dependency-management)
- [Build Order](#build-order)

---

## Overview

The 3A Softwares E-Commerce Platform uses a **Yarn Workspaces Monorepo** structure to manage:
- 3 Frontend Applications
- 6 Backend Services  
- 3 Shared Packages

This approach allows us to share code efficiently while maintaining clear boundaries between components.

---

## What is a Monorepo?

A **monorepo** (monolithic repository) is a software development strategy where code for multiple projects is stored in a single repository. Unlike polyrepos (one repo per project), monorepos enable:

- **Atomic Changes**: Single commit can update multiple packages
- **Shared Dependencies**: Common libraries are deduplicated
- **Unified CI/CD**: One pipeline builds and tests everything
- **Cross-Project Refactoring**: IDE support across all projects

### Monorepo vs Polyrepo

| Aspect | Monorepo | Polyrepo |
|--------|----------|----------|
| **Code Sharing** | Easy via workspaces | Requires publishing packages |
| **Dependency Updates** | Single update affects all | Update each repo separately |
| **CI/CD** | One pipeline, smart builds | Separate pipelines per repo |
| **Team Coordination** | Single source of truth | Cross-repo PRs needed |
| **Repository Size** | Larger, needs optimization | Smaller per repo |

---

## Why We Use Monorepo

### Benefits for Our Platform

1. **Shared Type Definitions**
   - `@3asoftwares/types` is used by both frontend and backend
   - Type changes are immediately available everywhere
   - No version mismatch issues

2. **Unified UI Components**
   - `@3asoftwares/ui` provides consistent components
   - Design system changes propagate instantly
   - Storybook documents all apps' components

3. **Common Utilities**
   - `@3asoftwares/utils` contains shared helpers
   - Logging, validation, configs are standardized
   - DRY principle across the entire codebase

4. **Atomic Commits**
   ```
   Single commit can:
   ├── Add new API endpoint (auth-service)
   ├── Add TypeScript type (types package)
   ├── Update GraphQL schema (graphql-gateway)
   └── Consume in frontend (admin-app)
   ```

5. **Simplified Development**
   ```bash
   # Start everything with one command
   yarn dev:all
   
   # Run all tests
   yarn test:all
   
   # Build everything
   yarn build:all
   ```

---

## Directory Structure

```
3asoftwares/
│
├── 📁 apps/                          # Frontend Applications
│   ├── 📁 admin-app/                 # Admin Dashboard
│   │   ├── src/
│   │   │   ├── components/           # React components
│   │   │   ├── pages/                # Route pages
│   │   │   ├── store/                # Redux store
│   │   │   ├── hooks/                # Custom hooks
│   │   │   └── services/             # API calls
│   │   ├── tests/                    # Jest tests
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.ts
│   │
│   ├── 📁 seller-app/                # Seller Portal
│   │   └── (similar structure)
│   │
│   └── 📁 shell-app/                 # Main Entry/Auth Gateway
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── webpack.config.ts         # Uses Webpack (Module Federation)
│
├── 📁 services/                      # Backend Microservices
│   ├── 📁 auth-service/              # Authentication Service
│   │   ├── src/
│   │   │   ├── controllers/          # Request handlers
│   │   │   ├── models/               # Mongoose schemas
│   │   │   ├── routes/               # Express routes
│   │   │   ├── middleware/           # Auth, validation
│   │   │   ├── services/             # Business logic
│   │   │   ├── config/               # Configuration
│   │   │   └── swagger/              # API documentation
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── 📁 product-service/           # Product Management
│   ├── 📁 order-service/             # Order Processing
│   ├── 📁 category-service/          # Category Management
│   ├── 📁 coupon-service/            # Discount Management
│   └── 📁 graphql-gateway/           # API Gateway
│       ├── src/
│       │   ├── schema/               # GraphQL schemas
│       │   ├── resolvers/            # Query/Mutation handlers
│       │   └── datasources/          # Service connectors
│       └── package.json
│
├── 📁 packages/                      # Shared Libraries
│   ├── 📁 types/                     # TypeScript Definitions
│   │   ├── src/
│   │   │   ├── user.ts               # User types
│   │   │   ├── product.ts            # Product types
│   │   │   ├── order.ts              # Order types
│   │   │   └── index.ts              # Barrel export
│   │   ├── package.json
│   │   └── tsup.config.ts            # Build config
│   │
│   ├── 📁 ui-library/                # React Components
│   │   ├── src/
│   │   │   ├── components/           # Button, Modal, etc.
│   │   │   ├── hooks/                # Shared hooks
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── 📁 utils/                     # Utility Functions
│       ├── src/
│       │   ├── logger.ts             # Structured logging
│       │   ├── validation.ts         # Input validation
│       │   ├── api-helpers.ts        # HTTP helpers
│       │   └── constants.ts          # Shared constants
│       ├── config/                   # Shared configs
│       │   ├── jest.backend.config.js
│       │   ├── jest.frontend.config.js
│       │   ├── tailwind.config.ts
│       │   └── vite.config.ts
│       └── package.json
│
├── 📁 k8s/                           # Kubernetes Configs
│   ├── deployment.yaml
│   ├── services/
│   ├── database/
│   └── ingress.yaml
│
├── 📁 nginx/                         # Reverse Proxy
│   ├── nginx.conf
│   └── Dockerfile
│
├── 📁 mongo-init/                    # Database Setup
│   └── 01-init-databases.js
│
├── 📁 sample-data/                   # Seed Data
│   ├── generate-data.js
│   └── data/
│
├── 📁 scripts/                       # Automation Scripts
│   ├── docker-setup.ps1
│   ├── health-check.ps1
│   └── vercel-deploy-all.ps1
│
├── 📁 docs/                          # Documentation
│
├── 📄 package.json                   # Root workspace config
├── 📄 yarn.lock                      # Dependency lockfile
├── 📄 tsconfig.json                  # Base TypeScript config
├── 📄 docker-compose.yml             # Development setup
├── 📄 docker-compose.dev.yml         # Separated backend/frontend
└── 📄 docker-compose.production.yml  # Production setup
```

---

## Workspace Organization

### apps/ - Frontend Applications

Frontend applications that users interact with:

| App | Description | Build Tool | State Management |
|-----|-------------|------------|------------------|
| `shell-app` | Main launcher, auth gateway | Webpack 5 | Zustand |
| `admin-app` | Admin dashboard | Vite 4 | Redux Toolkit + TanStack Query |
| `seller-app` | Seller portal | Vite 4 | Redux Toolkit + TanStack Query |

**Key Characteristics:**
- Each app has its own `package.json`
- Share common packages via workspace dependencies
- Can be deployed independently
- Have their own test suites

### services/ - Backend Microservices

Backend services that handle business logic:

| Service | Port | Database | Special Features |
|---------|------|----------|------------------|
| `auth-service` | 4001 | MongoDB | JWT, OAuth, Argon2 |
| `product-service` | 4002 | MongoDB + Redis | Caching, Search |
| `order-service` | 4003 | MongoDB | Socket.io real-time |
| `category-service` | 4004 | MongoDB | Hierarchical data |
| `coupon-service` | 4005 | MongoDB | Validation rules |
| `graphql-gateway` | 4000 | - | Schema stitching |

**Key Characteristics:**
- Clean Architecture pattern
- Swagger API documentation
- Health check endpoints
- Independent scaling

### packages/ - Shared Libraries

Reusable code shared across apps and services:

| Package | Purpose | Consumers |
|---------|---------|-----------|
| `@3asoftwares/types` | TypeScript type definitions | All apps & services |
| `@3asoftwares/ui` | React component library | All frontend apps |
| `@3asoftwares/utils` | Utility functions | All apps & services |

**Publishing:**
- Packages can be published to npm
- Internal consumption via workspace protocol
- Semantic versioning for releases

---

## Dependency Management

### Root package.json

```json
{
  "name": "ecommerce-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*", 
    "services/*"
  ],
  "scripts": {
    "dev:all": "concurrently \"yarn dev:frontend\" \"yarn dev:backend\"",
    "build:all": "yarn build:package && yarn build:frontend && yarn build:backend",
    "test:all": "yarn test:frontend && yarn test:package && yarn test:backend"
  }
}
```

### Workspace Dependencies

Apps consume packages using the workspace protocol:

```json
// apps/admin-app/package.json
{
  "dependencies": {
    "@3asoftwares/types": "^1.0.2",
    "@3asoftwares/ui": "^1.0.1",
    "@3asoftwares/utils": "^1.0.7"
  }
}
```

### Dependency Resolution

```
yarn install
    │
    ├── Reads all workspace package.json files
    ├── Deduplicates common dependencies
    ├── Hoists shared deps to root node_modules
    └── Creates symlinks for workspace packages
```

### Version Synchronization

The `resolutions` field ensures consistent versions:

```json
{
  "resolutions": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "typescript": "5.3.0"
  }
}
```

---

## Build Order

Packages must be built in dependency order:

```
┌─────────────────────────────────────────────────────────┐
│                    BUILD ORDER                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  STAGE 1: Foundational Packages                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ @3asoftwares/types (no dependencies)            │   │
│  └─────────────────────────────────────────────────┘   │
│                         ▼                               │
│  STAGE 2: Utility Package                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ @3asoftwares/utils (depends on types)           │   │
│  └─────────────────────────────────────────────────┘   │
│                         ▼                               │
│  STAGE 3: UI Library                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │ @3asoftwares/ui (depends on utils)              │   │
│  └─────────────────────────────────────────────────┘   │
│                         ▼                               │
│  STAGE 4: Applications (parallel)                       │
│  ┌──────────────┬──────────────┬─────────────────┐     │
│  │ admin-app    │ seller-app   │    shell-app    │     │
│  │ auth-service │ product-svc  │   order-service │     │
│  └──────────────┴──────────────┴─────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Build Commands

```bash
# Build packages in order
yarn build:package   # types → utils → ui

# Build frontends (parallel after packages)
yarn build:frontend  # admin, seller, shell

# Build backends (parallel after packages)
yarn build:backend   # all services

# Build everything
yarn build:all
```

---

## Development Workflow

### Daily Development

```bash
# 1. Start infrastructure
docker-compose up mongodb redis -d

# 2. Start all development servers
yarn dev:all

# 3. Work on specific app
yarn dev:admin       # Just admin app

# 4. Run tests for changed code
yarn test:admin
```

### Making Cross-Package Changes

```bash
# 1. Update types package
cd packages/types
# Edit src/user.ts

# 2. Rebuild types
yarn workspace @3asoftwares/types build

# 3. TypeScript picks up changes immediately
# No need to reinstall dependencies
```

### Health Checks

```bash
# Check all workspaces
yarn health

# Check specific areas
yarn health:frontend
yarn health:backend
yarn health:package
```

---

## Best Practices

### 1. Package Boundaries
- Keep packages focused (single responsibility)
- Avoid circular dependencies
- Export only what's needed (barrel exports)

### 2. Version Management
- Use semantic versioning
- Update versions together for breaking changes
- Lock versions in CI/CD

### 3. Import Conventions
```typescript
// ✅ Good: Import from package
import { Button } from '@3asoftwares/ui';
import { User } from '@3asoftwares/types';

// ❌ Bad: Deep imports bypass package API
import { Button } from '@3asoftwares/ui/src/components/Button';
```

### 4. Testing Strategy
- Unit tests in each workspace
- Integration tests at service level
- E2E tests at the root level

---

## Related Documentation

- [Workspace Rules](workspace-rules.md) - Dependency and import rules
- [Build Strategy](../development/build-strategy.md) - Build configuration
- [CI/CD Pipeline](../devops/ci-cd-pipeline.md) - Automated builds
