# E-Storefront Documentation

Welcome to the E-Storefront documentation. This guide covers everything you need to develop, deploy, and maintain the platform.

---

## 📚 Documentation Index

### 🚀 Getting Started

| Document                                     | Description                        |
| -------------------------------------------- | ---------------------------------- |
| [Getting Started](project/GETTING-STARTED.md) | Setup your development environment |
| [Environment](project/ENVIRONMENT.md)         | Environment variables              |
| [Troubleshooting](project/TROUBLESHOOTING.md) | Common issues and solutions        |
| [Commands](project/COMMANDS.md)               | Useful development commands        |

### 🏗️ Architecture

| Document                                           | Description                               |
| -------------------------------------------------- | ----------------------------------------- |
| [Architecture Overview](project/ARCHITECTURE.md)   | System architecture and design principles |
| [High-Level Design](project/HIGH_LEVEL_DESIGN.md)  | C4 diagrams, container architecture       |
| [Low-Level Design](project/LOW_LEVEL_DESIGN.md)    | Database schemas, service internals       |
| [Tech Stack](project/TECH_STACK.md)                | Complete technology stack                 |

### 🔌 API

| Document                        | Description                                         |
| ------------------------------- | --------------------------------------------------- |
| [API Reference](project/API.md) | GraphQL API documentation, authentication, examples |

### 💻 Development

| Document                                        | Description                                 |
| ----------------------------------------------- | ------------------------------------------- |
| [Coding Standards](project/CODING-STANDARDS.md) | TypeScript, React, Node.js best practices   |
| [Testing Guide](project/TESTING.md)             | Unit, integration, E2E testing strategies   |
| [Packages Guide](project/PACKAGES.md)           | @3asoftwares/types, utils, ui documentation |
| [Publishing Guide](project/PUBLISHING.md)       | How to publish packages to npm              |

### ⚙️ Operations

| Document                                  | Description                        |
| ----------------------------------------- | ---------------------------------- |
| [CI/CD Pipeline](project/CI-CD.md)        | GitHub Actions workflows           |
| [Deployment Guide](project/DEPLOYMENT.md) | Vercel, Railway, Docker deployment |
| [Docker Guide](project/DOCKER.md)         | Docker Compose for development     |
| [Security](project/SECURITY.md)           | Security practices & guidelines    |
| [Runbook](project/RUNBOOK.md)             | Operations, incident response      |
| [Changelog](project/CHANGELOG.md)         | Version history                    |

### 🤝 Contributing

| Document                                | Description             |
| --------------------------------------- | ----------------------- |
| [Contributing](project/CONTRIBUTING.md) | Contribution guidelines |

---

## 🛠️ Technology Documentation

Complete technology guides are available in the [`technologies/`](technologies/) folder:

### Core Technologies

| Document                                       | Description                         |
| ---------------------------------------------- | ----------------------------------- |
| [Technologies Overview](technologies/)         | Full tech stack documentation       |
| [Node.js](technologies/NODEJS.md)              | Node.js runtime & microservices     |
| [GraphQL](technologies/GRAPHQL.md)             | GraphQL API, Apollo Server & Client |
| [TypeScript](technologies/TYPESCRIPT.md)       | TypeScript configuration & patterns |
| [Next.js](technologies/NEXTJS.md)              | Next.js 16 App Router               |
| [React](technologies/REACT.md)                 | React patterns & components         |
| [Mobile](technologies/MOBILE.md)               | React Native, Expo, Expo Router     |

### State Management

| Document                                             | Description                      |
| ---------------------------------------------------- | -------------------------------- |
| [State Management](technologies/STATE_MANAGEMENT.md) | Zustand & Redux Toolkit          |
| [React Query](technologies/REACT_QUERY.md)           | TanStack Query for data fetching |

### Backend Technologies

| Document                              | Description                    |
| ------------------------------------- | ------------------------------ |
| [Express](technologies/EXPRESS.md)    | Express.js microservices       |
| [MongoDB](technologies/MONGODB.md)    | MongoDB with Mongoose          |
| [Redis](technologies/REDIS.md)        | Caching & session storage      |
| [JWT](technologies/JWT.md)            | Authentication & authorization |
| [Socket.io](technologies/SOCKETIO.md) | Real-time communication        |

### Styling

| Document                               | Description               |
| -------------------------------------- | ------------------------- |
| [Styling](technologies/STYLING.md)     | Tailwind CSS patterns     |
| [DaisyUI](technologies/DAISYUI.md)     | DaisyUI component library |
| [Bootstrap](technologies/BOOTSTRAP.md) | Bootstrap 5 framework     |
| [SCSS](technologies/SCSS.md)           | SCSS preprocessor         |
| [CSS](technologies/CSS.md)             | Modern CSS techniques     |

### Build Tools

| Document                                 | Description                   |
| ---------------------------------------- | ----------------------------- |
| [Vite](technologies/VITE.md)             | Vite for Admin/Seller apps    |
| [Webpack](technologies/WEBPACK.md)       | Webpack Module Federation     |
| [Tsup](technologies/TSUP.md)             | TypeScript package bundler    |
| [Docker](technologies/DOCKER.md)         | Containerization & deployment |

### Testing & Quality

| Document                                                       | Description                     |
| -------------------------------------------------------------- | ------------------------------- |
| [Jest](technologies/JEST.md)                                   | Unit & integration testing      |
| [Vitest](technologies/VITEST.md)                               | Vitest for UI Library testing   |
| [Cypress](technologies/CYPRESS.md)                             | End-to-end testing              |
| [React Testing Library](technologies/REACT_TESTING_LIBRARY.md) | React component testing         |
| [TDD](technologies/TDD.md)                                     | Test-Driven Development         |
| [Storybook](technologies/STORYBOOK.md)                         | Component development & testing |
| [ESLint & Prettier](technologies/ESLINT_PRETTIER.md)           | Linting & formatting            |
| [SonarCloud](technologies/SONARCLOUD.md)                       | Code quality analysis           |
| [Lighthouse](technologies/LIGHTHOUSE.md)                       | Performance auditing            |

### DevOps & Infrastructure

| Document                                   | Description                |
| ------------------------------------------ | -------------------------- |
| [CI/CD](technologies/CI_CD.md)             | GitHub Actions pipelines   |
| [Performance](technologies/PERFORMANCE.md) | Optimization techniques    |

### Security & APIs

| Document                                 | Description                   |
| ---------------------------------------- | ----------------------------- |
| [REST API](technologies/REST_API.md)     | RESTful API design            |
| [OAuth](technologies/OAUTH.md)           | OAuth 2.0 authentication      |
| [CORS](technologies/CORS.md)             | Cross-Origin Resource Sharing |
| [Middleware](technologies/MIDDLEWARE.md) | Express middleware patterns   |

### Architecture & Patterns

| Document                                                     | Description                    |
| ------------------------------------------------------------ | ------------------------------ |
| [Microservices](technologies/MICROSERVICES.md)               | Microservices architecture     |
| [Microfrontend](technologies/MICROFRONTEND.md)               | Micro-frontend with Module Fed |
| [Design Patterns](technologies/DESIGN_PATTERNS.md)           | MVC, Factory, Singleton, etc.  |
| [Internationalization](technologies/INTERNATIONALIZATION.md) | i18n & localization            |
| [Theming](technologies/THEMING.md)                           | Dark mode & theme system       |

### Development Practices

| Document                                                 | Description                       |
| -------------------------------------------------------- | --------------------------------- |
| [Git](technologies/GIT.md)                               | Git, GitHub, GitLab               |
| [Code Reviews](technologies/CODE_REVIEWS.md)             | PR reviews & best practices       |
| [Agile Scrum](technologies/AGILE_SCRUM.md)               | Agile methodology & Scrum         |
| [Project Management](technologies/PROJECT_MANAGEMENT.md) | Planning & architecture oversight |
| [GitHub Copilot](technologies/GITHUB_COPILOT.md)         | AI-powered development            |

---

## 🖥️ Frontend Apps

| App                                        | Description                           |
| ------------------------------------------ | ------------------------------------- |
| [Shell App](../apps/shell-app/README.md)   | Consumer storefront (React + Webpack) |
| [Admin App](../apps/admin-app/README.md)   | Admin dashboard (React + Vite)        |
| [Seller App](../apps/seller-app/README.md) | Seller dashboard (React + Vite)       |

## 🔧 Backend Services

| Service                                                    | Description                    |
| ---------------------------------------------------------- | ------------------------------ |
| [Auth Service](../services/auth-service/README.md)         | Authentication & authorization |
| [Product Service](../services/product-service/README.md)   | Product management & search    |
| [Category Service](../services/category-service/README.md) | Category hierarchy             |
| [Order Service](../services/order-service/README.md)       | Order processing & payments    |
| [Coupon Service](../services/coupon-service/README.md)     | Discounts & promotions         |
| [GraphQL Gateway](../services/graphql-gateway/README.md)   | Unified GraphQL API            |
| [Ticket Service](../services/ticket-service/README.md)     | Customer support tickets       |

---

## 📁 Folder Structure

```
docs/
├── README.md                    # This file
├── project/                     # Project documentation
│   ├── README.md               # Project docs index
│   ├── GETTING-STARTED.md      # Quick start guide
│   ├── ARCHITECTURE.md         # Architecture overview
│   ├── HIGH_LEVEL_DESIGN.md    # High-level design
│   ├── LOW_LEVEL_DESIGN.md     # Low-level design
│   ├── TECH_STACK.md           # Technology stack
│   ├── API.md                  # API reference
│   ├── CODING-STANDARDS.md     # Coding conventions
│   ├── TESTING.md              # Testing strategies
│   ├── PACKAGES.md             # Shared packages docs
│   ├── PUBLISHING.md           # NPM publishing guide
│   ├── CI-CD.md                # CI/CD pipelines
│   ├── DEPLOYMENT.md           # Deployment procedures
│   ├── DOCKER.md               # Docker for development
│   ├── ENVIRONMENT.md          # Environment config
│   ├── SECURITY.md             # Security guidelines
│   ├── RUNBOOK.md              # Operations runbook
│   ├── TROUBLESHOOTING.md      # Problem solving
│   ├── COMMANDS.md             # Useful commands
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   └── CHANGELOG.md            # Version history
└── technologies/                # Technology documentation
    ├── README.md               # Tech stack overview
    └── ... (50+ tech docs)
```

---

## 🔗 Quick Links

| Resource         | Link                           |
| ---------------- | ------------------------------ |
| **Main README**  | [README.md](../README.md)      |
| **Technologies** | [technologies/](technologies/) |
| **License**      | [LICENSE](../LICENSE)          |

---

## 📖 Reading Order for New Developers

1. **[Getting Started](project/GETTING-STARTED.md)** - Setup your environment
2. **[Architecture](project/ARCHITECTURE.md)** - Understand the system
3. **[Tech Stack](project/TECH_STACK.md)** - Learn the technologies
4. **[Packages](project/PACKAGES.md)** - Learn about shared code
5. **[API Reference](project/API.md)** - Explore the GraphQL API
6. **[Coding Standards](project/CODING-STANDARDS.md)** - Follow conventions
7. **[Contributing](project/CONTRIBUTING.md)** - Start contributing

---

## 🆘 Need Help?

-   **Issues:** [GitHub Issues](https://github.com/3asoftwares/E-Storefront/issues)
-   **Discussions:** [GitHub Discussions](https://github.com/3asoftwares/E-Storefront/discussions)
-   **Email:** devteam@3asoftwares.com

---

© 2026 3A Softwares
