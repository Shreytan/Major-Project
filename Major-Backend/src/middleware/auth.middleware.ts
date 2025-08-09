import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '@/utils/jwt.utils';
import { ResponseUtils } from '@/utils/response.utils';
import { User } from '@/models/User.model';
import { IUserDocument } from '@/types/user.types';
import { IJWTPayload } from '@/types/api.types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      userId?: string;
    }
  }
}

export class AuthMiddleware {
  /**
   * Verify JWT token and authenticate user
   */
  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get token from header
      const authHeader = req.header('Authorization');
      
      if (!authHeader) {
        ResponseUtils.unauthorized(res, 'Access token is required');
        return;
      }

      // Check Bearer token format
      if (!authHeader.startsWith('Bearer ')) {
        ResponseUtils.unauthorized(res, 'Invalid token format. Use: Bearer <token>');
        return;
      }

      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        ResponseUtils.unauthorized(res, 'Access token is required');
        return;
      }

      // Verify token
      let payload: IJWTPayload;
      try {
        payload = JWTUtils.verifyToken(token);
      } catch (error) {
        ResponseUtils.unauthorized(res, 'Invalid or expired token');
        return;
      }

      // Find user in database
      const user = await User.findById(payload.userId);
      
      if (!user) {
        ResponseUtils.unauthorized(res, 'User not found');
        return;
      }

      // Check if user account is active (not banned, etc.)
      if (!user.isVerified && req.path !== '/verify-email') {
        ResponseUtils.forbidden(res, 'Please verify your email address');
        return;
      }

      // Attach user to request
      req.user = user;
      req.userId = user._id.toString();

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      ResponseUtils.error(res, 'Authentication failed');
    }
  }

  /**
   * Optional authentication - doesn't fail if no token provided
   */
  static async optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
      }

      const token = authHeader.replace('Bearer ', '');
      
      if (!token) {
        next();
        return;
      }

      try {
        const payload = JWTUtils.verifyToken(token);
        const user = await User.findById(payload.userId);
        
        if (user) {
          req.user = user;
          req.userId = user._id.toString();
        }
      } catch (error) {
        // Token invalid, but continue without user
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log('Optional auth failed:', errorMessage);
      }

      next();
    } catch (error) {
      console.error('Optional authentication error:', error);
      next();
    }
  }

  /**
   * Check if user has required role
   */
  static requireRole(roles: string | string[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          ResponseUtils.unauthorized(res, 'Authentication required');
          return;
        }

        const userRoles = Array.isArray(roles) ? roles : [roles];
        
        if (!userRoles.includes(req.user.role)) {
          ResponseUtils.forbidden(res, 'Insufficient permissions');
          return;
        }

        next();
      } catch (error) {
        console.error('Role check error:', error);
        ResponseUtils.error(res, 'Authorization check failed');
      }
    };
  }

  /**
   * Check if user is admin
   */
  static requireAdmin = AuthMiddleware.requireRole('admin');

  /**
   * Check if user owns resource or is admin
   */
  static requireOwnershipOrAdmin(getResourceUserId: (req: Request) => string | Promise<string>) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          ResponseUtils.unauthorized(res, 'Authentication required');
          return;
        }

        // Admin can access anything
        if (req.user.role === 'admin') {
          next();
          return;
        }

        // Get resource owner ID
        const resourceUserId = await getResourceUserId(req);
        
        if (req.user._id.toString() !== resourceUserId) {
          ResponseUtils.forbidden(res, 'You can only access your own resources');
          return;
        }

        next();
      } catch (error) {
        console.error('Ownership check error:', error);
        ResponseUtils.error(res, 'Ownership check failed');
      }
    };
  }
}
