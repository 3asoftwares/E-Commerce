/**
 * Product GraphQL Queries
 * Reusing from @e-commerce/types package
 */

import { gql } from '@apollo/client';

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts(
    $page: Int
    $limit: Int
    $search: String
    $category: String
    $minPrice: Float
    $maxPrice: Float
    $sortBy: String
    $sortOrder: String
  ) {
    products(
      page: $page
      limit: $limit
      search: $search
      category: $category
      minPrice: $minPrice
      maxPrice: $maxPrice
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      products {
        id
        name
        description
        price
        stock
        category
        sellerId
        isActive
        imageUrl
        tags
        rating
        reviewCount
        createdAt
        updatedAt
      }
      pagination {
        page
        limit
        total
        pages
      }
    }
  }
`;

export const GET_PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      stock
      category
      sellerId
      isActive
      imageUrl
      tags
      rating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories {
    categories
  }
`;
