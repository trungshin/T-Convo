import { body } from 'express-validator';

export const registerValidation = [
  body('username').isString().isLength({ min: 3 }).withMessage('Username must be at least 3 chars'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password required')
];
