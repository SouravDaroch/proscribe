import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: /api/auth/register
router.post('/register', registerUser);

// Route: /api/auth/login
router.post('/login', loginUser);

router.get('/profile', protect, (req: any, res) => {
  // If they reach here, the middleware worked!
  res.json({
    message: "Welcome to the private profile",
    user: req.user // req.user was attached by the middleware
  });
});

export default router;