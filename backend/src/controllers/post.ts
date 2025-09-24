import { Request, Response, NextFunction } from 'express';
import { createPost, getFeed, getPostFromUser } from '@services/post';
import { StatusCodes } from 'http-status-codes';
import { User } from '@models/user';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user: { id: Types.ObjectId }
}

export const createPostHandler = async (req: Request, res: Response, next: NextFunction) => {
    // console.log("res: ", res);
  try {
    const { content, media, author: { id } } = req.body;
    const post = await createPost(id, content, media);
    res.status(StatusCodes.CREATED).json({ post });
  } catch (error) {
    next(error);
  }
};

export const getFeedHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || null;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    const result = await getFeed();
    res.status(StatusCodes.OK).json({ posts: result });
  } catch (error) {
    next(error);
  }
};

export const getPostFromUserHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || null;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    const result = await getPostFromUser(userId);
    res.status(StatusCodes.OK).json({ posts: result });
  } catch (error) {
    next(error);
  }
};
