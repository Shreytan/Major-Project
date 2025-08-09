import { Document, Types } from 'mongoose';

export interface IDataset {
  title: string;
  description: string;
  category: string;
  price: number; // Price in ETH
  currency: 'ETH' | 'USD';
  tags: string[];
  fileSize: number; // Size in bytes
  fileName: string;
  filePath: string;
  fileType: string;
  isActive: boolean;
  seller: Types.ObjectId;
  // Analytics
  downloads: number;
  views: number;
  rating: number;
  reviewCount: number;
  // Blockchain
  tokenId?: string;
  contractAddress?: string;
  transactionHash?: string;
}

export interface IDatasetDocument extends IDataset, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  // --- Add method signatures so TS recognizes them ---
  incrementViews(): Promise<IDatasetDocument>;
  incrementDownloads(): Promise<IDatasetDocument>;
}

export interface IDatasetInput {
  title: string;
  description: string;
  category: string;
  price: number;
  currency?: 'ETH' | 'USD';
  tags: string[];
}

export interface IDatasetUpdate {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  tags?: string[];
  isActive?: boolean;
}

export interface IDatasetFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  seller?: string;
  isActive?: boolean;
}

export interface IDatasetResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  tags: string[];
  downloads: number;
  views: number;
  rating: number;
  seller: {
    id: string;
    username: string;
    walletAddress: string;
  };
  createdAt: Date;
}
