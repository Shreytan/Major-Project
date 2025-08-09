import { Schema, model } from 'mongoose';
import { ITransaction, ITransactionDocument } from '@/types/transaction.types';

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer is required']
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required']
    },
    dataset: {
      type: Schema.Types.ObjectId,
      ref: 'Dataset',
      required: [true, 'Dataset is required']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be non-negative']
    },
    currency: {
      type: String,
      enum: ['ETH', 'USD'],
      default: 'ETH'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    type: {
      type: String,
      enum: ['purchase', 'sale'],
      required: [true, 'Transaction type is required']
    },
    blockchainTxHash: {
      type: String,
      default: null,
      match: [/^(0x)?[0-9a-fA-F]{64}$/, 'Invalid transaction hash']
    },
    blockNumber: {
      type: Number,
      default: null,
      min: 0
    },
    gasUsed: {
      type: Number,
      default: null,
      min: 0
    },
    gasFee: {
      type: Number,
      default: null,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['metamask', 'wallet_connect', 'other'],
      default: 'metamask'
    },
    processingFee: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret: any) {
        ret.id = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      }
    }
  }
);

// Indexes
TransactionSchema.index({ buyer: 1 });
TransactionSchema.index({ seller: 1 });
TransactionSchema.index({ dataset: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ blockchainTxHash: 1 });

// Compound indexes
TransactionSchema.index({ buyer: 1, status: 1 });
TransactionSchema.index({ seller: 1, status: 1 });
TransactionSchema.index({ buyer: 1, createdAt: -1 });
TransactionSchema.index({ seller: 1, createdAt: -1 });

export const Transaction = model<ITransactionDocument>('Transaction', TransactionSchema);
export default Transaction;
