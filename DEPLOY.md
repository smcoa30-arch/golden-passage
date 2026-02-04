# 🚀 Deployment Guide

## GitHub Setup

### 1. Create a GitHub Repository

Go to https://github.com/new and create a new repository:
- **Repository name**: `golden-passage` (or your preferred name)
- **Visibility**: Public or Private
- **Do NOT initialize with README** (we already have one)

### 2. Push to GitHub

Run these commands in your terminal:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/golden-passage.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Vercel Deployment

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy the web frontend**:
```bash
cd web
vercel
```

4. **Set Environment Variables**:
```bash
vercel env add VITE_FIREBASE_API_KEY
cd vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... add all other env vars
```

### Option 2: Vercel Dashboard (UI)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `web`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables (all from your .env file)
5. Click **Deploy**

---

## Backend Deployment (Options)

### Docker (Self-hosted / VPS)
```bash
# On your server
git clone https://github.com/YOUR_USERNAME/golden-passage.git
cd golden-passage
docker-compose up -d
```

### Railway / Render / Fly.io
1. Connect your GitHub repo
2. Set environment variables from `.env.example`
3. Deploy

---

## Environment Variables Reference

### Frontend (Vercel)

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_PAYPAL_CLIENT_ID` | PayPal Client ID |
| `VITE_PAYPAL_PLAN_ID` | PayPal Subscription Plan ID |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key |
| `VITE_STRIPE_PRICE_ID` | Stripe Price ID |
| `VITE_USDT_ADDRESS` | USDT Wallet Address |
| `VITE_API_URL` | Backend API URL |

### Backend

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | production |
| `PORT` | 5000 |
| `DB_HOST` | Database host |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | JWT signing secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |

---

## Custom Domain Setup (Vercel)

1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Troubleshooting

### Build Failures
- Check that all environment variables are set
- Ensure `web/package.json` has the correct build script
- Verify Node.js version (18+)

### API Connection Issues
- Update `VITE_API_URL` to your backend URL
- Ensure CORS is configured on backend
- Check that backend is running and accessible

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- GitHub Docs: https://docs.github.com
- Contact: support@goldenpassage.com
