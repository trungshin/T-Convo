import dotenv from 'dotenv';
dotenv.config();

export const env = {
  LOCAL_PORT: process.env.LOCAL_PORT || '4000',
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'replace',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'replace',
  ACCESS_TOKEN_EXPIRES_IN: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 15 * 60 * 1000,
  REFRESH_TOKEN_EXPIRES_IN_DAYS: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS) || 30,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};