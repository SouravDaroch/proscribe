import express from 'express';
import { createPost, getPostById, getPosts } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { postSchema } from '../../shared/schema/validation.js';

const router = express.Router();

/**
 * Route: GET /api/posts
 * Description: Fetch all posts (we'll add ownership filtering in the controller)
 */
router.get('/', protect, getPosts);

/**
 * Route: GET /api/posts/:id
 * Description: Fetch a single post by ID for the View/Edit pages
 */
router.get('/:id', protect, getPostById);

/**
 * Route: POST /api/posts
 * Middlewares:
 * 1. protect: Ensures a valid JWT exists in cookies.
 * 2. validate(postSchema): Ensures title/blocks match our rules.
 */
router.post('/', protect, validate(postSchema), createPost);

export default router;