import { Router } from 'express';
import { DatasetController } from '@/controllers/dataset.controller';
import { ValidationMiddleware } from '@/middleware/validation.middleware';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { uploadDataset, handleUploadError } from '@/middleware/upload.middleware';

const router = Router();

/**
 * @route   GET /api/v1/datasets/categories
 * @desc    Get all dataset categories
 * @access  Public
 */
router.get('/categories', DatasetController.getCategories);

/**
 * @route   GET /api/v1/datasets/my-datasets
 * @desc    Get current user's datasets
 * @access  Private
 */
router.get(
  '/my-datasets',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.handleValidation,
  DatasetController.getUserDatasets
);

/**
 * @route   POST /api/v1/datasets
 * @desc    Create new dataset
 * @access  Private
 */
router.post(
  '/',
  AuthMiddleware.authenticate,
  uploadDataset,
  handleUploadError,
  ValidationMiddleware.validateDatasetCreation(),
  ValidationMiddleware.handleValidation,
  DatasetController.createDataset
);

/**
 * @route   GET /api/v1/datasets
 * @desc    Get all datasets with filtering
 * @access  Public
 */
router.get(
  '/',
  AuthMiddleware.optionalAuth,
  ValidationMiddleware.validatePagination(),
  ValidationMiddleware.validateSearch(),
  ValidationMiddleware.handleValidation,
  DatasetController.getAllDatasets
);

/**
 * @route   GET /api/v1/datasets/:id
 * @desc    Get dataset by ID
 * @access  Public
 */
router.get(
  '/:id',
  AuthMiddleware.optionalAuth,
  ValidationMiddleware.validateObjectId('id'),
  ValidationMiddleware.handleValidation,
  DatasetController.getDatasetById
);

/**
 * @route   PUT /api/v1/datasets/:id
 * @desc    Update dataset
 * @access  Private (Owner/Admin)
 */
router.put(
  '/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateObjectId('id'),
  ValidationMiddleware.validateDatasetUpdate(),
  ValidationMiddleware.handleValidation,
  DatasetController.updateDataset
);

/**
 * @route   DELETE /api/v1/datasets/:id
 * @desc    Delete dataset
 * @access  Private (Owner/Admin)
 */
router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateObjectId('id'),
  ValidationMiddleware.handleValidation,
  DatasetController.deleteDataset
);

/**
 * @route   GET /api/v1/datasets/:id/download
 * @desc    Download dataset file
 * @access  Private
 */
router.get(
  '/:id/download',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateObjectId('id'),
  ValidationMiddleware.handleValidation,
  DatasetController.downloadDataset
);

export default router;
