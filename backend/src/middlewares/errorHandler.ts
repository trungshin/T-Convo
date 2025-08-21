import { StatusCodes } from 'http-status-codes';
import { env } from '@config/env';
import { Request, Response, NextFunction } from 'express';
import AppError from '@utils/AppError';

// Middleware Centralized error handling
export const errorHandler = (error: AppError | Error, request: Request, response: Response, next: NextFunction) => {
  // If statusCode is missing, the default code will be 500 INTERNAL_SERVER_ERROR
  const errorToHandle = 'statusCode' in error ? error : new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);

  // Create a responseError variable to control what to return
  const {
    statusCode,
    message,
    stack,
    errorCode,
  } = errorToHandle;

  // Return responseError to the Front-end
  response
    .status(statusCode)
    .json({
      statusCode,
      message: message || StatusCodes[statusCode], // If there is an error without a message, get the standard Reason Phrases according to the Status Code
      stack: env.NODE_ENV === 'dev' ? stack : undefined,
      errorCode,
    });
};
