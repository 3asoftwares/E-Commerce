# Workspace Rules

> **Guidelines for Dependency Management, Imports, and Versioning**

## Table of Contents

- [Overview](#overview)
- [Why Workspace Rules Matter](#why-workspace-rules-matter)
- [Dependency Rules](#dependency-rules)
- [Import Rules](#import-rules)
- [Versioning Strategy](#versioning-strategy)
- [Enforcement](#enforcement)

---

## Overview

This document defines the rules and conventions for managing dependencies, imports, and versions across the 3A Softwares monorepo. Following these rules ensures:

- **Consistency**: Same patterns across all workspaces
- **Maintainability**: Easy to understand and modify
- **Reliability**: Fewer runtime errors from mismatched versions
- **Performance**: Optimized builds and bundle sizes

---

## Why Workspace Rules Matter

### Benefits

| Benefit | Description |
|---------|-------------|
| **Reduced Conflicts** | Consistent versions prevent "works on my machine" issues |
| **Faster Builds** | Hoisted dependencies reduce duplicate installations |
| **Type Safety** | Shared types ensure contracts between packages |
| **Easy Refactoring** | Clear boundaries make changes predictable |
| **Smaller Bundles** | Shared code is deduplicated |

### Risks of Not Following Rules

- ❌ Version conflicts between packages
- ❌ Circular dependencies causing build failures
- ❌ Type mismatches at runtime
- ❌ Bloated bundle sizes from duplicate code
- ❌ Difficult debugging across packages

---

## Dependency Rules

### 1. Dependency Categories

| Category | Where to Install | Example |
|----------|-----------------|---------|
| **Workspace Packages** | Consumer's package.json | `@3asoftwares/ui` |
| **Shared Dev Tools** | Root package.json | `typescript`, `concurrently` |
| **App-Specific Deps** | App's package.json | `react-router-dom` |
| **Service-Specific** | Service's package.json | `mongoose`, `socket.io` |

### 2. Workspace Package Dependencies

**Rule**: Use the workspace protocol for internal packages

```json
// ✅ Correct - workspace protocol
{
  "dependencies": {
    "@3asoftwares/types": "^1.0.2",
    "@3asoftwares/utils": "^1.0.7"
  }
}
```

```json
// ❌ Wrong - specific version without workspace
{
  "dependencies": {
    "@3asoftwares/types": "1.0.2"
  }
}
```

### 3. Peer Dependencies

**Rule**: Shared packages should use peerDependencies for optional integrations

```json
// packages/utils/package.json
{
  "peerDependencies": {
    "express": "^4.18.2",
    "express-validator": "^7.0.1"
  },
  "peerDependenciesMeta": {
    "express": { "optional": true },
    "express-validator": { "optional": true }
  }
}
```

### 4. Version Resolutions

**Rule**: Use resolutions in root package.json for critical shared dependencies

```json
// Root package.json
{
  "resolutions": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "typescript": "5.3.0"
  }
}
```

**Why?** Prevents multiple React versions causing hooks errors.

### 5. Dependency Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                 DEPENDENCY HIERARCHY                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  LAYER 1: External Libraries                            │
│  ─────────────────────────                              │
│  React, Express, MongoDB, etc.                          │
│  (No internal dependencies)                             │
│                         ▲                               │
│                         │                               │
│  LAYER 2: @3asoftwares/types                            │
│  ────────────────────────                               │
│  TypeScript interfaces and types                        │
│  (Depends only on external libs)                        │
│                         ▲                               │
│                         │                               │
│  LAYER 3: @3asoftwares/utils                            │
│  ─────────────────────────                              │
│  Utility functions and helpers                          │
│  (Depends on types)                                     │
│                         ▲                               │
│                         │                               │
│  LAYER 4: @3asoftwares/ui                               │
│  ─────────────────────────                              │
│  React components                                       │
│  (Depends on utils)                                     │
│                         ▲                               │
│                         │                               │
│  LAYER 5: Apps & Services                               │
│  ─────────────────────────                              │
│  admin-app, auth-service, etc.                          │
│  (Can depend on any layer above)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6. Prohibited Dependencies

| Prohibited | Reason | Alternative |
|------------|--------|-------------|
| `packages/*` → `apps/*` | Circular dependency | Extract to package |
| `packages/*` → `services/*` | Circular dependency | Use peer deps |
| `services/*` → `apps/*` | Wrong direction | Use API calls |
| `apps/*` → `services/*` | Direct import | Use HTTP/GraphQL |

---

## Import Rules

### 1. Package Imports

**Rule**: Always import from package root, never from internal paths

```typescript
// ✅ Correct - import from package root
import { Button, Modal } from '@3asoftwares/ui';
import { User, Product } from '@3asoftwares/types';
import { logger, validateEmail } from '@3asoftwares/utils';
```

```typescript
// ❌ Wrong - deep imports bypass package API
import { Button } from '@3asoftwares/ui/src/components/Button';
import { User } from '@3asoftwares/types/src/user';
```

### 2. Subpath Exports

**Rule**: Use defined subpath exports only

```typescript
// ✅ Correct - documented subpath exports
import { logger } from '@3asoftwares/utils/server';
import { formatPrice } from '@3asoftwares/utils/client';
import tailwindConfig from '@3asoftwares/utils/config/tailwind';
```

### 3. Relative Imports Within Workspace

**Rule**: Use relative imports within the same workspace

```typescript
// Inside apps/admin-app/src/pages/Dashboard.tsx

// ✅ Correct - relative import within same workspace
import { Header } from '../components/Header';
import { useAuth } from '../hooks/useAuth';

// ❌ Wrong - importing from another app
import { Header } from '@3asoftwares/seller-app/src/components/Header';
```

### 4. Cross-Service Communication

**Rule**: Services communicate via HTTP/GraphQL, never direct imports

```typescript
// Inside services/order-service

// ✅ Correct - HTTP call to product service
const product = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${id}`);

// ✅ Correct - use shared types
import { Product } from '@3asoftwares/types';

// ❌ Wrong - direct import from another service
import { productModel } from '@3asoftwares/product-service/src/models/Product';
```

### 5. Import Order Convention

```typescript
// 1. Node.js built-ins
import path from 'path';
import fs from 'fs';

// 2. External packages
import express from 'express';
import mongoose from 'mongoose';

// 3. Workspace packages
import { User } from '@3asoftwares/types';
import { logger } from '@3asoftwares/utils';

// 4. Relative imports
import { UserController } from './controllers/UserController';
import { userRoutes } from './routes/userRoutes';
```

---

## Versioning Strategy

### 1. Semantic Versioning

All packages follow [Semantic Versioning](https://semver.org/):

| Version Part | When to Increment | Example |
|--------------|-------------------|---------|
| **MAJOR** | Breaking changes | 1.0.0 → 2.0.0 |
| **MINOR** | New features (backward compatible) | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes | 1.0.0 → 1.0.1 |

### 2. Version Sync Strategy

**Rule**: Shared packages should be versioned together when there are breaking changes

```bash
# When @3asoftwares/types has breaking change:
# Update version in all packages that depend on it

packages/types:    1.0.2 → 2.0.0
packages/utils:    1.0.7 → 1.1.0 (update types dep)
packages/ui:       1.0.2 → 1.1.0 (update utils dep)
```

### 3. Pre-release Versions

| Tag | Purpose | Example |
|-----|---------|---------|
| `alpha` | Internal testing | 1.0.0-alpha.1 |
| `beta` | External testing | 1.0.0-beta.1 |
| `rc` | Release candidate | 1.0.0-rc.1 |

### 4. Version Constraints

| Constraint | Meaning | Use Case |
|------------|---------|----------|
| `^1.0.0` | Compatible with 1.x.x | Default for packages |
| `~1.0.0` | Compatible with 1.0.x | Strict patch updates |
| `1.0.0` | Exact version | Lock specific version |
| `*` | Any version | Not recommended |

### 5. Publishing Workflow

```bash
# 1. Update version in package.json
cd packages/types
npm version patch  # or minor, major

# 2. Build the package
yarn build

# 3. Publish to npm
npm publish --access public

# 4. Update dependent packages
cd ../utils
yarn upgrade @3asoftwares/types
```

---

## Enforcement

### 1. TypeScript Configuration

```json
// Root tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@3asoftwares/types": ["packages/types/src"],
      "@3asoftwares/utils": ["packages/utils/src"],
      "@3asoftwares/ui": ["packages/ui-library/src"]
    }
  }
}
```

### 2. ESLint Rules

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@3asoftwares/*/src/*'],
            message: 'Import from package root, not internal paths'
          },
          {
            group: ['../../../*'],
            message: 'Avoid deep relative imports, use package imports'
          }
        ]
      }
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling'
        ]
      }
    ]
  }
};
```

### 3. Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 4. CI Checks

```yaml
# .github/workflows/ci.yml
- name: Check dependencies
  run: |
    # Ensure no circular dependencies
    npx madge --circular packages/

    # Verify import rules
    yarn lint
```

---

## Quick Reference

### Allowed Dependencies

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    types     │ ◄── │    utils     │ ◄── │      ui      │
└──────────────┘     └──────────────┘     └──────────────┘
       ▲                    ▲                    ▲
       │                    │                    │
       └────────────────────┴────────────────────┘
                            │
               ┌────────────┴────────────┐
               │                         │
        ┌──────┴──────┐          ┌───────┴───────┐
        │    apps/*   │          │  services/*   │
        └─────────────┘          └───────────────┘
```

### Import Cheat Sheet

| From | To | Method |
|------|-----|--------|
| App → Package | ✅ | `import { X } from '@3asoftwares/pkg'` |
| Service → Package | ✅ | `import { X } from '@3asoftwares/pkg'` |
| Package → Package | ✅ | Only up the hierarchy |
| App → Service | ❌ | Use HTTP/GraphQL API |
| Service → App | ❌ | Not allowed |
| App → App | ❌ | Extract to package |

---

## Related Documentation

- [Monorepo Structure](monorepo-structure.md) - Directory organization
- [Build Strategy](../development/build-strategy.md) - Build order and configs
- [CI/CD Pipeline](../devops/ci-cd-pipeline.md) - Automated enforcement
