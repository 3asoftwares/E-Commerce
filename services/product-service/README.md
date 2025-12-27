# Product Service

Product catalog management microservice for the e-commerce platform.

## Responsibilities

### 1. Product Management

- Create, read, update, delete products
- Manage product variants
- Handle product images
- Product categorization
- Product tagging
- SEO optimization

### 2. Catalog Management

- Browse product catalog
- Filter by category, price, brand
- Sort products
- Pagination
- Featured products
- New arrivals

### 3. Search

- Full-text product search
- Autocomplete suggestions
- Search filters
- Relevance ranking

### 4. Reviews & Ratings

- Submit product reviews
- Rate products
- Review moderation
- Calculate average ratings
- Review helpfulness

### 5. Inventory

- Track stock levels
- Update inventory
- Low stock alerts
- Inventory history
- Multi-location inventory

### 6. Seller Products

- Seller product submission
- Approval workflow
- Product status management
- Seller product listing

## Architecture

Clean Architecture with layers:

1. **Presentation** - Controllers
2. **Application** - Use Cases
3. **Domain** - Entities and business logic
4. **Infrastructure** - Repositories, external services

## API Endpoints

### Public Endpoints

- GET /products - List products
- GET /products/:id - Get product details
- GET /products/:id/reviews - Get reviews
- GET /categories - List categories
- GET /search - Search products

### Seller Endpoints (Authenticated)

- POST /seller/products - Create product
- PUT /seller/products/:id - Update product
- DELETE /seller/products/:id - Delete product
- GET /seller/products - List seller's products
- POST /seller/products/:id/submit - Submit for approval

### Admin Endpoints (Authenticated)

- PUT /admin/products/:id/approve - Approve product
- PUT /admin/products/:id/reject - Reject product
- GET /admin/products/pending - List pending products

## Database Schema

### Products Table

- id, seller_id, name, description, price
- category_id, status, sku, inventory
- rating, review_count, created_at, updated_at

### ProductVariants Table

- id, product_id, name, sku, price, inventory

### ProductImages Table

- id, product_id, url, is_primary, order

### Categories Table

- id, name, slug, parent_id, description

### Reviews Table

- id, product_id, user_id, rating, comment, created_at

## Technology Stack

- Node.js + Express
- TypeScript
- PostgreSQL
- TypeORM
- Elasticsearch (optional, for search)
- AWS S3 (image storage)
