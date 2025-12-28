/**
 * Product GraphQL Queries and Mutations
 * Product management operations
 */

// Queries
export const GET_PRODUCTS_QUERY = `
  query GetProducts($page: Int, $limit: Int, $search: String, $category: String, $minPrice: Float, $maxPrice: Float) {
    products(page: $page, limit: $limit, search: $search, category: $category, minPrice: $minPrice, maxPrice: $maxPrice) {
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

export const GET_PRODUCT_QUERY = `
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

export const GET_PRODUCTS_BY_SELLER_QUERY = `
  query GetProductsBySeller($sellerId: String!) {
    productsBySeller(sellerId: $sellerId) {
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

export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    categories
  }
`;

// Mutations
export const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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

export const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($id: ID!, $input: CreateProductInput!) {
    updateProduct(id: $id, input: $input) {
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

export const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;
