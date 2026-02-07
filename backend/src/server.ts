import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Server starting...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('KIMI_API_KEY loaded:', !!process.env.KIMI_API_KEY, 'Length:', process.env.KIMI_API_KEY?.length || 0);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Golden Passage API',
      version: '1.0.0',
      description: 'AI-Powered Trading Assistant Platform API',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'golden-passage-api'
  });
});

// API Routes
app.get('/api/v1', (req, res) => {
  res.json({ message: 'Welcome to Golden Passage API', version: '1.0.0' });
});

// Import routes (after dotenv.config())
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import tradeRoutes from './routes/trades';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/trades', tradeRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/ai', aiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});
