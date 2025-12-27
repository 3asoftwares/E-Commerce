/**
 * Authorization Middleware
 *
 * Responsibilities:
 * - Check user roles/permissions
 * - Allow/deny access based on role
 * - Support multiple required roles
 * - Return 403 if unauthorized
 *
 * Usage:
 * - Applied after authenticate middleware
 * - authorize(['admin']) - Admin only
 * - authorize(['admin', 'seller']) - Admin or seller
 */

// Authorization middleware factory
// export const authorize = (roles: string[]) => { ... };
