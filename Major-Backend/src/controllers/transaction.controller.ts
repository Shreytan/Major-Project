import { Request, Response } from 'express';
import { Transaction } from '@/models/Transaction.model';
import { Dataset } from '@/models/Dataset.model';
import { User } from '@/models/User.model';
import { ResponseUtils } from '@/utils/response.utils';
import { CryptoUtils } from '@/utils/crypto.utils';
import { ITransactionInput, ITransactionFilter } from '@/types/transaction.types';
import { asyncHandler } from '@/middleware/error.middleware';

export class TransactionController {
  /**
   * Create new transaction (purchase dataset)
   * POST /api/v1/transactions
   */
  static createTransaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    const { datasetId, amount, currency, blockchainTxHash, paymentMethod }: ITransactionInput = req.body;

    // Find the dataset
    const dataset = await Dataset.findById(datasetId).populate('seller', 'username walletAddress');
    
    if (!dataset) {
      ResponseUtils.notFound(res, 'Dataset not found');
      return;
    }

    if (!dataset.isActive) {
      ResponseUtils.error(res, 'Dataset is not available for purchase', 400);
      return;
    }

    // Check if user is trying to buy their own dataset
    if (dataset.seller._id.toString() === req.user._id.toString()) {
      ResponseUtils.error(res, 'You cannot purchase your own dataset', 400);
      return;
    }

    // Verify the amount matches dataset price
    if (amount !== dataset.price) {
      ResponseUtils.error(res, `Amount must match dataset price: ${dataset.price} ${dataset.currency}`, 400);
      return;
    }

    // Check if user already purchased this dataset
    const existingTransaction = await Transaction.findOne({
      buyer: req.user._id,
      dataset: datasetId,
      status: 'completed'
    });

    if (existingTransaction) {
      ResponseUtils.error(res, 'You have already purchased this dataset', 400);
      return;
    }

    // Calculate processing fee (2% of transaction amount)
    const processingFee = amount * 0.02;

    // Create transaction record
    const transactionData = {
      buyer: req.user._id,
      seller: dataset.seller._id,
      dataset: datasetId,
      amount,
      currency: currency || dataset.currency,
      status: blockchainTxHash ? 'completed' : 'pending',
      type: 'purchase',
      blockchainTxHash: blockchainTxHash || null,
      paymentMethod: paymentMethod || 'metamask',
      processingFee
    };

    const transaction = await Transaction.create(transactionData);
    
    // Populate transaction with related data
    await transaction.populate([
      { path: 'buyer', select: 'username walletAddress email' },
      { path: 'seller', select: 'username walletAddress email' },
      { path: 'dataset', select: 'title description price currency fileSize' }
    ]);

    // If transaction is completed, update user statistics
    if (transaction.status === 'completed') {
      // Update buyer stats
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalPurchases: 1 }
      });

      // Update seller stats
      await User.findByIdAndUpdate(dataset.seller._id, {
        $inc: { 
          totalSales: 1, 
          totalEarnings: amount - processingFee 
        }
      });

      // Increment dataset downloads
      await dataset.incrementDownloads();
    }

    ResponseUtils.created(res, transaction, 'Transaction created successfully');
  });

  /**
   * Get all transactions with filtering
   * GET /api/v1/transactions
   */
  static getAllTransactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || 'createdAt';
    const order = (req.query.order as string) || 'desc';

    // Build filter - user can only see their own transactions
    const filter: any = {
      $or: [
        { buyer: req.user._id },
        { seller: req.user._id }
      ]
    };

    // Additional filters
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.minAmount || req.query.maxAmount) {
      filter.amount = {};
      if (req.query.minAmount) filter.amount.$gte = parseFloat(req.query.minAmount as string);
      if (req.query.maxAmount) filter.amount.$lte = parseFloat(req.query.maxAmount as string);
    }

    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate as string);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate as string);
    }

    const skip = (page - 1) * limit;
    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'desc' ? -1 : 1 };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('buyer', 'username walletAddress')
        .populate('seller', 'username walletAddress')
        .populate('dataset', 'title description price currency')
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter)
    ]);

    ResponseUtils.paginated(res, transactions, page, total, limit, 'Transactions retrieved successfully');
  });

  /**
   * Get transaction by ID
   * GET /api/v1/transactions/:id
   */
  static getTransactionById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .populate('buyer', 'username walletAddress email')
      .populate('seller', 'username walletAddress email')
      .populate('dataset', 'title description price currency fileSize fileName');

    if (!transaction) {
      ResponseUtils.notFound(res, 'Transaction not found');
      return;
    }

    // Check if user is involved in this transaction
    const isUserInvolved = 
      transaction.buyer._id.toString() === req.user._id.toString() ||
      transaction.seller._id.toString() === req.user._id.toString();

    if (!isUserInvolved && req.user.role !== 'admin') {
      ResponseUtils.forbidden(res, 'You can only view your own transactions');
      return;
    }

    ResponseUtils.success(res, transaction, 'Transaction retrieved successfully');
  });

  /**
   * Update transaction status
   * PUT /api/v1/transactions/:id/status
   */
  static updateTransactionStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    const { id } = req.params;
    const { status, blockchainTxHash, blockNumber, gasUsed, gasFee } = req.body;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      ResponseUtils.notFound(res, 'Transaction not found');
      return;
    }

    // Check if user is the buyer (only buyer can update transaction status)
    if (transaction.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      ResponseUtils.forbidden(res, 'Only the buyer can update transaction status');
      return;
    }

    const allowedStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!allowedStatuses.includes(status)) {
      ResponseUtils.error(res, 'Invalid transaction status', 400);
      return;
    }

    // Update transaction
    transaction.status = status;
    if (blockchainTxHash) transaction.blockchainTxHash = blockchainTxHash;
    if (blockNumber) transaction.blockNumber = blockNumber;
    if (gasUsed) transaction.gasUsed = gasUsed;
    if (gasFee) transaction.gasFee = gasFee;

    await transaction.save();

    // If status changed to completed, update user statistics
    if (status === 'completed' && transaction.status !== 'completed') {
      // Update buyer stats
      await User.findByIdAndUpdate(transaction.buyer, {
        $inc: { totalPurchases: 1 }
      });

      // Update seller stats
      await User.findByIdAndUpdate(transaction.seller, {
        $inc: { 
          totalSales: 1, 
          totalEarnings: transaction.amount - (transaction.processingFee || 0)
        }
      });

      // Increment dataset downloads
      const dataset = await Dataset.findById(transaction.dataset);
      if (dataset) {
        await dataset.incrementDownloads();
      }
    }

    await transaction.populate([
      { path: 'buyer', select: 'username walletAddress' },
      { path: 'seller', select: 'username walletAddress' },
      { path: 'dataset', select: 'title price currency' }
    ]);

    ResponseUtils.success(res, transaction, 'Transaction status updated successfully');
  });

  /**
   * Get user's purchase history
   * GET /api/v1/transactions/purchases
   */
  static getUserPurchases = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || 'createdAt';
    const order = (req.query.order as string) || 'desc';

    const skip = (page - 1) * limit;
    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'desc' ? -1 : 1 };

    const filter = { buyer: req.user._id };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('seller', 'username walletAddress')
        .populate('dataset', 'title description price currency fileName fileType')
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter)
    ]);

    ResponseUtils.paginated(res, transactions, page, total, limit, 'Purchase history retrieved successfully');
  });

  /**
   * Get user's sales history
   * GET /api/v1/transactions/sales
   */
  static getUserSales = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || 'createdAt';
    const order = (req.query.order as string) || 'desc';

    const skip = (page - 1) * limit;
    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'desc' ? -1 : 1 };

    const filter = { seller: req.user._id };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('buyer', 'username walletAddress')
        .populate('dataset', 'title description price currency fileName fileType')
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter)
    ]);

    ResponseUtils.paginated(res, transactions, page, total, limit, 'Sales history retrieved successfully');
  });

  /**
   * Get transaction analytics
   * GET /api/v1/transactions/analytics
   */
  static getTransactionAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || req.user.role !== 'admin') {
      ResponseUtils.forbidden(res, 'Admin access required');
      return;
    }

    const analytics = await Transaction.aggregate([
      {
        $facet: {
          statusBreakdown: [
            { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
          ],
          dailyTransactions: [
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
                totalAmount: { $sum: '$amount' }
              }
            },
            { $sort: { '_id': -1 } },
            { $limit: 30 }
          ],
          topBuyers: [
            { $group: { _id: '$buyer', totalSpent: { $sum: '$amount' }, transactionCount: { $sum: 1 } } },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { username: '$user.username', totalSpent: 1, transactionCount: 1 } }
          ],
          topSellers: [
            { $group: { _id: '$seller', totalEarned: { $sum: '$amount' }, transactionCount: { $sum: 1 } } },
            { $sort: { totalEarned: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { username: '$user.username', totalEarned: 1, transactionCount: 1 } }
          ]
        }
      }
    ]);

    ResponseUtils.success(res, analytics[0], 'Transaction analytics retrieved successfully');
  });
}
