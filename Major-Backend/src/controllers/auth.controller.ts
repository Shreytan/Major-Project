import { Request, Response } from 'express';
import { User } from '@/models/User.model';
import { JWTUtils } from '@/utils/jwt.utils';
import { ResponseUtils } from '@/utils/response.utils';
import { IUserInput, IAuthResponse } from '@/types/user.types';
import { asyncHandler } from '@/middleware/error.middleware';

export class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, username, walletAddress, bio }: IUserInput = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username },
        { walletAddress }
      ]
    });

    if (existingUser) {
      let field = 'User';
      if (existingUser.email === email) field = 'Email';
      else if (existingUser.username === username) field = 'Username';
      else if (existingUser.walletAddress === walletAddress) field = 'Wallet address';
      
      ResponseUtils.error(res, `${field} already exists`, 400);
      return;
    }

    // Create new user
    const userData = {
      email,
      username,
      walletAddress,
      bio: bio || undefined,
      joinedAt: new Date(),
      isVerified: true // For now, auto-verify. In production, you'd send verification email
    };

    const user = await User.create(userData);
    
    // Generate JWT token
    const token = JWTUtils.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress
    });

    // Prepare response
    const authResponse: IAuthResponse = {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        walletAddress: user.walletAddress,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    };

    ResponseUtils.created(res, authResponse, 'User registered successfully');
  });

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { identifier, walletAddress } = req.body;

    // Build query to find user by email, username, or wallet address
    let query: any = {};
    
    if (walletAddress) {
      query.walletAddress = walletAddress;
    } else if (identifier) {
      // Check if identifier is email or username
      const isEmail = identifier.includes('@');
      if (isEmail) {
        query.email = identifier.toLowerCase();
      } else {
        query.username = identifier;
      }
    } else {
      ResponseUtils.error(res, 'Please provide email, username, or wallet address', 400);
      return;
    }

    // Find user
    const user = await User.findOne(query);
    
    if (!user) {
      ResponseUtils.unauthorized(res, 'Invalid credentials');
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT token
    const token = JWTUtils.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress
    });

    // Prepare response
    const authResponse: IAuthResponse = {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        walletAddress: user.walletAddress,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    };

    ResponseUtils.success(res, authResponse, 'Login successful');
  });

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  static getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    const userProfile = req.user.toSafeObject();
    ResponseUtils.success(res, userProfile, 'Profile retrieved successfully');
  });

  /**
   * Refresh JWT token
   * POST /api/v1/auth/refresh
   */
  static refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    // Generate new JWT token
    const token = JWTUtils.generateToken({
      userId: req.user._id.toString(),
      email: req.user.email,
      role: req.user.role,
      walletAddress: req.user.walletAddress
    });

    ResponseUtils.success(res, { token }, 'Token refreshed successfully');
  });

  /**
   * Logout user (client-side token removal)
   * POST /api/v1/auth/logout
   */
  static logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Since JWT is stateless, logout is handled client-side
    // You could implement a token blacklist here if needed
    ResponseUtils.success(res, null, 'Logout successful');
  });
}
