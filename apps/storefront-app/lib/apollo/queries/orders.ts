/**
 * Order GraphQL Queries and Mutations
 * Reusing from @e-commerce/types package
 */

import { gql } from '@apollo/client';

export const GET_ORDERS_QUERY = gql`
  query GetOrders($page: Int, $limit: Int, $customerId: String) {
    orders(page: $page, limit: $limit, customerId: $customerId) {
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

export const GET_ORDER_QUERY = gql`
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

export const CREATE_ORDER_MUTATION = gql`
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
