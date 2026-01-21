# E-Storefront

[![CI Pipeline](https://github.com/3asoftwares/E-Storefront/actions/workflows/ci.yml/badge.svg)](https://github.com/3asoftwares/E-Storefront/actions/workflows/ci.yml)
[![Deploy Vercel](https://github.com/3asoftwares/E-Storefront/actions/workflows/deploy-vercel.yml/badge.svg)](https://github.com/3asoftwares/E-Storefront/actions/workflows/deploy-vercel.yml)
[![Deploy Railway](https://github.com/3asoftwares/E-Storefront/actions/workflows/deploy-railway.yml/badge.svg)](https://github.com/3asoftwares/E-Storefront/actions/workflows/deploy-railway.yml)

A modern, scalable, and feature-rich e-commerce platform built with cutting-edge technologies.

## � Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        E-Storefront Technology Stack                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         FRONTEND APPLICATIONS                          │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │ │
│  │  │ Web App  │ │Mobile App│ │Admin App │ │Seller App│ │ Support  │     │ │
│  │  │──────────│ │──────────│ │──────────│ │──────────│ │   App    │     │ │
│  │  │ Next.js  │ │  React   │ │   Vite   │ │   Vite   │ │──────────│     │ │
│  │  │ Tailwind │ │  Native  │ │ React 18 │ │ React 18 │ │Bootstrap │     │ │
│  │  │ DaisyUI  │ │ Expo 51  │ │ Redux TK │ │ Redux TK │ │  SCSS    │     │ │
│  │  │ Zustand  │ │ Zustand  │ │RTK Query │ │RTK Query │ │Vanilla JS│     │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│                                      ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          API GATEWAY                                   │ │
│  │                    GraphQL Federation (Apollo)                         │ │
│  │                         Node.js + Express                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│      ┌─────────┬─────────┬─────────┼─────────┬─────────┬─────────┐        │
│      ▼         ▼         ▼         ▼         ▼         ▼         ▼        │
│  ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐   │
│  │  Auth  ││Product ││ Order  ││Category││ Coupon ││ Ticket │           │   │
│  │ Service││Service ││Service ││Service ││Service ││Service │           │   │
│  │────────││────────││────────││────────││────────││────────│           │   │
│  │Express ││Express ││Express ││Express ││Express ││Express │           │   │
│  │JWT/OAuth│Mongoose││Mongoose││Mongoose││Mongoose││Mongoose│           │   │
│  └────────┘└────────┘└────────┘└────────┘└────────┘└────────┘           │   │
│                                      │                                       │
│                          ┌───────────┴───────────┐                          │
│                          ▼                       ▼                          │
│                   ┌────────────┐          ┌────────────┐                    │
│                   │  MongoDB   │          │   Redis    │                    │
│                   │ (Database) │          │  (Cache)   │                    │
│                   └────────────┘          └────────────┘                    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                              DevOps                                    │ │
│  │     Docker │ GitHub Actions │ SonarCloud │ Vercel │ Railway            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## �🏗️ Architecture

This is a monorepo managed with Yarn Workspaces containing:

### 📦 Packages
- `@3asoftwares/types` - Shared TypeScript types and interfaces
- `@3asoftwares/ui` - Shared UI component library
- `@3asoftwares/utils` - Shared utility functions

### 🖥️ Frontend Apps
- `admin-app` - Admin dashboard for platform management
- `seller-app` - Seller portal for product and order management
- `shell-app` - Main shell application and authentication
- `support-app` - Customer support interface (E-Storefront-Support)

### ⚙️ Backend Services
- `auth-service` - Authentication and user management
- `category-service` - Category management
- `coupon-service` - Coupon and discount management
- `graphql-gateway` - GraphQL API gateway
- `order-service` - Order processing
- `product-service` - Product catalog management
- `ticket-service` - Support ticket management

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Yarn 1.22+
- MongoDB
- Redis

### Installation

```bash
# Install dependencies
yarn install

# Build packages
yarn build:packages

# Start development servers
yarn dev
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run package tests
yarn test:packages

# Run frontend tests
yarn test:frontend

# Run backend tests
yarn test:backend
```

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `yarn build` | Build all packages, apps, and services |
| `yarn build:packages` | Build shared packages |
| `yarn build:frontend` | Build frontend applications |
| `yarn build:backend` | Build backend services |
| `yarn test` | Run all test suites |
| `yarn lint` | Lint all code |

## 📋 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **CI Pipeline** - Runs on all pushes and pull requests
  - Builds and tests all packages
  - Builds and tests frontend apps
  - Builds and tests backend services
  
- **Deploy Vercel** - Deploys frontend apps to Vercel
- **Deploy Railway** - Deploys backend services to Railway
- **Publish Packages** - Publishes packages to npm

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

### Core Documentation

| Document                                          | Description                             |
| ------------------------------------------------- | --------------------------------------- |
| [Documentation Index](docs/README.md)             | Complete docs index                     |
| [Getting Started](docs/project/GETTING-STARTED.md)| Setup your development environment      |
| [Architecture](docs/project/ARCHITECTURE.md)      | System architecture and design patterns |
| [High-Level Design](docs/project/HIGH_LEVEL_DESIGN.md)| C4 diagrams, container architecture |
| [Low-Level Design](docs/project/LOW_LEVEL_DESIGN.md)  | Database schemas, service internals |
| [Tech Stack](docs/project/TECH_STACK.md)          | Complete technology stack               |
| [API Reference](docs/project/API.md)              | GraphQL API documentation               |
| [Environment](docs/project/ENVIRONMENT.md)        | Environment variables configuration     |

### Development Guides

| Document                                            | Description                           |
| --------------------------------------------------- | ------------------------------------- |
| [Coding Standards](docs/project/CODING-STANDARDS.md)| TypeScript, React, Node.js practices  |
| [Testing Guide](docs/project/TESTING.md)            | Unit, integration, E2E testing        |
| [Packages Guide](docs/project/PACKAGES.md)          | @3asoftwares shared packages          |
| [Publishing Guide](docs/project/PUBLISHING.md)      | NPM publishing guide                  |
| [Contributing](docs/project/CONTRIBUTING.md)        | Contribution guidelines               |

### Operations

| Document                                       | Description                        |
| ---------------------------------------------- | ---------------------------------- |
| [CI/CD Pipeline](docs/project/CI-CD.md)        | GitHub Actions workflows           |
| [Deployment Guide](docs/project/DEPLOYMENT.md) | Vercel, Railway, Docker deployment |
| [Docker Guide](docs/project/DOCKER.md)         | Docker Compose & Kubernetes        |
| [Security](docs/project/SECURITY.md)           | Security practices & guidelines    |
| [Runbook](docs/project/RUNBOOK.md)             | Operations & incident response     |
| [Troubleshooting](docs/project/TROUBLESHOOTING.md)| Common issues and solutions      |

### Technology Guides

| Document                                                 | Description                    |
| -------------------------------------------------------- | ------------------------------ |
| [Technologies Overview](docs/technologies/)              | Full tech stack documentation  |
| [Node.js](docs/technologies/NODEJS.md)                   | Node.js runtime                |
| [GraphQL](docs/technologies/GRAPHQL.md)                  | GraphQL API, Apollo            |
| [TypeScript](docs/technologies/TYPESCRIPT.md)            | TypeScript patterns            |
| [React](docs/technologies/REACT.md)                      | React components               |
| [Next.js](docs/technologies/NEXTJS.md)                   | Next.js 16 App Router          |
| [Express](docs/technologies/EXPRESS.md)                  | Express.js microservices       |
| [MongoDB](docs/technologies/MONGODB.md)                  | MongoDB & Mongoose             |
| [Redis](docs/technologies/REDIS.md)                      | Caching & sessions             |
| [JWT](docs/technologies/JWT.md)                          | Authentication                 |
| [State Management](docs/technologies/STATE_MANAGEMENT.md)| Zustand & Redux Toolkit        |
| [React Query](docs/technologies/REACT_QUERY.md)          | TanStack Query                 |
| [Vite](docs/technologies/VITE.md)                        | Vite bundler                   |
| [Docker](docs/technologies/DOCKER.md)                    | Containerization               |
| [Microservices](docs/technologies/MICROSERVICES.md)      | Microservices architecture     |
| [Jest](docs/technologies/JEST.md)                        | Unit testing                   |
| [Cypress](docs/technologies/CYPRESS.md)                  | E2E testing                    |

📖 See [docs/README.md](docs/README.md) for complete documentation index with 50+ technology guides.

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

© 2026 3A Softwares. All rights reserved.
