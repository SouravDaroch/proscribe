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

    const { title, description, blocks, status } = req.body;

    // Basic validation
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const post = await Post.create({
      title,
      description,
      blocks,
      author: user._id,
      status: status || 'draft',
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

    const query: any = user.role === 'admin' ? {} : { author: user._id };

    // Add optional status filtering from query params
    if (req.query.status === 'published' || req.query.status === 'draft') {
      query.status = req.query.status;
    }

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
 * @desc    Get all public posts (Public Feed)
 * @route   GET /api/posts/public
 * @access  Public
 */
export const getPublicPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error: any) {
    console.error(`Fetch Public Posts Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error: Failed to fetch public posts' });
  }
};

/**
 * @desc    Get a single post by ID (Public access)
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error: any) {
    console.error(`Fetch Single Post Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error: Failed to fetch post' });
  }
};

/**
 * @desc    Get a single post by ID (Private access for editing)
 * @route   GET /api/posts/:id/edit
 * @access  Private
 */
export const getPostForEdit = async (req: AuthRequest, res: Response) => {
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

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private (Owner or Admin)
 */

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Fetch the post first
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 2. Authorization Logic (The most important part)
    const isOwner = post.author.toString() === req.user?._id.toString();
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // 3. Execution
    await post.deleteOne(); // Using .deleteOne() on the instance is cleaner than findByIdAndDelete here

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error: Could not delete post' });
  }
};

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private (Owner or Admin)
 */
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = requireUser(req, res);
    if (!user) return;

    // 1. Find the post
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2. Authorization Logic
    const authorId = getAuthorId(post.author);
    const isOwner = authorId === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    // 3. Execution
    // { new: true } returns the document AFTER the update
    // { runValidators: true } ensures the new data follows your Schema rules
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name');

    return res.status(200).json(updatedPost);
  } catch (error: any) {
    console.error(`Update Post Error: ${error.message}`);
    return res.status(500).json({ message: "Server error: Could not update post" });
  }
};