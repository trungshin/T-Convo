import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  followersCount: number;
  followingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String },
  bio: { type: String },
  avatarUrl: { type: String },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

export const User = model<IUser>('User', userSchema);
