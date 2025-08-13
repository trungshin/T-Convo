import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  post: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 500 }
}, { timestamps: true });

export const Comment = model<IComment>('Comment', commentSchema);
