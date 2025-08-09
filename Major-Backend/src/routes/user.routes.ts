import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { ValidationMiddleware } from '@/middleware/validation.middleware';
import { AuthMiddleware } from '@/middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user profile by ID
 * @access  Public
 */
router.get(
  '/:id',
  ValidationMiddleware.validateObjectId('id'),
  ValidationMiddleware.handleValidation,
  UserController.getUserById
);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/profile',
  AuthMiddleware.authenticate,
  ValidationMiddleware.handleValidation,
  UserController.updateProfile
);

/**
 * @route   GET /api/v1/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get(
  '/stats',
  AuthMiddleware.authenticate,
  UserController.getUserStats
);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get(
  '/',
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.handleValidation,
  UserController.getAllUsers
);

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete(
  '/account',
  AuthMiddleware.authenticate,
  UserController.deleteAccount
);

export default router;
