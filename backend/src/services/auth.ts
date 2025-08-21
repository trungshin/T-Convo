import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@utils/jwt';
import { RefreshToken } from '@models/refreshToken';
import { User } from '@models/user';
import { env } from '@config/env';
import { Types } from 'mongoose';
import AppError from '@utils/AppError';
import { StatusCodes } from 'http-status-codes';

/**
 * Registers a new user to the system.
 *
 * @param email - The email address of the new user.
 * @param username - The username of the new user.
 * @param password - The password of the new user.
 *
 * @throws {AppError} If either the email or username is already used.
 *
 * @returns The newly created user.
 */
export const registerUser = async (email: string, username: string, password: string) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email or username already used');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await User.create({ email, username, passwordHash: hashedPassword });

  return createdUser;
};

/**
 * Logs in an existing user to the system.
 *
 * @param email - The email address of the user to log in.
 * @param password - The password of the user to log in.
 *
 * @throws {AppError} If the email or password is invalid.
 *
 * @returns The logged in user.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');

  return user;
};

/**
 * Creates a new pair of access and refresh tokens for a given user.
 *
 * @param userId - The id of the user to create the tokens for.
 *
 * @returns An object containing the created access token and refresh token.
 */
export const createTokensForUser = async (userId: Types.ObjectId) => {
  const accessToken = signAccessToken({ sub: userId.toString() });
  const refreshToken = signRefreshToken({ sub: userId.toString() });

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const refreshTokenExpiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId,
    tokenHash: refreshTokenHash,
    expiresAt: refreshTokenExpiresAt
  });

  return { accessToken, refreshToken };
};

/**
 * Rotates an existing refresh token for a given user.
 *
 * @param oldRefreshToken - The existing refresh token to rotate.
 *
 * @throws {AppError} If the refresh token is invalid.
 *
 * @returns An object containing the new access token and refresh token.
 */
export const rotateRefreshToken = async (oldRefreshToken: string) => {
  const { sub: userId } = verifyRefreshToken(oldRefreshToken);
  const oldTokenHash = crypto.createHash('sha256').update(oldRefreshToken).digest('hex');

  const oldToken = await RefreshToken.findOne({ tokenHash: oldTokenHash, userId, revoked: false });
  if (!oldToken) throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');

  // Revoke old token
  oldToken.revoked = true;
  await oldToken.save();

  // Create new pair
  const newAccessToken = signAccessToken({ sub: userId });
  const newRefreshToken = signRefreshToken({ sub: userId });
  const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ userId, tokenHash: newTokenHash, expiresAt });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/**
 * Revokes an existing refresh token.
 *
 * @param token - The refresh token to revoke.
 *
 * @throws {AppError} If the token is invalid.
 */
export const revokeRefreshToken = async (token: string): Promise<void> => {
  const { sub: userId } = verifyRefreshToken(token);
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await RefreshToken.updateOne({ userId, tokenHash }, { revoked: true });
};

