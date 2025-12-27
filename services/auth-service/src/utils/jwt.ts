/**
 * JWT Utility Functions
 *
 * Generate and verify JWT tokens for authentication
 */

import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

// Token payload interface
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Generate access token
 */
export const generateAccessToken = (userId: string, email: string, role: UserRole): string => {
  const payload: TokenPayload = {
    userId,
    email,
    role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: string, email: string, role: UserRole): string => {
  const payload: TokenPayload = {
    userId,
    email,
    role,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (userId: string, email: string, role: UserRole) => {
  return {
    accessToken: generateAccessToken(userId, email, role),
    refreshToken: generateRefreshToken(userId, email, role),
  };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
};
