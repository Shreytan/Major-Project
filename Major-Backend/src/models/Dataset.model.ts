import { Schema, model } from 'mongoose';
import { IDatasetDocument } from '@/types/dataset.types';

const DatasetSchema = new Schema<IDatasetDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Healthcare', 'Finance', 'E-commerce', 'Technology', 'Education',
        'Marketing', 'Social Media', 'IoT', 'Transportation',
        'Entertainment', 'Sports', 'Government', 'Other'
      ]
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
      max: [1000, 'Price cannot exceed 1000 ETH']
    },
    currency: {
      type: String,
      enum: ['ETH', 'USD'],
      default: 'ETH'
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be positive']
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true
    },
    filePath: {
      type: String,
      required: [true, 'File path is required']
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: ['csv', 'json', 'xlsx', 'pdf', 'zip', 'sql', 'xml', 'other']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required']
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    tokenId: {
      type: String,
      default: null
    },
    contractAddress: {
      type: String,
      default: null,
      match: [/^(0x)?[0-9a-fA-F]{40}$/, 'Invalid contract address']
    },
    transactionHash: {
      type: String,
      default: null,
      match: [/^(0x)?[0-9a-fA-F]{64}$/, 'Invalid transaction hash']
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// --- Bulletproof tags normalization ---
DatasetSchema.pre('validate', function (next) {
  let rawTags: any = (this as any).tags;

  if (typeof rawTags === 'string') {
    const clean = rawTags.trim();
    if (clean.startsWith('[')) {
      try {
        rawTags = JSON.parse(clean);
      } catch {
        rawTags = clean.split(',').map((t: string) => t.trim());
      }
    } else {
      rawTags = clean.split(',').map((t: string) => t.trim());
    }
  } else if (Array.isArray(rawTags)) {
    rawTags = rawTags.map((t: string) => typeof t === 'string' ? t.trim() : String(t));
  } else {
    rawTags = [];
  }

  rawTags = [...new Set(rawTags.filter(Boolean))];
  (this as any).tags = rawTags;
  next();
});

// --- Indexes ---
DatasetSchema.index({ seller: 1 });
DatasetSchema.index({ category: 1 });
DatasetSchema.index({ isActive: 1 });
DatasetSchema.index({ price: 1 });
DatasetSchema.index({ createdAt: -1 });
DatasetSchema.index({ downloads: -1 });
DatasetSchema.index({ rating: -1 });
DatasetSchema.index({ title: 'text', description: 'text', tags: 'text' });

// --- Instance methods ---
DatasetSchema.methods.incrementViews = function (this: IDatasetDocument) {
  this.views += 1;
  return this.save();
};

DatasetSchema.methods.incrementDownloads = function (this: IDatasetDocument) {
  this.downloads += 1;
  return this.save();
};

export const Dataset = model<IDatasetDocument>('Dataset', DatasetSchema);
export default Dataset;
