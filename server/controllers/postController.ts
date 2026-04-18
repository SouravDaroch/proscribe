import { type Response } from 'express';
import Post from '../models/Post.js';
import { type AuthRequest } from '../middleware/authMiddleware.js';

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, blocks } = req.body;

    // 1. Safety check (helps TS and prevents runtime crashes)
    if (!req.user) {
      return res.status(401).json({ message: 'User context missing' });
    }

    // 2. Use the '!' non-null assertion or the check above
    const post = await Post.create({
      title,
      description,
      author: req.user._id, // TS now knows this exists because of the check above
      blocks,
      status: 'draft',
    });

    return res.status(201).json(post);
  } catch (error: any) {
    console.error(`Post Creation Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error: Failed to create post' });
  }
};