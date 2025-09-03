import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  kycStatus: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    passwordHash: { 
      type: String, 
      required: true,
      minlength: 6
    },
    kycStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { 
    timestamps: true
  }
);

// Add indexes for better query performance
// Note: email already has unique: true, so we don't need a separate index
UserSchema.index({ kycStatus: 1 });

export default mongoose.model<IUser>("User", UserSchema);