import { Schema, model, Document, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  revoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, index: true },
  revoked: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
