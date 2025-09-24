import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '@config/env';
import { errorHandler } from '@middlewares/errorHandler';
import routes from './routes';
import { corsOptions } from '@config/cors'

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors(corsOptions));

  app.use('/api', routes);

  app.use(errorHandler);

  return app;
};
