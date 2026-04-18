import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';

interface DecodedToken {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string;

  // 1. Get token from the 'jwt' cookie (instead of headers)
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_ACCESS_SECRET!
      ) as DecodedToken;

      // 3. Find user and attach to the request object
      // We exclude the password for security
      (req as any).user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token found' });
  }
};