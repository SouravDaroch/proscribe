import { type Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, id: string) => {
  // 1. Create the token
  const token = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '30d',
  });

  // 2. Set the cookie in the response object
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents XSS (JavaScript cannot access this)
    secure: process.env.NODE_ENV !== 'development', // Only use HTTPS in production
    sameSite: 'strict', // Prevents CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

export default generateToken;