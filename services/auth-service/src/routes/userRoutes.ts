/**
 * User Management Routes
 *
 * Define all user management endpoints (admin only)
 */

import express from 'express';
import * as userController from '../controllers/UserController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (paginated)
 * @access  Private (Admin only)
 */
router.get('/', authenticate, userController.getUsers);

/**
 * @route   PATCH /api/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin only)
 */
router.patch('/:id/role', authenticate, userController.updateUserRole);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, userController.deleteUser);

export default router;
