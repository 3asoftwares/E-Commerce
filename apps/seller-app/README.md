# Seller App - Seller Portal

**Technology:** React + Vite  
**Port:** 3002

## Purpose

Seller portal for managing products, inventory, and orders. Sellers can manage their product catalog, track inventory, and fulfill orders.

## Responsibilities

- **Product Management**: Create, edit, delete products; upload images
- **Inventory Tracking**: Monitor stock levels, set low stock alerts
- **Order Fulfillment**: View and process orders for seller's products
- **Sales Analytics**: Track sales performance, revenue trends
- **Profile Management**: Update seller information, business details

## Key Features

- Product catalog CRUD operations
- Image upload and management
- Real-time inventory dashboard
- Order fulfillment interface
- Sales performance metrics and charts
- Stock alerts and notifications

## Structure

```
seller-app/
├── public/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/
│   │   ├── Dashboard.tsx    # Overview with metrics
│   │   ├── Products.tsx     # Product catalog management
│   │   ├── Inventory.tsx    # Inventory tracking
│   │   ├── Orders.tsx       # Order fulfillment
│   │   └── Analytics.tsx    # Sales analytics
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

- Development: http://localhost:3002
- Preview: http://localhost:3002

## API Integration

Connects to GraphQL Gateway on port 4000 for all backend operations.
