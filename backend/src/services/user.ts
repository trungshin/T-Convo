import { User } from '@models/user';
import AppError from '@utils/AppError';
import { StatusCodes } from 'http-status-codes';

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select('-passwordHash');

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return user;
};

export const getUserByUsername = async (username: string) => {
  const user = await User.findOne({ username: username.toLowerCase() }).select('-passwordHash');

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return user;
};

export const updateUserProfile = async (userId: string, updates: Partial<{ displayName: string; bio: string; avatarUrl: string; }>) => {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-passwordHash');
  return user;
};

export const searchUsers = async (query: string, limit: number = 10) => {    
  const users = await User.find({ username: { $regex: query, $options: 'i' } }).limit(limit).select('-passwordHash');
  return users;
};