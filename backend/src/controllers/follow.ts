import { Request, Response, NextFunction } from 'express';
import * as followService from '@services/follow';
import { StatusCodes } from 'http-status-codes';

export const followUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const followerId = req.body.userId;
  const followeeId = req.params.id;

  if (!followerId || !followeeId) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid request' });
    return;
  }

  try {
    await followService.followUser(followerId, followeeId);
    res.status(StatusCodes.OK).json({ message: 'Followed successfully' });
  } catch (error) {
    next(error);
  }
};

export const unfollowUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id: followeeId } = req.params;
  const { id: followerId } = req.body.user;

  try {
    await followService.unfollowUser(followerId, followeeId);
    res.status(StatusCodes.OK).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    next(error);
  }
}; 

export const getFollowersHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const limit = parseInt(req.query.limit as string) || 50; 

  try {
    const followers = await followService.getFollowers(userId, limit);
    res.status(StatusCodes.OK).json({ followers });
  } catch (error) {
    next(error);
  }
};

export const getFollowingHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const limit = parseInt(req.query.limit as string) || 100; 

  try {
    const following = await followService.getFollowing(userId, limit);
    res.status(StatusCodes.OK).json({ following });
  } catch (error) {
    next(error);
  }
};