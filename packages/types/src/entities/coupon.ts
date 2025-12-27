/**
 * Coupon & Offer Entity Types
 */

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  description: string;
  minOrderValue?: number;
  maxDiscount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  usageLimit?: number;
  usageCount: number;
  userLimit?: number; // Per user
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: 'banner' | 'popup' | 'badge';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  startDate: Date;
  endDate: Date;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
