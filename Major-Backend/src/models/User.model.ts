import { Schema, model } from 'mongoose';
import { IUser, IUserDocument } from '@/types/user.types';

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    walletAddress: {
      type: String,
      required: [true, 'Wallet address is required'],
      unique: true,
      match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address']
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true
    },
    avatar: {
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    totalSales: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPurchases: {
      type: Number,
      default: 0,
      min: 0
    },
    totalEarnings: {
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
    },
    toObject: {
      transform: function(doc, ret: any) {
        ret.id = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      }
    }
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ walletAddress: 1 });
UserSchema.index({ createdAt: -1 });

// Instance methods
UserSchema.methods.toSafeObject = function(this: IUserDocument) {
  const userObject = this.toObject();
  return {
    id: userObject.id,
    email: userObject.email,
    username: userObject.username,
    walletAddress: userObject.walletAddress,
    bio: userObject.bio,
    avatar: userObject.avatar,
    isVerified: userObject.isVerified,
    role: userObject.role,
    totalSales: userObject.totalSales,
    totalPurchases: userObject.totalPurchases,
    totalEarnings: userObject.totalEarnings,
    joinedAt: userObject.joinedAt,
    lastLoginAt: userObject.lastLoginAt,
    createdAt: userObject.createdAt,
    updatedAt: userObject.updatedAt
  };
};

export const User = model<IUserDocument>('User', UserSchema);
export default User;
