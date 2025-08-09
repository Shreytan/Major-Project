import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { ResponseUtils } from '@/utils/response.utils';
import { CryptoUtils } from '@/utils/crypto.utils';

export class ValidationMiddleware {
  /**
   * Handle validation results
   */
  static handleValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => 
        `${error.type === 'field' ? error.path : 'unknown'}: ${error.msg}`
      );
      ResponseUtils.validationError(res, errorMessages);
      return;
    }
    
    next();
  }

  /**
   * User registration validation
   */
  static validateRegistration(): ValidationChain[] {
    return [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
      
      body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
      
      body('walletAddress')
        .trim()
        .matches(/^0x[a-fA-F0-9]{40}$/)
        .withMessage('Please provide a valid Ethereum wallet address (42 characters starting with 0x)'),

        
      body('tags')
        .optional()
        .custom((value) => {
            // Handle both string and array formats
            let tags;
            if (typeof value === 'string') {
            try {
                tags = JSON.parse(value);
            } catch {
                // If not valid JSON, treat as single tag
                tags = [value];
            }
            } else if (Array.isArray(value)) {
            tags = value;
            } else {
            return true; // Skip validation if no tags
            }
            
            if (tags.length > 10) {
            throw new Error('Maximum 10 tags allowed');
            }
            
            if (tags.some((tag: any) => typeof tag !== 'string' || tag.length > 30)) {
            throw new Error('Each tag must be a string with 30 characters or less');
            }
            
            return true;
        }),

      
      body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters')
    ];
  }

  /**
   * User login validation
   */
  static validateLogin(): ValidationChain[] {
    return [
      body('identifier')
        .trim()
        .notEmpty()
        .withMessage('Email, username, or wallet address is required'),
      
      body('walletAddress')
        .optional()
        .custom((value) => {
          if (value && !CryptoUtils.isValidEthereumAddress(value)) {
            throw new Error('Please provide a valid Ethereum wallet address');
          }
          return true;
        })
    ];
  }

  /**
   * Dataset creation validation
   */
  static validateDatasetCreation(): ValidationChain[] {
    return [
      body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
      
      body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
      
      body('category')
        .trim()
        .isIn([
          'Healthcare', 'Finance', 'E-commerce', 'Technology', 'Education',
          'Marketing', 'Social Media', 'IoT', 'Transportation', 'Entertainment',
          'Sports', 'Government', 'Other'
        ])
        .withMessage('Please select a valid category'),
      
      body('price')
        .isFloat({ min: 0, max: 1000 })
        .withMessage('Price must be between 0 and 1000 ETH'),
      
      body('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 tags allowed')
        .custom((tags: string[]) => {
          if (tags && tags.some(tag => tag.length > 30)) {
            throw new Error('Each tag must be 30 characters or less');
          }
          return true;
        })
    ];
  }

  /**
   * Dataset update validation
   */
  static validateDatasetUpdate(): ValidationChain[] {
    return [
      body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
      
      body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
      
      body('category')
        .optional()
        .trim()
        .isIn([
          'Healthcare', 'Finance', 'E-commerce', 'Technology', 'Education',
          'Marketing', 'Social Media', 'IoT', 'Transportation', 'Entertainment',
          'Sports', 'Government', 'Other'
        ])
        .withMessage('Please select a valid category'),
      
      body('price')
        .optional()
        .isFloat({ min: 0, max: 1000 })
        .withMessage('Price must be between 0 and 1000 ETH'),
      
      body('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 tags allowed'),
      
      body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value')
    ];
  }

  /**
   * Transaction creation validation
   */
  static validateTransactionCreation(): ValidationChain[] {
    return [
      body('datasetId')
        .trim()
        .isMongoId()
        .withMessage('Please provide a valid dataset ID'),
      
      body('amount')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),
      
      body('currency')
        .optional()
        .isIn(['ETH', 'USD'])
        .withMessage('Currency must be either ETH or USD'),
      
      body('blockchainTxHash')
        .optional()
        .custom((value) => {
          if (value && !CryptoUtils.isValidTransactionHash(value)) {
            throw new Error('Please provide a valid transaction hash');
          }
          return true;
        }),
      
      body('paymentMethod')
        .isIn(['metamask', 'wallet_connect', 'other'])
        .withMessage('Please select a valid payment method')
    ];
  }

  /**
   * MongoDB ObjectId validation
   */
  static validateObjectId(paramName: string = 'id'): ValidationChain[] {
    return [
      param(paramName)
        .isMongoId()
        .withMessage(`Please provide a valid ${paramName}`)
    ];
  }

  /**
   * Pagination validation
   */
  static validatePagination(): ValidationChain[] {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
      
      query('sort')
        .optional()
        .isIn(['createdAt', 'updatedAt', 'price', 'downloads', 'rating', 'views'])
        .withMessage('Invalid sort field'),
      
      query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Order must be either asc or desc')
    ];
  }

  /**
   * Search validation
   */
  static validateSearch(): ValidationChain[] {
    return [
      query('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search query cannot exceed 100 characters'),
      
      query('category')
        .optional()
        .isIn([
          'Healthcare', 'Finance', 'E-commerce', 'Technology', 'Education',
          'Marketing', 'Social Media', 'IoT', 'Transportation', 'Entertainment',
          'Sports', 'Government', 'Other'
        ])
        .withMessage('Please select a valid category'),
      
      query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a positive number'),
      
      query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a positive number')
    ];
  }
}