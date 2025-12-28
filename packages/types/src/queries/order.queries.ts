/**
 * Order GraphQL Queries and Mutations
 * Order management operations
 */

// Queries
export const GET_ORDERS_QUERY = `
  query GetOrders($page: Int, $limit: Int) {
    orders(page: $page, limit: $limit) {
      orders {
        id
        orderNumber
        customerId
        customerEmail
        items {
          productId
          productName
          quantity
          price
          subtotal
        }
        subtotal
        tax
        shipping
        total
        orderStatus
        paymentStatus
        paymentMethod
        shippingAddress {
          street
          city
          state
          zip
          country
        }
        notes
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

export const GET_ORDER_QUERY = `
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      customerId
      customerEmail
      items {
        productId
        productName
        quantity
        price
        subtotal
      }
      subtotal
      tax
      shipping
      total
      orderStatus
      paymentStatus
      paymentMethod
      shippingAddress {
        street
        city
        state
        zip
        country
      }
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_ORDERS_BY_CUSTOMER_QUERY = `
  query GetOrdersByCustomer($customerId: String!) {
    ordersByCustomer(customerId: $customerId) {
      id
      orderNumber
      customerId
      customerEmail
      items {
        productId
        productName
        quantity
        price
        subtotal
      }
      subtotal
      tax
      shipping
      total
      orderStatus
      paymentStatus
      paymentMethod
      shippingAddress {
        street
        city
        state
        zip
        country
      }
      notes
      createdAt
      updatedAt
    }
  }
`;

// Mutations
export const CREATE_ORDER_MUTATION = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
      customerId
      customerEmail
      items {
        productId
        productName
        quantity
        price
        subtotal
      }
      subtotal
      tax
      shipping
      total
      orderStatus
      paymentStatus
      paymentMethod
      shippingAddress {
        street
        city
        state
        zip
        country
      }
      notes
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ORDER_STATUS_MUTATION = `
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      orderNumber
      orderStatus
      updatedAt
    }
  }
`;

export const UPDATE_PAYMENT_STATUS_MUTATION = `
  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {
    updatePaymentStatus(id: $id, status: $status) {
      id
      orderNumber
      paymentStatus
      updatedAt
    }
  }
`;

export const CANCEL_ORDER_MUTATION = `
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      id
      orderNumber
      orderStatus
      updatedAt
    }
  }
`;
