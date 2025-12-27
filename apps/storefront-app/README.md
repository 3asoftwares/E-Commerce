# Storefront App - Customer E-Commerce

**Technology:** Next.js (App Router)  
**Port:** 3003

## Purpose

Customer-facing e-commerce storefront for browsing products, managing cart, and completing purchases.

## Responsibilities

- **Product Browsing**: Display products with search, filters, and sorting
- **Product Details**: Show detailed product information, images, reviews
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Secure payment processing and order placement
- **Order Tracking**: View order history and current order status
- **User Account**: Profile management, saved addresses, payment methods
- **Reviews**: Product ratings and customer reviews

## Key Features

- SEO-optimized product pages (Next.js SSR)
- Advanced search with filters (category, price, rating)
- Real-time inventory updates
- Secure checkout with multiple payment options
- Order history and tracking
- Wishlist functionality
- Product recommendations
- Responsive design for mobile/tablet/desktop

## Structure

```
storefront-app/
├── public/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── products/
│   │   ├── page.tsx         # Product listing
│   │   └── [id]/
│   │       └── page.tsx     # Product detail
│   ├── cart/
│   │   └── page.tsx         # Shopping cart
│   ├── checkout/
│   │   └── page.tsx         # Checkout flow
│   ├── orders/
│   │   └── page.tsx         # Order history
│   └── account/
│       └── page.tsx         # User account
├── components/              # React components
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Running

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Port

- Development: http://localhost:3003
- Production: http://localhost:3003

## API Integration

Connects to GraphQL Gateway on port 4000 for all backend operations.

## SEO Features

- Server-side rendering for product pages
- Dynamic meta tags and Open Graph
- Sitemap generation
- Structured data (JSON-LD)
