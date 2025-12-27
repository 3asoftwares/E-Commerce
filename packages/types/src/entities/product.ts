/**
 * Product Entity Types
 */

import { ProductStatus } from '../enums/productStatus';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  barcode?: string;
  sellerId: string;
  sellerName: string;
  categoryId: string;
  category: ProductCategory;
  subcategoryId?: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  tags: string[];
  status: ProductStatus;
  inventory: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  rating: number;
  reviewCount: number;
  totalSold: number;
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price?: number;
  compareAtPrice?: number;
  inventory: number;
  options: {
    [key: string]: string; // e.g., { size: 'M', color: 'Red' }
  };
  images?: string[];
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductFilter {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  brands?: string[];
  tags?: string[];
  inStock?: boolean;
  onSale?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  search?: string;
  page?: number;
  limit?: number;
}
