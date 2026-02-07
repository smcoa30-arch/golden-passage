# Fresh Deployment Guide

This guide walks you through deploying Golden Passage as new projects on Vercel.

## Prerequisites

- GitHub account with your repository
- Vercel account (can sign up with GitHub)
- All API keys ready (Firebase, AI providers, etc.)

---

## Step 1: Push Latest Code to GitHub

```bash
cd golden-passage
git add -A
git commit -m "Prepare for fresh Vercel deployment"
git push origin main
```

---

## Step 2: Create Backend Project on Vercel

### 2.1 Import Repository
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import `smcoa30-arch/golden-passage`
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.2 Set Environment Variables
Go to **Settings** → **Environment Variables**, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `FRONTEND_URL` | *(leave empty for now, update after frontend deploy)* | Production |
| `GOOGLE_AI_KEY` | `AIzaSyAdfXxUM_BCeQjjzejEZ3FoUiJSlGXLVCM` | Production |
| `KIMI_API_KEY` | `sk-kimi-ZYG0OqIc4MHrvFN8KLR8pUMps5q37N6Om69SzuthhZT1zNa8aWq9WJbeUkqwbwkO` | Production |
| `OPENROUTER_API_KEY` | `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` | Production |
| `JWT_SECRET` | *(generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)* | Production |
| `JWT_REFRESH_SECRET` | *(generate another one)* | Production |

### 2.3 Deploy
Click **Deploy**

### 2.4 Copy Backend URL
After deployment, copy your backend URL:
```
https://golden-passage-api-xxxxx.vercel.app
```

---

## Step 3: Create Frontend Project on Vercel

### 3.1 Import Repository
1. Click **"Add New Project"** again
2. Import the same repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Set Environment Variables
Add these in Vercel Dashboard:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend-url.vercel.app/api/v1` *(from Step 2.4)* |
| `VITE_FIREBASE_API_KEY` | `AIzaSyDyOgzC6xSaPW0rJCtXUjDtCXAVwrVC24U` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `golden-passage-trading-s-156c5.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `golden-passage-trading-s-156c5` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `golden-passage-trading-s-156c5.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `788262288549` |
| `VITE_FIREBASE_APP_ID` | `1:788262288549:web:78e9d7743e0ae9cf46a14c` |
| `VITE_PAYPAL_CLIENT_ID` | `AXK8SEM6a46u4y0L1eTTA2K3AgGo4EBXBjRTl4HlPm8h37AZpwZIuUs27oaWL_7IVAaoeqNMMBQtzZI0` |
| `VITE_PAYPAL_PLAN_ID` | `P-0V4978233G058191XNGAEOQA` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_51QfDgcGUGo9hR5yb01zIw13ULASZGgUw2qn7iBWko06pdKO6HWOi2RUwgZkfl7ZjPJJDbsVK3lNnCBxp3mSElYsF00koJCLQuA` |
| `VITE_STRIPE_PRICE_ID` | `prod_Tu3fJAKWuFusnH` |
| `VITE_USDT_ADDRESS` | `TQQuPnagzeu849SsF2cbUtPKmzshJr2zou` |

### 3.3 Deploy
Click **Deploy**

### 3.4 Copy Frontend URL
After deployment:
```
https://golden-passage-xxxxx.vercel.app
```

---

## Step 4: Update Backend CORS

1. Go to your **Backend Project** on Vercel
2. **Settings** → **Environment Variables**
3. Add/Update:
   - `FRONTEND_URL` = `https://your-frontend-url.vercel.app` *(from Step 3.4)*
4. **Redeploy** the backend

---

## Step 5: Configure GitHub Secrets (Optional)

For automatic deployments via GitHub Actions:

1. Go to GitHub Repo → Settings → Secrets → Actions
2. Get values from Vercel:
   - **Vercel Token**: [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - **Org ID**: Vercel Dashboard → Settings → General
   - **Project IDs**: Each project settings → General

3. Add GitHub Secrets:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your Vercel token |
| `VERCEL_ORG_ID` | Your Vercel org ID |
| `VERCEL_PROJECT_ID` | Frontend project ID |
| `VERCEL_BACKEND_PROJECT_ID` | Backend project ID |

---

## Verification Checklist

### Backend Tests
```bash
# Test health endpoint
curl https://your-backend.vercel.app/

# Should return:
{
  "status": "ok",
  "env": {
    "google_ai": true,
    "kimi_ai": true,
    "openrouter": true
  }
}
```

### AI Test
```bash
# Test AI endpoint
curl -X POST https://your-backend.vercel.app/api/v1/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"instrument": "EUR/USD", "tradeType": "Intraday"}'

# Should return analysis with "source": "google"
```

### Frontend Tests
1. Open your frontend URL
2. Login should work
3. AI Trade Assistant should show "Powered by Google"

---

## Troubleshooting

### "Demo Mode Active"
- Check backend `/` endpoint shows `"google_ai": true`
- Verify `GOOGLE_AI_KEY` is set in Vercel Dashboard
- Redeploy backend

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your actual frontend URL
- Redeploy backend after updating

### "Route not found"
- Check `VITE_API_URL` in frontend includes `/api/v1`
- Verify backend is deployed and running

---

## Project URLs

After deployment, fill these in:

| Project | URL |
|---------|-----|
| Backend API | `https://` |
| Frontend | `https://` |

---

## Next Steps

1. ✅ Test all features
2. ✅ Configure custom domain (optional)
3. ✅ Set up monitoring
4. ✅ Add team members to Vercel
