import { type Response } from 'express';
import User from '../models/User.js';
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

/**
 * @desc    Get all posts (Dashboard)
 * @route   GET /api/posts
 * @access  Private (RBAC enabled)
 */
export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'User context missing' });

    let query = {};

    // RBAC: If not admin, filter by author. Admins see everything.
    if (req.user.role !== 'admin') {
      query = { author: req.user._id };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
    // Useful for the Dashboard UI

    return res.status(200).json(posts);
  } catch (error: any) {
    console.error(`Fetch Posts Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error: Failed to fetch posts' });
  }
};

/**
 * @desc    Get single post by ID ( Post View)
 * @route   GET /api/posts/:id
 * @access  Private
 */
export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'User context missing' });

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ownership Check (Step 5 logic):
    const isOwner = post.author._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied: Unauthorized ownership' });
    }

    return res.status(200).json(post);
  } catch (error: any) {
    console.error(`Fetch Single Post Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error: Failed to fetch post' });
  }
};