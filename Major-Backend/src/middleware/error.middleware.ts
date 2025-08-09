import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '@/utils/response.utils';

export interface CustomError extends Error {
  statusCode?: number;
  errors?: string[];
}

export class ErrorMiddleware {
  /**
   * Global error handler
   */
  static errorHandler(
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let errors = error.errors || [];

    // Handle specific error types
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
      errors = Object.values(error).map((val: any) => val.message);
    }

    if (error.name === 'MongoError' && (error as any).code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value';
      const field = Object.keys((error as any).keyValue)[0];
      errors = [`${field} already exists`];
    }

    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }

    if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }

    if (error.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
    }

    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        statusCode,
        path: req.path,
        method: req.method
      });
    }

    // Send error response
    ResponseUtils.error(res, message, statusCode, errors);
  }

  /**
   * 404 Not Found handler
   */
  static notFoundHandler(req: Request, res: Response, next: NextFunction): void {
    ResponseUtils.notFound(res, `Route ${req.method} ${req.path} not found`);
  }

  /**
   * Async error handler wrapper
   */
  static asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) {
    return (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

export const { errorHandler, notFoundHandler, asyncHandler } = ErrorMiddleware;
