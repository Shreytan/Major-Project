import { Document, Types } from 'mongoose';

export interface IUser {
  email: string;
  username: string;
  walletAddress: string;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  joinedAt: Date;
  lastLoginAt?: Date;
  // Statistics
  totalSales: number;
  totalPurchases: number;
  totalEarnings: number;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  toSafeObject(): ISafeUser;
}

export interface ISafeUser {
  id: string;
  email: string;
  username: string;
  walletAddress: string;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  role: string;
  totalSales: number;
  totalPurchases: number;
  totalEarnings: number;
  joinedAt: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInput {
  email: string;
  username: string;
  walletAddress: string;
  bio?: string;
}

export interface IUserUpdate {
  email?: string;
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    walletAddress: string;
    role: string;
    isVerified: boolean;
  };
  token: string;
}
