import { Request, Response } from 'express';
import { User } from '@/models/User.model';
import { Dataset } from '@/models/Dataset.model';
import { Transaction } from '@/models/Transaction.model';
import { ResponseUtils } from '@/utils/response.utils';
import { IUserUpdate } from '@/types/user.types';
import { asyncHandler } from '@/middleware/error.middleware';

export class UserController {
  /**
   * Get user profile by ID
   * GET /api/v1/users/:id
   */
  static getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await User.findById(id).select('-__v');

    if (!user) {
      ResponseUtils.notFound(res, 'User not found');
      return;
    }

    const userProfile = user.toObject();
    ResponseUtils.success(res, userProfile, 'User profile retrieved successfully');
  });

  /**
   * Update current user profile
   * PUT /api/v1/users/profile
   */
  static updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    const updates: IUserUpdate = req.body;
    const allowedUpdates = ['email', 'username', 'bio', 'avatar'];
    const actualUpdates = Object.keys(updates).filter(key => allowedUpdates.includes(key));

    if (actualUpdates.length === 0) {
      ResponseUtils.error(res, 'No valid updates provided', 400);
      return;
    }

    if (updates.email || updates.username) {
      const query: any = { _id: { $ne: req.user._id } };
      if (updates.email) query.email = updates.email;
      if (updates.username) query.username = updates.username;

      const existingUser = await User.findOne(query);
      if (existingUser) {
        const field = existingUser.email === updates.email ? 'Email' : 'Username';
        ResponseUtils.error(res, `${field} already exists`, 400);
        return;
      }
    }

    actualUpdates.forEach(key => {
      (req.user as any)[key] = updates[key as keyof IUserUpdate];
    });

    await req.user.save();

    const updatedProfile = req.user.toObject();
    ResponseUtils.success(res, updatedProfile, 'Profile updated successfully');
  });

  /**
   * Get user statistics
   * GET /api/v1/users/stats
   */
  static getUserStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    const userId = req.user._id;

    // dataset stats
    const datasetAgg = await Dataset.aggregate([
      { $match: { seller: userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalListings: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' },
          totalViews: { $sum: '$views' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    const datasetResult = datasetAgg[0] || {};

    // transaction stats
    const transactionAgg = await Transaction.aggregate([
      {
        $facet: {
          purchases: [
            { $match: { buyer: userId, status: 'completed' } },
            { $group: { _id: null, count: { $sum: 1 }, totalSpent: { $sum: '$amount' } } }
          ],
          sales: [
            { $match: { seller: userId, status: 'completed' } },
            { $group: { _id: null, count: { $sum: 1 }, totalEarned: { $sum: '$amount' } } }
          ]
        }
      }
    ]);
    const transactionResult = transactionAgg[0] || { purchases: [], sales: [] };

    const stats = {
      datasets: {
        totalListings: datasetResult.totalListings || 0,
        totalDownloads: datasetResult.totalDownloads || 0,
        totalViews: datasetResult.totalViews || 0,
        averageRating: Number((datasetResult.averageRating || 0).toFixed(2))
      },
      transactions: {
        totalPurchases: transactionResult.purchases.length > 0 ? transactionResult.purchases[0].count : 0,
        totalSales: transactionResult.sales.length > 0 ? transactionResult.sales[0].count : 0,
        totalSpent: transactionResult.purchases.length > 0 ? transactionResult.purchases[0].totalSpent : 0,
        totalEarned: transactionResult.sales.length > 0 ? transactionResult.sales[0].totalEarned : 0
      }
    };

    ResponseUtils.success(res, stats, 'User statistics retrieved successfully');
  });

  /**
   * Get all users (admin only)
   * GET /api/v1/users
   */
  static getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || 'createdAt';
    const order = (req.query.order as string) || 'desc';

    const skip = (page - 1) * limit;
    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'desc' ? -1 : 1 };

    const [users, total] = await Promise.all([
      User.find({})
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      User.countDocuments({})
    ]);

    const safeUsers = users.map(user => user.toObject());

    ResponseUtils.paginated(res, safeUsers, page, total, limit, 'Users retrieved successfully');
  });

  /**
   * Delete user account
   * DELETE /api/v1/users/account
   */
  static deleteAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    await User.findByIdAndDelete(req.user._id);
    ResponseUtils.success(res, null, 'Account deleted successfully');
  });
}
