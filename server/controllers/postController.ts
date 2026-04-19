import { type Response } from 'express';
import { Types } from 'mongoose';
import Post from '../models/Post.js';
import { type AuthRequest } from '../middleware/authMiddleware.js';

/**
 * 🔹 Helper: Ensure user exists
 */
const requireUser = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'User context missing' });
    return null;
  }
  return req.user;
};

/**
 * 🔹 Helper: Extract author ID safely (handles populated + ObjectId)
 */
const getAuthorId = (author: any): string => {
  if (author instanceof Types.ObjectId) {
    return author.toString();
  }
  if (author && typeof author === 'object' && '_id' in author) {
    return author._id.toString();
  }
  return '';
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const { title, description, blocks } = req.body;

    // Basic validation
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const post = await Post.create({
      title,
      description,
      blocks,
      author: user._id,
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
    const user = requireUser(req, res);
    if (!user) return;

    const query = user.role === 'admin' ? {} : { author: user._id };

    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error: any) {
    console.error(`Fetch Posts Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error: Failed to fetch posts' });
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Private
 */
export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const post = await Post.findById(req.params.id).populate('author', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const authorId = getAuthorId(post.author);
    const isOwner = authorId === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.status(200).json(post);
  } catch (error: any) {
    console.error(`Fetch Single Post Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error: Failed to fetch post' });
  }
};