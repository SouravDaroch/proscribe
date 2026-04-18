import { type Request, type Response } from 'express';
import User, { type IUser } from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create the user (This triggers our .pre('save') hook!)
    const user = await User.create({
      name,
      email,
      password,
      // role will default to 'writer' as per our Schema
    });

    if (user) {
      generateToken(res, user._id as unknown as string);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Use the matchPassword method we created in the Model
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id as unknown as string);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Logout user / Clear Cookie
 * @route   POST /api/auth/logout
 */
export const logoutUser = (req: Request, res: Response) => {
  // Clear the cookie by setting it to an empty string and expiring it immediately
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};