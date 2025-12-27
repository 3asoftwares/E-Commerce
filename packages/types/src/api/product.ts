/**
 * Product API Types
 */

import { Product, ProductFilter } from '../entities/product';

export interface GetProductsRequest extends ProductFilter {}

export interface GetProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProductRequest {
  id?: string;
  slug?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  sku: string;
  inventory: number;
  tags?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}
