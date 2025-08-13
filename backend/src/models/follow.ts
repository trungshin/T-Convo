import { Schema, model, Document, Types } from 'mongoose';

export interface IFollow extends Document {
  follower: Types.ObjectId;
  followee: Types.ObjectId;
  createdAt: Date;
}

const followSchema = new Schema<IFollow>({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  followee: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// one follow relation unique
followSchema.index({ follower: 1, followee: 1 }, { unique: true });

export const Follow = model<IFollow>('Follow', followSchema);
