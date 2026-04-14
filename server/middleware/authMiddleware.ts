import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { type IUser } from '../models/User.js';

// Extend the Express Request type to include the user
interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // 1. Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
      }

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as unknown as { id: string };

      // 3. Attach user to request (excluding password)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      req.user = user;
      next(); // Move to the next controller
      return;
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};