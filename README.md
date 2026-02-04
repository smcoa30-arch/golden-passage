# Golden Passage - AI-Powered Trading Assistant Platform

![Golden Passage Logo](assets/logo.png)

## Overview

Golden Passage is a comprehensive trading assistant platform designed to help forex and stock traders improve their performance through AI-powered insights, structured journaling, advanced analytics, and educational resources.

## Features

### Core Features
- **AI-Powered Daily Trading Strategy Generator** - Get personalized trading strategies every day
- **Pre-defined Trading Strategies** - Choose from proven strategies curated by experts
- **Structured Journaling System** - Track trades with OCR screenshot parsing
- **Pre-market, Entry, and Post-market Checklists** - Stay disciplined with integrated checklists
- **Learning Section** - Comprehensive forex education and strategy guides
- **Customizable Dashboards** - Analytics by day, week, month, year, strategy, and instrument
- **Streak Tracking** - Monitor winning/losing streaks and checklist completion
- **Multi-timezone Support** - Display times in your selected timezone

### Advanced Features
- **Detailed Analytics** - Win rate, profit factor, instrument performance, strategy comparisons
- **Trading Calculators** - Position size, risk/reward, pip, margin, compounding calculators
- **Visualizations** - Charts, tables, progress trackers
- **Exportable Reports** - PDF and CSV export functionality
- **AI-Driven Lessons** - Personalized learning based on trading history
- **Notifications & Reminders** - Never miss pre-market prep or post-market review
- **Multi-language Support** - Available in multiple languages
- **Dark/Light Mode** - Customizable themes
- **Gamified Streak Tracking** - Stay motivated with achievements

### Subscription Plans
- **Free Trial** - 14 days full access
- **Premium Plan** - $11 USD/month
  - PayPal, USDT, Stripe payment options

## Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL database
- Redis for caching
- Azure OpenAI for AI features
- Azure Vision for OCR
- JWT authentication
- Stripe/PayPal/USDT payment integration

### Frontend (Web)
- React 18 with TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for visualizations
- React Query for state management

### Mobile (iOS & Android)
- React Native with TypeScript
- Expo for development
- Native navigation
- Push notifications

### DevOps
- Docker & Docker Compose
- GitHub Actions CI/CD
- Azure/AWS/GCP deployment ready

## Project Structure

```
golden-passage/
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── config/       # Database, Redis, Swagger config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic (AI, email, payments)
│   │   ├── utils/        # Helper functions
│   │   ├── types/        # TypeScript types
│   │   └── jobs/         # Scheduled tasks
│   ├── src/config/migrations/  # Database migrations
│   ├── Dockerfile
│   └── package.json
├── web/              # React web application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services
│   │   └── store/        # Redux store
│   ├── Dockerfile
│   └── package.json
├── mobile/           # React Native mobile apps
│   ├── src/
│   │   ├── screens/      # Screen components
│   │   ├── navigation/   # Navigation setup
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── store/        # Redux store
│   └── package.json
├── docs/             # Documentation
│   ├── DEPLOYMENT_GUIDE.md
│   ├── USER_MANUAL.md
│   ├── ADMIN_MANUAL.md
│   └── API_REFERENCE.md
├── database/         # Database schemas and seeds
├── scripts/          # Deployment and utility scripts
├── assets/           # Images, logos, and static assets
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/golden-passage.git
cd golden-passage
```

2. Set up environment variables
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

3. Start with Docker Compose
```bash
docker-compose up -d
```

Or manually:

```bash
# Install backend dependencies
cd backend
npm install
npm run migrate
npm run dev

# Install web dependencies
cd ../web
npm install
npm run dev

# Install mobile dependencies
cd ../mobile
npm install
npx expo start
```

## API Documentation

API documentation is available at `/api-docs` when running the backend server.

### Authentication
All API requests (except authentication endpoints) require a Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/users/dashboard` - Get user dashboard
- `GET /api/v1/trades` - List trades
- `POST /api/v1/trades` - Create trade
- `GET /api/v1/analytics/overview` - Get analytics
- `POST /api/v1/ai/daily-strategy` - Generate AI strategy

See [API_REFERENCE.md](docs/API_REFERENCE.md) for complete documentation.

## Deployment

### Web Application
See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed deployment instructions for:
- AWS (ECS, Elastic Beanstalk)
- Azure (Container Instances, App Service)
- Google Cloud Platform (Cloud Run)

### Mobile Applications

#### iOS
```bash
cd mobile
expo build:ios
# Or for app store
expo build:ios --type archive
```

#### Android
```bash
cd mobile
expo build:android
# Or for Play Store
expo build:android --type app-bundle
```

## Environment Variables

### Backend
```env
# Server
NODE_ENV=production
PORT=5000
API_URL=https://api.goldenpassage.com
FRONTEND_URL=https://goldenpassage.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=golden_passage
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Azure Vision
AZURE_VISION_ENDPOINT=https://your-vision-resource.cognitiveservices.azure.com
AZURE_VISION_API_KEY=your_key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## Documentation

- [User Manual](docs/USER_MANUAL.md) - Guide for traders using the platform
- [Admin Manual](docs/ADMIN_MANUAL.md) - Guide for platform administrators
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Step-by-step deployment instructions
- [API Reference](docs/API_REFERENCE.md) - Complete API documentation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

### Backend
```bash
cd backend
npm test
```

### Web
```bash
cd web
npm test
```

### Mobile
```bash
cd mobile
npm test
```

## License

MIT License - see LICENSE file for details

## Support

- Email: support@goldenpassage.com
- Discord: [discord.gg/goldenpassage](https://discord.gg/goldenpassage)
- Documentation: [docs.goldenpassage.com](https://docs.goldenpassage.com)

## Roadmap

- [ ] Social trading features
- [ ] Advanced backtesting
- [ ] Broker API integrations
- [ ] Options trading support
- [ ] Cryptocurrency trading
- [ ] AI-powered trade signals
- [ ] Community features

---

Built with ❤️ for traders worldwide.

**Golden Passage** - Your Path to Trading Mastery
