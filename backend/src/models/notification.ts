import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType = 'like' | 'comment' | 'follow' | 'system';

export interface INotification extends Document {
  user: Types.ObjectId; // receiver
  type: NotificationType;
  data: any; // { actorId, postId, commentId, ... }
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true },
  data: { type: Schema.Types.Mixed, default: {} },
  read: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = model<INotification>('Notification', notificationSchema);
