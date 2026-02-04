# Golden Passage - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Web Application Deployment](#web-application-deployment)
4. [Mobile App Deployment](#mobile-app-deployment)
5. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

### Required Tools
- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+
- Git

### Cloud Accounts (Choose one)
- AWS Account
- Azure Account
- Google Cloud Platform Account

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/golden-passage.git
cd golden-passage
```

### 2. Environment Variables
Create `.env` files for each service:

#### Backend (.env)
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
DB_PASSWORD=your_secure_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Azure Vision
AZURE_VISION_ENDPOINT=https://your-vision-resource.cognitiveservices.azure.com
AZURE_VISION_API_KEY=your_azure_vision_key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_price_id

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live

# USDT
USDT_TRC20_ADDRESS=your_trc20_wallet_address
USDT_ERC20_ADDRESS=your_erc20_wallet_address

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## Web Application Deployment

### Option 1: Docker Deployment (Recommended)

#### Step 1: Build and Start Services
```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Step 2: Run Database Migrations
```bash
docker-compose exec backend npm run migrate
```

#### Step 3: Seed Database (Optional)
```bash
docker-compose exec backend npm run seed
```

### Option 2: AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Create ECR Repositories**
```bash
aws ecr create-repository --repository-name golden-passage-api
aws ecr create-repository --repository-name golden-passage-web
```

2. **Build and Push Images**
```bash
# Login to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin your-account.dkr.ecr.region.amazonaws.com

# Build and tag images
docker build -t golden-passage-api ./backend
docker build -t golden-passage-web ./web

# Tag for ECR
docker tag golden-passage-api:latest your-account.dkr.ecr.region.amazonaws.com/golden-passage-api:latest
docker tag golden-passage-web:latest your-account.dkr.ecr.region.amazonaws.com/golden-passage-web:latest

# Push to ECR
docker push your-account.dkr.ecr.region.amazonaws.com/golden-passage-api:latest
docker push your-account.dkr.ecr.region.amazonaws.com/golden-passage-web:latest
```

3. **Create ECS Cluster and Services**
- Use AWS Console or CloudFormation/Terraform
- Configure task definitions
- Set up Application Load Balancer
- Configure auto-scaling

#### Using Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
cd backend
eb init -p node.js golden-passage-api

# Create environment
eb create production

# Deploy
eb deploy
```

### Option 3: Azure Deployment

#### Using Azure Container Instances
```bash
# Create resource group
az group create --name golden-passage-rg --location eastus

# Create container registry
az acr create --resource-group golden-passage-rg --name goldenpassageacr --sku Basic

# Build and push images
az acr build --registry goldenpassageacr --image golden-passage-api ./backend
az acr build --registry goldenpassageacr --image golden-passage-web ./web

# Deploy container instances
az container create \
  --resource-group golden-passage-rg \
  --name golden-passage-api \
  --image goldenpassageacr.azurecr.io/golden-passage-api:latest \
  --ports 5000
```

#### Using Azure App Service
```bash
# Create App Service Plan
az appservice plan create \
  --name golden-passage-plan \
  --resource-group golden-passage-rg \
  --sku P1V2 \
  --is-linux

# Create Web App for API
az webapp create \
  --name golden-passage-api \
  --resource-group golden-passage-rg \
  --plan golden-passage-plan \
  --deployment-container-image-name goldenpassageacr.azurecr.io/golden-passage-api:latest
```

### Option 4: Google Cloud Platform

#### Using Cloud Run
```bash
# Build images with Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Deploy to Cloud Run
gcloud run deploy golden-passage-api \
  --image gcr.io/your-project/golden-passage-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Mobile App Deployment

### iOS Deployment

#### Prerequisites
- macOS with Xcode 14+
- Apple Developer Account ($99/year)
- CocoaPods installed

#### Build and Deploy

1. **Install Dependencies**
```bash
cd mobile/ios
pod install
```

2. **Configure Signing**
- Open `GoldenPassage.xcworkspace` in Xcode
- Select your team in Signing & Capabilities
- Update bundle identifier

3. **Build Archive**
```bash
# Using Xcode
# Product > Archive

# Or using command line
xcodebuild -workspace GoldenPassage.xcworkspace -scheme GoldenPassage archive
```

4. **Upload to App Store**
```bash
# Using Xcode Organizer
# Select archive > Distribute App > App Store Connect

# Or using altool
xcrun altool --upload-app --type ios --file "path/to/archive.ipa" --username "your@email.com" --password "your-app-specific-password"
```

#### TestFlight Setup
1. Log in to App Store Connect
2. Select your app
3. Go to TestFlight tab
4. Add internal or external testers
5. Submit for beta review (external testers)

### Android Deployment

#### Prerequisites
- Android Studio
- Google Play Developer Account ($25 one-time)
- Keystore for signing

#### Build Release APK/AAB

1. **Generate Keystore** (if not exists)
```bash
keytool -genkey -v -keystore golden-passage.keystore -alias goldenpassage -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Signing**
Create `android/keystore.properties`:
```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=goldenpassage
storeFile=golden-passage.keystore
```

3. **Build Release**
```bash
cd mobile/android

# Build APK
./gradlew assembleRelease

# Build AAB (recommended for Play Store)
./gradlew bundleRelease
```

4. **Upload to Play Store**
- Log in to Google Play Console
- Create new release
- Upload AAB file
- Fill in release notes
- Submit for review

#### Internal Testing
1. Go to Google Play Console
2. Select Internal Testing
3. Upload AAB
4. Add testers by email
5. Share opt-in link

## CI/CD Pipeline Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../web && npm ci
          
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../web && npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
        
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          docker build -t $ECR_REGISTRY/golden-passage-api:${{ github.sha }} ./backend
          docker push $ECR_REGISTRY/golden-passage-api:${{ github.sha }}
          
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster golden-passage --service api --force-new-deployment

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Build web app
        run: |
          cd web
          npm ci
          npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
          
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --acl public-read --follow-symlinks --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: 'web/dist'
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: ""

test:backend:
  stage: test
  image: node:18
  script:
    - cd backend
    - npm ci
    - npm test

test:web:
  stage: test
  image: node:18
  script:
    - cd web
    - npm ci
    - npm test

build:backend:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHA ./backend
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHA

build:web:
  stage: build
  image: node:18
  script:
    - cd web
    - npm ci
    - npm run build
  artifacts:
    paths:
      - web/dist

deploy:production:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
    - chmod +x ./kubectl
    - mv ./kubectl /usr/local/bin/kubectl
    - kubectl set image deployment/api api=$CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHA
  environment:
    name: production
  only:
    - main
```

## Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Database: Check connection pool
- Redis: Check connection status

### Logging
- Application logs: Docker logs or cloud provider logs
- Error tracking: Sentry integration
- Performance monitoring: New Relic or DataDog

### Backup Strategy
```bash
# Database backup
docker-compose exec postgres pg_dump -U postgres golden_passage > backup_$(date +%Y%m%d).sql

# Automated daily backups (cron)
0 2 * * * /path/to/backup-script.sh
```

### Scaling
- Horizontal: Increase container replicas
- Vertical: Increase CPU/memory allocation
- Database: Read replicas for analytics queries

### Security Updates
```bash
# Update dependencies
npm audit fix

# Update Docker images
docker-compose pull
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify connection string
   - Check firewall rules

2. **Redis Connection Failed**
   - Verify Redis is running
   - Check Redis configuration

3. **AI Features Not Working**
   - Verify Azure OpenAI credentials
   - Check API quotas and limits

4. **Payment Processing Failed**
   - Verify Stripe/PayPal credentials
   - Check webhook configuration

### Support Contacts
- Technical Support: support@goldenpassage.com
- Emergency: +1-xxx-xxx-xxxx
