/**
 * JWT Service
 *
 * JWT token operations:
 * - generateAccessToken: Create access token (short-lived)
 * - generateRefreshToken: Create refresh token (long-lived)
 * - verifyToken: Validate and decode token
 * - decodeToken: Decode without verification
 *
 * Token Payload:
 * - userId: User ID
 * - email: User email
 * - role: User role
 * - type: Token type (access/refresh)
 * - iat: Issued at
 * - exp: Expiration
 *
 * Responsibilities:
 * - Generate JWT tokens
 * - Verify token signatures
 * - Handle token expiration
 * - Extract token payload
 */

// JWT service implementation
// Uses jsonwebtoken library
// export class JwtService { ... }
