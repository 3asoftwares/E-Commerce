/**
 * Coupon Types
 * Consolidated coupon-related types for REST API and GraphQL
 */

// GraphQL Input Types
export interface CreateCouponInput {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {
  isActive?: boolean;
}

export interface CouponQueryVariables {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

// GraphQL Response Type (matches GraphQL schema exactly)
export interface CouponGraphQL {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  minOrderValue?: number; // Alias for minPurchase
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponConnection {
  coupons: CouponGraphQL[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
