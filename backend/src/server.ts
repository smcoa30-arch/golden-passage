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

// Trust proxy (required for Vercel)
app.set('trust proxy', 1);

console.log('Server starting...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('VERCEL:', process.env.VERCEL || 'not set');

// Log all environment variables for debugging
console.log('Environment Variables Check:');
console.log('  GOOGLE_AI_KEY exists:', !!process.env.GOOGLE_AI_KEY, 'Length:', process.env.GOOGLE_AI_KEY?.length || 0);
console.log('  KIMI_API_KEY exists:', !!process.env.KIMI_API_KEY, 'Length:', process.env.KIMI_API_KEY?.length || 0);
console.log('  OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY, 'Length:', process.env.OPENROUTER_API_KEY?.length || 0);
console.log('  All env keys:', Object.keys(process.env).filter(k => k.includes('KEY') || k.includes('AI')));

// Security middleware
app.use(helmet());

// CORS configuration - allow all vercel.app subdomains and common origins
const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allowed origin patterns
    const allowedPatterns = [
      /^http:\/\/localhost:\d+$/,                    // localhost:any_port
      /^https:\/\/golden-passage.*\.vercel\.app$/, // any golden-passage vercel app
      /^https:\/\/.*\.vercel\.app$/,               // any vercel app (broad)
    ];
    
    // Also check FRONTEND_URL from env
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    
    // Check against patterns
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      console.log('CORS allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // Still allow it for now (development-friendly)
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight for all routes
app.options('*', cors(corsOptions));

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

// Root path for Vercel health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Golden Passage API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    env: {
      google_ai: !!process.env.GOOGLE_AI_KEY,
      kimi_ai: !!process.env.KIMI_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
    }
  });
});

// Debug endpoint to check environment (remove in production)
app.get('/debug/env', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    hasGoogleKey: !!process.env.GOOGLE_AI_KEY,
    hasKimiKey: !!process.env.KIMI_API_KEY,
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    allEnvKeys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASSWORD')),
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

// Export for Vercel serverless
export default app;

// Start server only if not running on Vercel (local development)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  });
}
