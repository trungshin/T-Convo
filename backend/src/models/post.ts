import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  author: Types.ObjectId;
  content: string;
  media: string; // URLs
  cloudinaryId: string; // Cloudinary public IDs
  likesCount: number;
  commentsCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, required: true, maxlength: 500 },
  media: { type: String, default: null },
  cloudinaryId: { type: String, default: null },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

postSchema.index({ createdAt: -1 });

export const Post = model<IPost>('Post', postSchema);
