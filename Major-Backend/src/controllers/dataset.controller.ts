import { Request, Response } from 'express';
import { Dataset } from '@/models/Dataset.model';
import { ResponseUtils } from '@/utils/response.utils';
import { IDatasetInput, IDatasetUpdate } from '@/types/dataset.types';
import { asyncHandler } from '@/middleware/error.middleware';
import fs from 'fs/promises';
import path from 'path';


export class DatasetController {
  /**
   * Create new dataset
   * POST /api/v1/datasets
   */
  static createDataset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }


    const file = req.file;
    if (!file) {
      ResponseUtils.error(res, 'Please upload a dataset file', 400);
      return;
    }


    // Destructure with explicit type
const { title, description, category, price, currency, tags }: 
  { title: string; description?: string; category?: string; price: number | string; currency?: string; tags?: string | string[] } = req.body;


let parsedTags: string[] = [];


if (typeof tags === 'string') {
  const cleanTags = tags.trim();
  if (cleanTags.startsWith('[')) {
    // JSON array format
    try {
      parsedTags = JSON.parse(cleanTags);
    } catch {
      parsedTags = cleanTags.split(',').map((tag: string) => tag.trim());
    }
  } else {
    // comma-separated
    parsedTags = cleanTags.split(',').map((tag: string) => tag.trim());
  }
} else if (Array.isArray(tags)) {
  parsedTags = tags.map((tag: string) => tag.trim());
}



    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileTypeMap: Record<string, string> = {
      '.csv': 'csv',
      '.json': 'json',
      '.xlsx': 'xlsx',
      '.pdf': 'pdf',
      '.zip': 'zip',
      '.sql': 'sql',
      '.xml': 'xml'
    };


    const fileType = fileTypeMap[fileExtension] || 'other';


    const datasetData = {
      title,
      description,
      category,
      price: parseFloat(price.toString()),
      currency: currency || 'ETH',
      tags: parsedTags,
      fileSize: file.size,
      fileName: file.originalname,
      filePath: file.path,
      fileType,
      seller: req.user._id,
      isActive: true
    };


    const dataset = await Dataset.create(datasetData);
    await dataset.populate('seller', 'username walletAddress');


    ResponseUtils.created(res, dataset, 'Dataset created successfully');
  });


  /**
   * Get all datasets with filtering and pagination
   * GET /api/v1/datasets
   */
  static getAllDatasets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || 'createdAt';
    const order = (req.query.order as string) || 'desc';


    const filter: any = { isActive: true };


    if (req.query.category) filter.category = req.query.category;


    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice as string);
    }


    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }


    if (req.query.seller) filter.seller = req.query.seller;


    const skip = (page - 1) * limit;
    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'desc' ? -1 : 1 };


    const [datasets, total] = await Promise.all([
      Dataset.find(filter)
        .populate('seller', 'username walletAddress')
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      Dataset.countDocuments(filter)
    ]);


    ResponseUtils.paginated(res, datasets, page, total, limit, 'Datasets retrieved successfully');
  });


  /**
   * Get dataset by ID
   * GET /api/v1/datasets/:id
   */
  static getDatasetById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;


    const dataset = await Dataset.findById(id).populate('seller', 'username walletAddress');
    if (!dataset) {
      ResponseUtils.notFound(res, 'Dataset not found');
      return;
    }


    // Increment views (but not for the owner)
    if (!req.user || req.user._id.toString() !== dataset.seller._id.toString()) {
      dataset.views = (dataset.views || 0) + 1;
      await dataset.save();
    }


    ResponseUtils.success(res, dataset, 'Dataset retrieved successfully');
  });


  /**
   * Update dataset
   * PUT /api/v1/datasets/:id
   */
  static updateDataset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }


    const { id } = req.params;
    const updates: IDatasetUpdate = req.body;


    const dataset = await Dataset.findById(id);
    if (!dataset) {
      ResponseUtils.notFound(res, 'Dataset not found');
      return;
    }


    if (dataset.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      ResponseUtils.forbidden(res, 'You can only update your own datasets');
      return;
    }


    const allowedUpdates = ['title', 'description', 'category', 'price', 'tags', 'isActive'];
    const actualUpdates = Object.keys(updates).filter(key => allowedUpdates.includes(key));


    if (actualUpdates.length === 0) {
      ResponseUtils.error(res, 'No valid updates provided', 400);
      return;
    }


    actualUpdates.forEach(key => {
      (dataset as any)[key] = updates[key as keyof IDatasetUpdate];
    });


    await dataset.save();
    await dataset.populate('seller', 'username walletAddress');


    ResponseUtils.success(res, dataset, 'Dataset updated successfully');
  });


  /**
   * Delete dataset
   * DELETE /api/v1/datasets/:id
   */
  static deleteDataset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in');
      return;
    }


    const { id } = req.params;
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      ResponseUtils.notFound(res, 'Dataset not found');
      return;
    }


    if (dataset.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      ResponseUtils.forbidden(res, 'You can only delete your own datasets');
      return;
    }


    try {
      await fs.unlink(dataset.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }


    await Dataset.findByIdAndDelete(id);


    ResponseUtils.success(res, null, 'Dataset deleted successfully');
  });


  /**
   * Download dataset file
   * GET /api/v1/datasets/:id/download
   */
  static downloadDataset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Please log in to download datasets');
      return;
    }


    const { id } = req.params;
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      ResponseUtils.notFound(res, 'Dataset not found');
      return;
    }


    if (!dataset.isActive) {
      ResponseUtils.error(res, 'Dataset is not available for download', 400);
      return;
    }


    try {
      // Increment downloads
      dataset.downloads = (dataset.downloads || 0) + 1;
      await dataset.save();


      res.download(dataset.filePath, dataset.fileName, (error) => {
        if (error) {
          console.error('Download error:', error);
          ResponseUtils.error(res, 'Error downloading file', 500);
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      ResponseUtils.error(res, 'File not found or corrupted', 404);
    }
  });


  /**
   * Get user's datasets
   * GET /api/v1/datasets/my-datasets
   */
  static getUserDatasets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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


    const [datasets, total] = await Promise.all([
      Dataset.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      Dataset.countDocuments(filter)
    ]);


    ResponseUtils.paginated(res, datasets, page, total, limit, 'Your datasets retrieved successfully');
  });


  /**
   * Get dataset categories
   * GET /api/v1/datasets/categories
   */
  static getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categories = [
      'Healthcare', 'Finance', 'E-commerce', 'Technology', 'Education', 'Marketing',
      'Social Media', 'IoT', 'Transportation', 'Entertainment', 'Sports', 'Government', 'Other'
    ];


    const categoryCounts = await Dataset.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);


    const categoriesWithCounts = categories.map(category => {
      const found = categoryCounts.find(c => c._id === category);
      return { name: category, count: found ? found.count : 0 };
    });


    ResponseUtils.success(res, categoriesWithCounts, 'Categories retrieved successfully');
  });
}