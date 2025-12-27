/**
 * Product Domain Entity
 *
 * Properties:
 * - id, sellerId, name, description
 * - price, compareAtPrice, sku
 * - categoryId, tags, status
 * - inventory, rating, reviewCount
 * - images, variants
 * - createdAt, updatedAt
 *
 * Methods:
 * - calculateAverageRating: Update average rating
 * - isAvailable: Check stock availability
 * - applyDiscount: Apply discount
 * - addVariant: Add product variant
 * - updateInventory: Update stock level
 *
 * Business Rules:
 * - Price must be positive
 * - Inventory cannot be negative
 * - SKU must be unique
 * - Status changes based on approval workflow
 */

// Product entity with business logic
