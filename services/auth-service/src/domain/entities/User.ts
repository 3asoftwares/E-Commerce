/**
 * User Domain Entity
 *
 * Properties:
 * - id: Unique identifier
 * - email: Email address (unique)
 * - passwordHash: Hashed password
 * - firstName: First name
 * - lastName: Last name
 * - role: User role (admin, seller, customer)
 * - isActive: Account active status
 * - emailVerified: Email verification status
 * - createdAt: Account creation date
 * - updatedAt: Last update date
 * - lastLoginAt: Last login timestamp
 * - failedLoginAttempts: Failed login count
 *
 * Methods:
 * - verifyPassword: Compare password with hash
 * - updatePassword: Change password
 * - incrementFailedAttempts: Track failed logins
 * - resetFailedAttempts: Reset after successful login
 * - isLocked: Check if account is locked
 *
 * Business Rules:
 * - Email must be unique
 * - Password must meet strength requirements
 * - Account locks after N failed attempts
 * - Email must be verified for certain actions
 */

// User entity class
// export class User { ... }
