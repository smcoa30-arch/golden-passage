import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/v1/analytics/overview:
 *   get:
 *     summary: Get analytics overview
 *     tags: [Analytics]
 */
router.get('/overview', (req, res) => {
  res.json({
    winRate: 65.5,
    profitFactor: 1.8,
    totalTrades: 150,
    winningTrades: 98,
    losingTrades: 52
  });
});

export default router;
