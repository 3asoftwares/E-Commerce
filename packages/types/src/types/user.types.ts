/**
 * User Types
 * Consolidated user-related types for REST API and GraphQL
 */

// REST API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

// GraphQL Input Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface UserQueryVariables {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

// GraphQL Response Type (matches GraphQL schema exactly)
export interface UserGraphQL {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface UserConnection {
  users: UserGraphQL[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth Response
export interface AuthPayload {
  user: UserGraphQL;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserGraphQL;
  token: string;
  refreshToken: string;
}
