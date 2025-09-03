import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  owner: mongoose.Types.ObjectId;
  assetType: string;
  description: string;
  estimatedValue: number;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected' | 'tokenized';
  tokenId?: string;
  tokenSymbol?: string;
  tokenSupply?: number;
  tokenPrice?: number;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assetType: {
    type: String,
    required: true,
    enum: ['real_estate', 'commodities', 'art', 'precious_metals', 'bonds', 'other']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  estimatedValue: {
    type: Number,
    required: true,
    min: 0
  },
  documents: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'tokenized'],
    default: 'pending'
  },
  tokenId: {
    type: String,
    unique: true,
    sparse: true
  },
  tokenSymbol: {
    type: String,
    uppercase: true
  },
  tokenSupply: {
    type: Number,
    min: 1
  },
  tokenPrice: {
    type: Number,
    min: 0
  },
  isListed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
AssetSchema.index({ owner: 1, status: 1 });
AssetSchema.index({ tokenId: 1 });
AssetSchema.index({ isListed: 1, status: 1 });

export const Asset = mongoose.model<IAsset>('Asset', AssetSchema);