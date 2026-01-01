/**
 * GraphQL Type Definitions
 */

export const typeDefs = `#graphql
  # Product Types
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String
    sellerId: String!
    isActive: Boolean!
    tags: [String!]!
    rating: Float!
    reviewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type ProductConnection {
    products: [Product!]!
    pagination: Pagination!
  }

  # Order Types
  type Order {
    id: ID!
    orderNumber: String
    customerId: String!
    customerEmail: String!
    items: [OrderItem!]!
    subtotal: Float!
    tax: Float!
    shipping: Float!
    total: Float!
    orderStatus: String!
    paymentStatus: String!
    paymentMethod: String!
    shippingAddress: Address!
    notes: String
    createdAt: String
    updatedAt: String
  }

  type OrderItem {
    productId: String!
    productName: String!
    quantity: Int!
    price: Float!
    subtotal: Float!
  }

  type Address {
    street: String!
    city: String!
    state: String!
    zip: String!
    country: String!
  }

  enum OrderStatus {
    PENDING
    CONFIRMED
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
  }

  type OrderConnection {
    orders: [Order!]!
    pagination: Pagination!
  }

  # User Types
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    isActive: Boolean!
    emailVerified: Boolean!
    createdAt: String
    lastLogin: String
  }

  type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  type UserConnection {
    users: [User!]!
    pagination: Pagination!
  }

  # Analytics Types
  type DashboardStats {
    totalUsers: Int!
    totalOrders: Int!
    totalRevenue: Float!
    pendingOrders: Int!
  }

  # Common Types
  type Pagination {
    page: Int!
    limit: Int!
    total: Int!
    pages: Int!
  }

  # Inputs
  input CreateProductInput {
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String
    sellerId: String!
    tags: [String!]
  }

  input CreateOrderInput {
    customerId: String!
    customerEmail: String!
    items: [OrderItemInput!]!
    subtotal: Float!
    tax: Float
    shipping: Float
    total: Float!
    paymentMethod: String!
    shippingAddress: AddressInput!
    notes: String
  }

  input OrderItemInput {
    productId: String!
    productName: String!
    quantity: Int!
    price: Float!
    subtotal: Float!
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    zip: String!
    country: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
    role: String
  }

  # Queries
  type Query {
    # Analytics
    dashboardStats: DashboardStats!

    # Products
    products(
      page: Int
      limit: Int
      search: String
      category: String
      minPrice: Float
      maxPrice: Float
      sortBy: String
      sortOrder: String
    ): ProductConnection!
    
    product(id: ID!): Product
    
    productsBySeller(sellerId: String!): [Product!]!
    
    categories: [String!]!

    # Orders
    orders(page: Int, limit: Int, customerId: String): OrderConnection!
    
    order(id: ID!): Order
    
    ordersByCustomer(customerId: String!): [Order!]!

    # Auth
    me: User
    
    # Users
    users(page: Int, limit: Int, search: String): UserConnection!
  }

  # Mutations
  type Mutation {
    # Auth
    login(input: LoginInput!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!
    logout: Boolean!

    # Products
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: CreateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    # Orders
    createOrder(input: CreateOrderInput!): Order!
    
    # Users
    updateUserRole(id: ID!, role: String!): User!
    deleteUser(id: ID!): Boolean!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    updatePaymentStatus(id: ID!, status: PaymentStatus!): Order!
    cancelOrder(id: ID!): Order!
  }
`;
