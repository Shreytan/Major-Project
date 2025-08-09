import { Document, Types } from 'mongoose';

export interface ITransaction {
  buyer: Types.ObjectId;
  seller: Types.ObjectId;
  dataset: Types.ObjectId;
  amount: number; // Amount in ETH
  currency: 'ETH' | 'USD';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'purchase' | 'sale';
  // Blockchain details
  blockchainTxHash?: string;
  blockNumber?: number;
  gasUsed?: number;
  gasFee?: number;
  // Payment details
  paymentMethod: 'metamask' | 'wallet_connect' | 'other';
  processingFee?: number;
}

export interface ITransactionDocument extends ITransaction, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionInput {
  datasetId: string;
  amount: number;
  currency?: 'ETH' | 'USD';
  blockchainTxHash?: string;
  paymentMethod: 'metamask' | 'wallet_connect' | 'other';
}

export interface ITransactionFilter {
  userId?: string;
  status?: string;
  type?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface ITransactionResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  dataset: {
    id: string;
    title: string;
  };
  counterparty: {
    id: string;
    username: string;
    walletAddress: string;
  };
  blockchainTxHash?: string;
  createdAt: Date;
}
