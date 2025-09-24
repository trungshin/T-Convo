import { Follow } from '@models/follow';
import { User } from '@models/user';
import { Types } from 'mongoose';
// import { Notification } from '../models/notification.model';
// import { getIO } from '../sockets';

export const followUser = async (followerId: string, followeeId: string) => {
  const created = await Follow.create({ follower: followerId, followee: followeeId });
  await User.updateOne({ _id: followeeId }, { $inc: { followersCount: 1 } });
  await User.updateOne({ _id: followerId }, { $inc: { followingCount: 1 } });

  // notification
//   await Notification.create({ user: followeeId, type: 'follow', data: { actorId: followerId } });
//   try { getIO().to(`user:${followeeId}`).emit('notification:new', { type: 'follow', data: { actorId: followerId }, createdAt: new Date() }); } catch(e){}
  return created;
};

export const unfollowUser = async (followerId: string, followeeId: string) => {
  const res = await Follow.deleteOne({ follower: followerId, followee: followeeId });
  if (res.deletedCount) {
    await User.updateOne({ _id: followeeId }, { $inc: { followersCount: -1 } });
    await User.updateOne({ _id: followerId }, { $inc: { followingCount: -1 } });
  }
  return res;
};

export const getFollowers = async (userId: string, limit = 100) => {
  const docs = await Follow.find({ followee: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('follower', 'username displayName avatarUrl')
    .lean();

  return docs.map((d: any) => {
    const user = d.follower;
    return {
      id: user?._id ? String(user._id) : null,
      username: user?.username || null,
      displayName: user?.displayName || null,
      avatarUrl: user?.avatarUrl || null,
      followedAt: d.createdAt
    };
  });
};

export const getFollowing = async (userId: string, limit = 50) => {
  const docs = await Follow.find({ follower: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('followee', 'username displayName avatarUrl')
    .lean();

  return docs.map((d: any) => {
    const user = d.followee;
    return {
      id: user?._id ? String(user._id) : null,
      username: user?.username || null,
      displayName: user?.displayName || null,
      avatarUrl: user?.avatarUrl || null,
      followedAt: d.createdAt
    };
  });
};


