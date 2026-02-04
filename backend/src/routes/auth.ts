import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint', token: 'mock-jwt-token' });
});

export default router;
