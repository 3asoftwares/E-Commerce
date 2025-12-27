/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * Restrict access based on user roles
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

/**
 * Check if user has required role(s)
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    // Check if user has required role
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: allowedRoles,
        yourRole: userRole,
      });
      return;
    }

    next();
  };
};

/**
 * Require admin role
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Require seller or admin role
 */
export const requireSellerOrAdmin = requireRole(UserRole.SELLER, UserRole.ADMIN);

/**
 * Check if user owns the resource (by userId)
 */
export const requireOwnershipOrAdmin = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    // Admins can access everything
    if (req.user.role === UserRole.ADMIN) {
      next();
      return;
    }

    // Check if resource belongs to user
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (resourceUserId !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.',
      });
      return;
    }

    next();
  };
};

/**
 * Check if user can perform action on their own account or if they're admin
 */
export const requireSelfOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  const targetUserId = req.params.userId || req.params.id;

  // Admins can access any account
  if (req.user.role === UserRole.ADMIN) {
    next();
    return;
  }

  // Users can only access their own account
  if (targetUserId !== req.user.userId) {
    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own account.',
    });
    return;
  }

  next();
};
