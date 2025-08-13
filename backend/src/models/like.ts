import { Schema, model, Document, Types } from 'mongoose';

export interface ILike extends Document {
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// ensure one like per user per post
likeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = model<ILike>('Like', likeSchema);
