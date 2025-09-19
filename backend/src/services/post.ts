// src/services/post.service.ts
import { IPost, Post } from '@models/post';
// import { Like } from '../models/like.model';
// import { Notification } from '../models/notification.model';
// import { emitToUser } from '../sockets';
import mongoose, { Types } from 'mongoose';
import { Follow } from '@models/follow';
import cloudinary from '@utils/cloudinary';

export type IUserMinimal = { _id: Types.ObjectId; username?: string; displayName?: string; avatarUrl?: string };

type CursorObj = { createdAt: string; _id: string };

export const createPost = async (
  authorId: string,
  content: string,
  mediaUrl: string | null,
) => {
  console.log("createPost service called with:", { authorId, content, mediaUrl });
  if (mediaUrl) {
    const uploadedMedia = await cloudinary.uploader.upload(mediaUrl, {
      upload_preset: 'tconvo_media',
    });
    console.log("uploadMedia", uploadedMedia);
     const postData = {
    author: authorId,
    content,
    media: uploadedMedia.secure_url,
    cloudinaryId: uploadedMedia.public_id,
  };

    const post = await Post.create(postData);

    return post;
  } else {
    const postData = {
    author: authorId,
    content,
    media: null,
    cloudinaryId: null,
  };

  const post = await Post.create(postData);

  return post;
  }
};

/**
 * Get the list of user IDs that the given user is following.
 */
export const getFollowingIds = async (userId: string): Promise<string[]> => {
  const following = await Follow.find({ follower: userId }).select('followee').lean();
  return following.map(({ followee }) => followee.toString());
};

/**
 * Get feed.
 * - if feed === 'home' and userId present -> only posts authored by users the given user follows.
 * - pagination: cursor is a stringified JSON: { createdAt, _id } representing the last item seen.
 * Returns { posts, nextCursor? } where nextCursor is stringified JSON for next page (or undefined).
 */
export const getFeed = async (
  // feed: 'home' | 'following',
  userId: Types.ObjectId | null,
  // cursor?: string,
  // limit = 20
): Promise<{ posts: (any)[] }> => {
  // const query: any = { isDeleted: false };
  // let following: string[] = [];

  // if (feed === 'home' && userId) {
  //   following = await getFollowingIds(userId);
  //   if (following.length === 0) {
  //     return { posts: [], nextCursor: undefined };
  //   }
  //   query.author = { $in: following.map(id => new Types.ObjectId(id)) }; // ensure ObjectId type for query execution in MongoDB atlas cluster 
  // }

  // if (cursor) {
  //   try {
  //     const parsed: CursorObj = JSON.parse(cursor);
  //     const createdAt = new Date(parsed.createdAt);
  //     const id = new Types.ObjectId(parsed._id);
  //     query.$or = [
  //       { createdAt: { $lt: createdAt } },
  //       { createdAt, _id: { $lt: id } }
  //     ];
  //   } catch (err) {
  //     console.warn('Malformed feed cursor, ignoring:', err);
  //   }
  // }

  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    // .limit(limit + 1)
    .populate('author', 'username displayName media avatarUrl')
    .lean();
  console.log('Fetched posts:', posts);
  // const hasMore = docs.length > limit;
  // const posts = hasMore ? docs.slice(0, limit) : docs;
  // const nextCursor = hasMore && posts.length > 0
  //   ? JSON.stringify({ createdAt: posts[posts.length - 1].createdAt, _id: posts[posts.length - 1]._id })
  //   : undefined;

  return { posts };
};

/**
 * Like a post (transactional)
 */
// export const likePost = async (postId: string, userId: string) => {
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const like = await Like.create([{ post: postId, user: userId }], { session });
//     await Post.updateOne({ _id: postId }, { $inc: { likesCount: 1 } }, { session });
//     const post = await Post.findById(postId);
//     if (post && post.author.toString() !== userId) {
//       await Notification.create([{ user: post.author, type: 'like', data: { actorId: userId, postId } }], { session });
//       try {
//         emitToUser(post.author.toString(), 'notification:new', { type: 'like', data: { actorId: userId, postId }, createdAt: new Date() });
//       } catch (e) {
//         console.warn('emitToUser failed (like):', e);
//       }
//     }
//     await session.commitTransaction();
//     return like;
//   } catch (err) {
//     await session.abortTransaction();
//     throw err;
//   } finally {
//     session.endSession();
//   }
// };

// export const unlikePost = async (postId: string, userId: string) => {
//   const res = await Like.deleteOne({ post: postId, user: userId });
//   if (res.deletedCount) await Post.updateOne({ _id: postId }, { $inc: { likesCount: -1 } });
//   return res;
// };

export const deletePost = async (postId: string, userId: string) => Post.updateOne({ _id: postId, author: userId }, { isDeleted: true });

export const getPostById = async (postId: string) => Post.findById(postId).populate('author', 'username displayName avatarUrl').lean();
