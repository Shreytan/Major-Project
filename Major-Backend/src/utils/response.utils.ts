import { Response } from 'express';
import { IApiResponse, IPaginationResponse } from '@/types/api.types';

export class ResponseUtils {
  /**
   * Send success response
   */
  static success<T>(
    res: Response, 
    data: T, 
    message: string = 'Success', 
    statusCode: number = 200
  ): Response {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response, 
    message: string = 'Internal Server Error', 
    statusCode: number = 500, 
    errors?: string[]
  ): Response {
    const response: IApiResponse = {
      success: false,
      message,
      errors
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   */
  static validationError(
    res: Response, 
    errors: string[], 
    message: string = 'Validation failed'
  ): Response {
    return this.error(res, message, 400, errors);
  }

  /**
   * Send not found response
   */
  static notFound(
    res: Response, 
    message: string = 'Resource not found'
  ): Response {
    return this.error(res, message, 404);
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(
    res: Response, 
    message: string = 'Unauthorized access'
  ): Response {
    return this.error(res, message, 401);
  }

  /**
   * Send forbidden response
   */
  static forbidden(
    res: Response, 
    message: string = 'Access forbidden'
  ): Response {
    return this.error(res, message, 403);
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response, 
    data: T[], 
    current: number, 
    total: number, 
    limit: number, 
    message: string = 'Success'
  ): Response {
    const pages = Math.ceil(total / limit);
    
    const paginationResponse: IPaginationResponse<T> = {
      data,
      pagination: {
        current,
        total,
        pages,
        limit,
        hasNext: current < pages,
        hasPrev: current > 1
      }
    };

    const response: IApiResponse<IPaginationResponse<T>> = {
      success: true,
      message,
      data: paginationResponse
    };

    return res.status(200).json(response);
  }

  /**
   * Send created response
   */
  static created<T>(
    res: Response, 
    data: T, 
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  /**
   * Send no content response
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
