import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/v1/users/dashboard:
 *   get:
 *     summary: Get user dashboard
 *     tags: [Users]
 */
router.get('/dashboard', (req, res) => {
  res.json({ 
    message: 'User dashboard',
    data: { trades: [], analytics: {}, streaks: {} }
  });
});

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 */
router.get('/profile', (req, res) => {
  res.json({ 
    user: { id: 1, email: 'trader@example.com', name: 'Trader' }
  });
});

export default router;
