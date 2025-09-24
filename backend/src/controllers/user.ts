import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getUserByUsername } from '@services/user';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};