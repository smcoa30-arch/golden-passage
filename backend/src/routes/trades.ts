import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/v1/trades:
 *   get:
 *     summary: List all trades
 *     tags: [Trades]
 */
router.get('/', (req, res) => {
  res.json({ trades: [], count: 0 });
});

/**
 * @swagger
 * /api/v1/trades:
 *   post:
 *     summary: Create a new trade
 *     tags: [Trades]
 */
router.post('/', (req, res) => {
  res.json({ message: 'Trade created', trade: req.body });
});

export default router;
