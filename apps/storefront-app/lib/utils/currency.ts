/**
 * Utility functions for the storefront app
 */

/**
 * Format price in Indian Rupees
 */
export function formatPrice(price: number): string {
  return `₹${price?.toFixed(2)}`;
}

/**
 * Format price for display (shorter version)
 */
export function formatPriceShort(price: number): string {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(1)}K`;
  }
  return `₹${price.toFixed(0)}`;
}
