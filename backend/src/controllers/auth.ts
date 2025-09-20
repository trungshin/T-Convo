import { Request, Response, NextFunction } from 'express';
import { createTokensForUser, rotateRefreshToken, revokeRefreshToken, registerUser, loginUser } from '../services/auth';
import { env } from '@config/env';
import { StatusCodes } from 'http-status-codes';

const REFRESH_COOKIE_NAME = 'tconvo_rt'; // cookie name

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, username, password } = req.body;

  try {
    const user = await registerUser(email, username, password);
    const { accessToken, refreshToken } = await createTokensForUser(user._id);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    });

    res.status(StatusCodes.CREATED).json({ accessToken, user: { id: user._id, username } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    const { accessToken, refreshToken } = await createTokensForUser(user._id);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    });
    res.status(StatusCodes.OK).json({ accessToken, user: { id: user._id, username: user.username } });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const refreshTokenCookie = req.body.refreshToken;
  if (!refreshTokenCookie) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh token cookie missing' });
  }

  try {
    const { accessToken, refreshToken } = await rotateRefreshToken(refreshTokenCookie);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    });

    res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const refreshTokenCookie = req.cookies[REFRESH_COOKIE_NAME];
  console.log(refreshTokenCookie);

  if (!refreshTokenCookie) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh token cookie is missing' });
  }

  try {
    await revokeRefreshToken(refreshTokenCookie);
    res.clearCookie(REFRESH_COOKIE_NAME);
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
