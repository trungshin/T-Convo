import jwt from 'jsonwebtoken';
import { env } from '@config/env';

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN });
};

export const signRefreshToken = (payload: object) => {
  // Set expires manually for DB
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: `${env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d` });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};
