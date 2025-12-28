import { ProductGraphQL, ProductFilter } from '../types/product.types';

export type {
  ProductGraphQL,
  ProductConnection,
  CreateProductInput,
  UpdateProductInput,
  ProductQueryVariables,
  ProductFilter,
  CreateProductRequest,
  UpdateProductRequest,
} from '../types/product.types';

export interface GetProductsRequest extends ProductFilter {}

export interface GetProductsResponse {
  products: ProductGraphQL[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProductRequest {
  id?: string;
  slug?: string;
}
