# Golden Passage - API Reference

## Base URL
```
Production: https://api.goldenpassage.com/api/v1
Development: http://localhost:5000/api/v1
```

## Authentication

All API requests (except authentication endpoints) require a Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

## Authentication Endpoints

### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "timezone": "UTC"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "subscriptionStatus": "trial",
      "trialEndsAt": "2024-02-17T00:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "expiresIn": 3600
    }
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### Logout
```http
POST /auth/logout
```

### Get Current User
```http
GET /auth/me
```

## User Endpoints

### Get Profile
```http
GET /users/profile
```

### Update Profile
```http
PUT /users/profile
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "timezone": "America/New_York",
  "language": "en",
  "theme": "dark"
}
```

### Upload Avatar
```http
POST /users/avatar
Content-Type: multipart/form-data
```

**Form Data:**
- `avatar`: Image file (JPEG, PNG, WebP, max 5MB)

### Get Dashboard
```http
GET /users/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "today": {
      "journal": { ... },
      "trades": [ ... ],
      "strategy": { ... }
    },
    "stats": {
      "openTrades": 3,
      "monthlyTrades": 45,
      "monthlyWinRate": "62.50",
      "monthlyPnL": 1250.00
    },
    "streaks": {
      "winning": { "current": 5, "max": 12 },
      "checklist": { "current": 15, "max": 30 }
    }
  }
}
```

## Trade Endpoints

### List Trades
```http
GET /trades?page=1&limit=20&status=closed&instrument=EURUSD
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by status (open, closed, pending)
- `instrument`: Filter by instrument
- `startDate`: Filter by start date (ISO 8601)
- `endDate`: Filter by end date (ISO 8601)

### Get Trade
```http
GET /trades/:id
```

### Create Trade
```http
POST /trades
```

**Request Body:**
```json
{
  "instrument": "EURUSD",
  "instrumentType": "forex",
  "direction": "long",
  "entryPrice": 1.0850,
  "exitPrice": null,
  "stopLoss": 1.0800,
  "takeProfit": 1.0950,
  "positionSize": 0.1,
  "lotSize": 0.1,
  "entryDate": "2024-02-03T10:00:00Z",
  "timeframe": "1H",
  "strategyId": "uuid",
  "entryReason": "Breakout above resistance",
  "screenshots": ["url1", "url2"],
  "tags": ["breakout", "trend"]
}
```

### Update Trade
```http
PUT /trades/:id
```

**Request Body:**
```json
{
  "exitPrice": 1.0920,
  "exitDate": "2024-02-03T14:30:00Z",
  "exitReason": "Target reached",
  "emotions": "Confident",
  "lessons": "Good patience waiting for target"
}
```

### Delete Trade
```http
DELETE /trades/:id
```

### Get Trade Statistics
```http
GET /trades/stats/summary
```

## Journal Endpoints

### List Journals
```http
GET /journals?page=1&limit=20
```

### Get Journal
```http
GET /journals/:id
```

### Create Journal
```http
POST /journals
```

**Request Body:**
```json
{
  "date": "2024-02-03",
  "preMarketAnalysis": "Bullish sentiment after NFP",
  "marketConditions": "Trending up",
  "notes": "Good trading day",
  "mood": "Confident",
  "energyLevel": 8,
  "focusLevel": 9,
  "screenshots": ["url1"]
}
```

### Update Journal
```http
PUT /journals/:id
```

### Delete Journal
```http
DELETE /journals/:id
```

### Get Today's Journal
```http
GET /journals/today
```

## Strategy Endpoints

### List Strategies
```http
GET /strategies?type=custom&category=trend
```

### Get Strategy
```http
GET /strategies/:id
```

### Create Strategy
```http
POST /strategies
```

**Request Body:**
```json
{
  "name": "Trend Following",
  "description": "Follow the trend with moving averages",
  "category": "trend",
  "instruments": ["EURUSD", "GBPUSD"],
  "timeframes": ["1H", "4H"],
  "entryRules": [
    "Price above 200 EMA",
    "50 EMA crosses above 200 EMA"
  ],
  "exitRules": [
    "Price closes below 50 EMA",
    "Stop loss hit"
  ],
  "riskManagement": {
    "maxRiskPerTrade": 1,
    "maxDailyLoss": 3,
    "riskRewardRatio": 2
  },
  "indicators": ["EMA 50", "EMA 200"]
}
```

### Update Strategy
```http
PUT /strategies/:id
```

### Delete Strategy
```http
DELETE /strategies/:id
```

## Checklist Endpoints

### List Checklists
```http
GET /checklists?type=pre_market
```

### Get Checklist
```http
GET /checklists/:id
```

### Create Checklist
```http
POST /checklists
```

**Request Body:**
```json
{
  "name": "My Pre-Market Checklist",
  "type": "pre_market",
  "description": "Custom pre-market routine",
  "items": [
    { "text": "Check economic calendar", "isRequired": true },
    { "text": "Review charts", "isRequired": true }
  ]
}
```

### Complete Checklist
```http
POST /checklists/:id/complete
```

**Request Body:**
```json
{
  "completedItems": ["item-1", "item-2"],
  "tradeId": "uuid",
  "journalId": "uuid"
}
```

## Analytics Endpoints

### Get Overview
```http
GET /analytics/overview?period=monthly
```

**Period Options:** daily, weekly, monthly, yearly, all

### Get By Instrument
```http
GET /analytics/by-instrument?startDate=2024-01-01&endDate=2024-02-03
```

### Get By Strategy
```http
GET /analytics/by-strategy
```

### Get Equity Curve
```http
GET /analytics/equity-curve
```

### Get Streaks
```http
GET /analytics/streaks
```

### Export Data
```http
GET /analytics/export?format=csv&startDate=2024-01-01
```

## Calculator Endpoints

### Position Size Calculator
```http
POST /calculators/position-size
```

**Request Body:**
```json
{
  "accountBalance": 10000,
  "riskPercentage": 1,
  "stopLossPips": 50,
  "pipValue": 10,
  "instrument": "EURUSD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "positionSize": 0.2,
    "lotSize": 0.2,
    "riskAmount": 100,
    "units": 20000,
    "formatted": {
      "positionSize": "0.20",
      "lotSize": "0.20",
      "riskAmount": "100.00",
      "units": "20,000"
    }
  }
}
```

### Risk/Reward Calculator
```http
POST /calculators/risk-reward
```

**Request Body:**
```json
{
  "entryPrice": 1.0850,
  "stopLoss": 1.0800,
  "takeProfit": 1.0950,
  "direction": "long"
}
```

### Other Calculators
- `POST /calculators/pip-value`
- `POST /calculators/margin`
- `POST /calculators/compound`
- `POST /calculators/profit-factor`
- `POST /calculators/expectancy`
- `POST /calculators/fibonacci`

## AI Endpoints

### Generate Daily Strategy
```http
POST /ai/daily-strategy
```

**Request Body:**
```json
{
  "date": "2024-02-03",
  "preferences": {
    "instruments": ["EURUSD", "GBPUSD"],
    "forceRegenerate": false
  }
}
```

### Generate Personalized Lesson
```http
POST /ai/personalized-lesson
```

**Request Body:**
```json
{
  "topic": "Risk Management",
  "difficulty": "intermediate"
}
```

### Analyze Trade Setup
```http
POST /ai/analyze-setup
```

**Request Body:**
```json
{
  "instrument": "EURUSD",
  "direction": "long",
  "entryPrice": 1.0850,
  "stopLoss": 1.0800,
  "takeProfit": 1.0950,
  "timeframe": "1H",
  "notes": "Breakout setup"
}
```

### Get Trading Insights
```http
GET /ai/trading-insights
```

## Payment Endpoints

### Get Subscription
```http
GET /payments/subscription
```

### Subscribe
```http
POST /payments/subscribe
```

**Request Body:**
```json
{
  "plan": "premium",
  "paymentMethod": "stripe",
  "paymentMethodId": "pm_123456"
}
```

### Verify USDT Payment
```http
POST /payments/verify-usdt
```

**Request Body:**
```json
{
  "transactionHash": "0x123456..."
}
```

### Cancel Subscription
```http
POST /payments/cancel
```

## Notification Endpoints

### List Notifications
```http
GET /notifications?page=1&limit=20&unreadOnly=true
```

### Mark as Read
```http
PUT /notifications/:id/read
```

### Mark All as Read
```http
PUT /notifications/read-all
```

### Get Settings
```http
GET /notifications/settings/current
```

### Update Settings
```http
PUT /notifications/settings/update
```

## Admin Endpoints

### Get Dashboard
```http
GET /admin/dashboard
```

### List Users
```http
GET /admin/users?page=1&limit=20&search=john
```

### Get User Details
```http
GET /admin/users/:id
```

### Update User Status
```http
PUT /admin/users/:id/status
```

**Request Body:**
```json
{
  "isActive": true,
  "role": "admin"
}
```

### List Subscriptions
```http
GET /admin/subscriptions?status=active
```

### List Payments
```http
GET /admin/payments
```

### Create Strategy
```http
POST /admin/strategies
```

### Create Lesson
```http
POST /admin/lessons
```

## Error Codes

| Code | Description |
|------|-------------|
| BAD_REQUEST | Invalid request parameters |
| UNAUTHORIZED | Authentication required |
| FORBIDDEN | Insufficient permissions |
| NOT_FOUND | Resource not found |
| CONFLICT | Resource already exists |
| VALIDATION_ERROR | Input validation failed |
| TOO_MANY_REQUESTS | Rate limit exceeded |
| INTERNAL_ERROR | Server error |
| SERVICE_UNAVAILABLE | Service temporarily unavailable |
| TOKEN_EXPIRED | JWT token expired |
| INVALID_TOKEN | Invalid JWT token |
| SUBSCRIPTION_EXPIRED | User subscription expired |
| SUBSCRIPTION_REQUIRED | Active subscription required |

## Rate Limits

- Authentication: 5 requests per 15 minutes
- API: 100 requests per 15 minutes
- AI endpoints: 50 requests per hour
- File uploads: 20 requests per hour

## Pagination

All list endpoints support pagination:

```http
GET /trades?page=2&limit=50
```

Response includes meta information:

```json
{
  "meta": {
    "page": 2,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

## Webhooks

### Stripe Webhook
```http
POST /payments/webhook/stripe
```

### PayPal Webhook
```http
POST /payments/webhook/paypal
```

---

**API Version**: 1.0  
**Last Updated**: 2024
