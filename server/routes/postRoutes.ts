import express from 'express';
import { createPost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { postSchema } from '../../shared/schema/validation.js';

const router = express.Router();

/**
 * Route: POST /api/posts
 * Middlewares:
 * 1. protect: Ensures a valid JWT exists in cookies.
 * 2. validate(postSchema): Ensures title/blocks match our rules.
 */
router.post('/', protect, validate(postSchema), createPost);

export default router;