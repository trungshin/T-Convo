import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@utils/jwt";
import { Types } from "mongoose";
import AppError from "@utils/AppError";
import { StatusCodes } from "http-status-codes";

// Định nghĩa interface cho payload JWT
interface JwtPayload {
  sub: string; 
  [key: string]: any; // Cho các field khác nếu cần
}
// Extend Request để thêm user
interface AuthRequest extends Request {
  user?: { id: Types.ObjectId };
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Authorization header is missing or invalid",
      "AUTH_HEADER_MISSING"
    );
  }

  const token = header.split(" ")[1];
  if (!token) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Missing token",
      "AUTH_TOKEN_MISSING"
    );
  }

  try {
    const payload = verifyAccessToken(token) as JwtPayload;
    if (!payload.sub) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Invalid token payload",
        "AUTH_TOKEN_PAYLOAD_INVALID"
      );
    }
    req.user = { id: new Types.ObjectId(payload.sub) }; // Convert sub thành ObjectId
    next();
  } catch (err) {
    next(err);
  }
};
