# Admin App - Platform Administration

**Technology:** React + Vite  
**Port:** 3001

## Purpose

Admin dashboard for complete platform management including users, orders, products, and analytics.

## Responsibilities

- **User Management**: View, create, edit, delete users; manage roles
- **Order Management**: View all orders, update status, track fulfillment
- **Product Oversight**: Approve/reject seller products, manage categories
- **Analytics**: Platform-wide metrics, revenue reports, sales trends
- **System Configuration**: Platform settings, payment gateways, shipping options

## Key Features

- Real-time dashboard with key metrics
- User role management (Admin, Seller, Customer)
- Order tracking and fulfillment tools
- Revenue and sales analytics
- Product moderation queue
- System logs and audit trails

## Structure

```
admin-app/
├── public/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/
│   │   ├── Dashboard.tsx    # Main dashboard with metrics
│   │   ├── Users.tsx        # User management
│   │   ├── Orders.tsx       # Order management
│   │   ├── Products.tsx     # Product oversight
│   │   └── Analytics.tsx    # Reports and charts
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Running

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Port

- Development: http://localhost:3001
- Preview: http://localhost:3001

## API Integration

Connects to GraphQL Gateway on port 4000 for all backend operations.
