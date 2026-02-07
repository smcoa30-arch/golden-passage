# Environment Setup Guide

This guide explains how to configure environment variables for local development and production deployment.

## File Structure

```
golden-passage/
├── backend/
│   ├── .env              # Local backend secrets (NEVER commit)
│   ├── .env.example      # Template for backend env vars
│   └── .env.local        # Local overrides
├── web/
│   ├── import.env        # Local frontend secrets (NEVER commit)
│   ├── .env.example      # Template for frontend env vars
│   └── .env.local        # Local overrides
└── .github/
    └── workflows/
        ├── deploy-web.yml      # Frontend deployment
        ├── deploy-backend.yml  # Backend deployment
        └── ci-cd.yml           # CI/CD pipeline
```

## Local Development Setup

### 1. Backend Environment Variables

Copy the example file and fill in your values:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Required for AI
GOOGLE_AI_KEY=AIzaSyAdfXxUM_BCeQjjzejEZ3FoUiJSlGXLVCM
KIMI_API_KEY=sk-kimi-ZYG0OqIc4MHrvFN8KLR8pUMps5q37N6Om69SzuthhZT1zNa8aWq9WJbeUkqwbwkO
OPENROUTER_API_KEY=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

# Required for Auth (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
```

### 2. Frontend Environment Variables

```bash
cd web
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api/v1

# Firebase (get from Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase vars
```

## Production Deployment (Vercel)

### Backend Environment Variables

Go to: [Vercel Dashboard](https://vercel.com) → Your Backend Project → Settings → Environment Variables

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Production |
| `GOOGLE_AI_KEY` | Your Google AI key | Production |
| `KIMI_API_KEY` | Your Kimi API key | Production |
| `OPENROUTER_API_KEY` | Your OpenRouter key | Production |
| `JWT_SECRET` | Generated secret | Production |
| `JWT_REFRESH_SECRET` | Generated secret | Production |

### Frontend Environment Variables

Go to: [Vercel Dashboard](https://vercel.com) → Your Frontend Project → Settings → Environment Variables

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.vercel.app/api/v1` |
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Your Firebase app ID |

## GitHub Secrets Setup

Go to: GitHub Repo → Settings → Secrets and variables → Actions

### Required Secrets

#### For Backend Build
| Secret Name | Description |
|-------------|-------------|
| `GOOGLE_AI_KEY` | Google AI API key |
| `KIMI_API_KEY` | Kimi AI API key |
| `OPENROUTER_API_KEY` | OpenRouter API key |

#### For Frontend Build
| Secret Name | Description |
|-------------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID |
| `VITE_PAYPAL_PLAN_ID` | PayPal plan ID |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `VITE_STRIPE_PRICE_ID` | Stripe price ID |
| `VITE_USDT_ADDRESS` | USDT wallet address |
| `VITE_GOOGLE_AI_KEY` | Google AI key (optional) |
| `VITE_KIMI_API_KEY` | Kimi AI key (optional) |
| `VITE_OPENROUTER_API_KEY` | OpenRouter key (optional) |

#### For Vercel Deployment
| Secret Name | How to Get |
|-------------|------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel Project Settings → General |
| `VERCEL_PROJECT_ID` | Vercel Frontend Project Settings |
| `VERCEL_BACKEND_PROJECT_ID` | Vercel Backend Project Settings |

## Quick Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Set GitHub Secrets via CLI
```bash
# Install GitHub CLI: https://cli.github.com/

# Login
gh auth login

# Set secrets
gh secret set GOOGLE_AI_KEY -b"your_key" -R yourusername/golden-passage
gh secret set KIMI_API_KEY -b"your_key" -R yourusername/golden-passage
gh secret set OPENROUTER_API_KEY -b"your_key" -R yourusername/golden-passage
```

## Verification

### Test Backend API
```bash
curl https://your-backend.vercel.app/
```

Should return:
```json
{
  "status": "ok",
  "env": {
    "google_ai": true,
    "kimi_ai": true,
    "openrouter": true
  }
}
```

### Test AI Endpoint
```bash
curl -X POST https://your-backend.vercel.app/api/v1/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"instrument": "EUR/USD", "tradeType": "Intraday"}'
```

Should return analysis with `"source": "google"` (or kimi/openrouter).

## Troubleshooting

### "Demo Mode Active" on Frontend
1. Check backend `/` endpoint shows `"google_ai": true`
2. Check backend logs for API errors
3. Verify AI keys are set in Vercel Dashboard
4. Redeploy backend after setting env vars

### "Route not found" errors
1. Check `VITE_API_URL` is correct in frontend
2. Check `FRONTEND_URL` is correct in backend (for CORS)
3. Verify backend is deployed and running

### CORS errors
1. Add your frontend URL to backend `FRONTEND_URL` env var
2. Redeploy backend

## Security Notes

- NEVER commit `.env` files to Git
- NEVER commit `import.env` to Git
- Use strong JWT secrets (64+ characters)
- Rotate API keys regularly
- Use production API keys only in production
- Keep secrets in GitHub/Vercel, not in code
