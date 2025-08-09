import { Router } from 'express';
import { TransactionController } from '@/controllers/transaction.controller';
import { ValidationMiddleware } from '@/middleware/validation.middleware';
import { AuthMiddleware } from '@/middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/v1/transactions/purchases
 * @desc    Get user's purchase history
 * @access  Private
 */
router.get(
  '/purchases',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.handleValidation,
  TransactionController.getUserPurchases
);

/**
 * @route   GET /api/v1/transactions/sales
 * @desc    Get user's sales history
 * @access  Private
 */
router.get(
  '/sales',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.handleValidation,
  TransactionController.getUserSales
);

/**
 * @route   GET /api/v1/transactions/analytics
 * @desc    Get transaction analytics (admin only)
 * @access  Private (Admin)
 */
router.get(
  '/analytics',
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
  TransactionController.getTransactionAnalytics
);

/**
 * @route   POST /api/v1/transactions
 * @desc    Create new transaction (purchase dataset)
 * @access  Private
 */
router.post(
  '/',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateTransactionCreation(),
  ValidationMiddleware.handleValidation,
  TransactionController.createTransaction
);

/**
 * @route   GET /api/v1/transactions
 * @desc    Get user's transactions
 * @access  Private
 */
router.get(
  '/',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.handleValidation,
  TransactionController.getAllTransactions
);

/**
 * @route   GET /api/v1/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private
 */
router.get(
  '/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateObjectId('id'),
  ValidationMiddleware.handleValidation,
  TransactionController.getTransactionById
);

/**
 * @route   PUT /api/v1/transactions/:id/status
 * @desc    Update transaction status
 * @access  Private
 */
router.put(
  '/:id/status',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateObjectId('id'),
  ValidationMiddleware.handleValidation,
  TransactionController.updateTransactionStatus
);

export default router;
