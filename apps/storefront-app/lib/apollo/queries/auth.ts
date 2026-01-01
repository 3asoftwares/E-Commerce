/**
 * Authentication GraphQL Queries and Mutations
 * Reusing from @e-commerce/types package
 */

import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
        role
        isActive
        emailVerified
        createdAt
      }
      accessToken
      refreshToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        name
        email
        role
        isActive
        emailVerified
        createdAt
      }
      accessToken
      refreshToken
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      name
      email
      role
      isActive
      emailVerified
      createdAt
      lastLogin
    }
  }
`;
