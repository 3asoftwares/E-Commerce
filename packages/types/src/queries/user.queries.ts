/**
 * User GraphQL Queries and Mutations
 * User and authentication-related operations
 */

// Queries
export const GET_USERS_QUERY = `
  query GetUsers($page: Int, $limit: Int, $search: String) {
    users(page: $page, limit: $limit, search: $search) {
      users {
        id
        name
        email
        role
        isActive
        emailVerified
        createdAt
        lastLogin
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

export const GET_USER_QUERY = `
  query GetUser($id: ID!) {
    user(id: $id) {
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

export const GET_ME_QUERY = `
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

// Mutations
export const LOGIN_MUTATION = `
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

export const REGISTER_MUTATION = `
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

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout
  }
`;

export const UPDATE_USER_ROLE_MUTATION = `
  mutation UpdateUserRole($id: ID!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
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

export const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
