import { type Request, type Response } from 'express';
import User, { type IUser } from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      // 409 Conflict is more accurate for "already exists"
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    // No need for 'if (user)' check if create doesn't throw. 
    // If it reaches here, user is created.
    generateToken(res, user._id.toString());
    
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    console.error(`Register Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Checking 'user' existence and password in one go
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id.toString());
      
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }

    // Use 401 for both "user not found" and "wrong password" 
    // to prevent user enumeration (security best practice)
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error: any) {
    console.error(`Login Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    expires: new Date(0),
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};