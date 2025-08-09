import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { ValidationMiddleware } from '@/middleware/validation.middleware';
import { AuthMiddleware } from '@/middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  ValidationMiddleware.validateRegistration(),
  ValidationMiddleware.handleValidation,
  AuthController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  ValidationMiddleware.validateLogin(),
  ValidationMiddleware.handleValidation,
  AuthController.login
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  AuthMiddleware.authenticate,
  AuthController.getProfile
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post(
  '/refresh',
  AuthMiddleware.authenticate,
  AuthController.refreshToken
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  '/logout',
  AuthMiddleware.authenticate,
  AuthController.logout
);

export default router;
