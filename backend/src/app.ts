import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '@config/env';
import { errorHandler } from '@middlewares/errorHandler';
import authRoutes from '@routes/auth';

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

  app.use('/api/auth', authRoutes);
  
  app.use(errorHandler);

  return app;
};
