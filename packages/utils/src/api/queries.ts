// Common GraphQL queries used across multiple apps

// Auth Queries
export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const GET_CURRENT_USER = `
  query GetCurrentUser {
    me {
      id
      email
      name
      role
      createdAt
    }
  }
`;

// Product Queries
export const GET_PRODUCTS = `
  query GetProducts($page: Int, $limit: Int, $category: String) {
    products(page: $page, limit: $limit, category: $category) {
      products {
        id
        name
        description
        price
        stock
        category
        images
        sellerId
        createdAt
      }
      total
      page
      limit
    }
  }
`;

export const GET_PRODUCT_BY_ID = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      stock
      category
      images
      sellerId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT = `
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      stock
      category
    }
  }
`;

export const UPDATE_PRODUCT = `
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      stock
      category
    }
  }
`;

export const DELETE_PRODUCT = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

// Order Queries
export const GET_ORDERS = `
  query GetOrders($page: Int, $limit: Int, $status: String) {
    orders(page: $page, limit: $limit, status: $status) {
      orders {
        id
        userId
        items {
          productId
          quantity
          price
        }
        total
        status
        createdAt
        updatedAt
      }
      total
      page
      limit
    }
  }
`;

export const GET_ORDER_BY_ID = `
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      userId
      items {
        productId
        productName
        quantity
        price
      }
      total
      status
      shippingAddress
      paymentMethod
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ORDER = `
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      id
      userId
      items {
        productId
        quantity
        price
      }
      total
      status
      createdAt
    }
  }
`;

export const UPDATE_ORDER_STATUS = `
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

// User Queries (Admin)
export const GET_USERS = `
  query GetUsers($page: Int, $limit: Int, $role: String) {
    users(page: $page, limit: $limit, role: $role) {
      users {
        id
        email
        name
        role
        createdAt
      }
      total
      page
      limit
    }
  }
`;

export const UPDATE_USER_ROLE = `
  mutation UpdateUserRole($id: ID!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;

export const DELETE_USER = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// Dashboard Stats
export const GET_DASHBOARD_STATS = `
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      totalProducts
      totalOrders
      totalRevenue
      pendingOrders
      lowStockProducts
    }
  }
`;

// Search
export const SEARCH_PRODUCTS = `
  query SearchProducts($search: String!, $limit: Int) {
    searchProducts(search: $search, limit: $limit) {
      id
      name
      description
      price
      stock
      category
      images
    }
  }
`;
