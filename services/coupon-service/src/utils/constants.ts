/**
 * Configuration constants for coupon-service
 * Replaces imports from @3asoftwares/utils
 */

export const PORT_CONFIG = {
  AUTH: 4001,
  PRODUCT: 4002,
  ORDER: 4003,
  CATEGORY: 4004,
  COUPON: 4005,
  GATEWAY: 4000,
} as const;

export const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:5173',
  'http://localhost:5174',
];
