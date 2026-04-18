import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js'; 
import { loginSchema, registerSchema } from '../../shared/schema/validation.js';


const router = express.Router();

// Zod validation for auth routes
// Route: /api/auth/register
router.post('/register', validate(registerSchema), registerUser);
// Route: /api/auth/login
router.post('/login', validate(loginSchema), loginUser);

router.get('/profile', protect, (req: any, res) => {
  // If they reach here, the middleware worked!
  res.json({
    message: "Welcome to the private profile",
    user: req.user // req.user was attached by the middleware
  });
});

router.post('/logout', logoutUser);

export default router;