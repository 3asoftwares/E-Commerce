# 🚀 Deployment Options for E-Commerce Microservices

> Alternative deployment strategies for the 3A Softwares monorepo platform

## 📋 Table of Contents

- [Overview](#-overview)
- [Option 1: Railway](#-option-1-railway-recommended)
- [Option 2: Render](#-option-2-render)
- [Option 3: DigitalOcean App Platform](#-option-3-digitalocean-app-platform)
- [Option 4: AWS (ECS/EKS)](#-option-4-aws-ecseks)
- [Option 5: Google Cloud Run](#-option-5-google-cloud-run)
- [Option 6: Azure Container Apps](#-option-6-azure-container-apps)
- [Option 7: Fly.io](#-option-7-flyio)
- [Option 8: Self-Hosted Kubernetes](#-option-8-self-hosted-kubernetes)
- [Comparison Matrix](#-comparison-matrix)
- [Recommended Setup](#-recommended-setup)

---

## 📊 Overview

| Layer | Services | Recommended Platforms |
|-------|----------|----------------------|
| **Frontend** | admin-app, seller-app, shell-app | Netlify, Cloudflare Pages, Railway |
| **Frontend (SSR)** | storefront-app (Next.js) | Railway, Render, Cloud Run |
| **Backend** | 6 microservices | Railway, Render, Cloud Run, ECS |
| **Database** | MongoDB | MongoDB Atlas, Railway, DigitalOcean |
| **Cache** | Redis | Upstash, Railway, Redis Cloud |
| **Gateway** | GraphQL Gateway | Same as backend services |

---

## 🚂 Option 1: Railway (Recommended)

**Best for:** Monorepos, easy setup, automatic deployments

### Why Railway?

- ✅ **Native monorepo support** with root directory configuration
- ✅ Automatic deployments from GitHub
- ✅ Built-in MongoDB and Redis
- ✅ Per-service scaling
- ✅ Environment variable management
- ✅ $5/month hobby plan, pay-as-you-go

### Setup

#### 1. Create `railway.json` in root

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 2. Create service-specific configs

**services/auth-service/railway.json**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "yarn install && yarn build"
  },
  "deploy": {
    "startCommand": "yarn start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

#### 3. Deploy via CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy each service
cd services/auth-service && railway up
cd services/product-service && railway up
cd services/order-service && railway up
cd services/category-service && railway up
cd services/coupon-service && railway up
cd services/graphql-gateway && railway up

# Deploy frontend apps
cd apps/admin-app && railway up
cd apps/seller-app && railway up
cd apps/shell-app && railway up
cd apps/storefront-app && railway up
```

#### 4. Railway GitHub Actions

```yaml
# .github/workflows/railway-deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy-services:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          - { path: services/auth-service, name: auth-service }
          - { path: services/product-service, name: product-service }
          - { path: services/order-service, name: order-service }
          - { path: services/category-service, name: category-service }
          - { path: services/coupon-service, name: coupon-service }
          - { path: services/graphql-gateway, name: graphql-gateway }
    steps:
      - uses: actions/checkout@v4
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      - name: Deploy ${{ matrix.service.name }}
        run: |
          cd ${{ matrix.service.path }}
          railway up --service ${{ matrix.service.name }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-services
    strategy:
      matrix:
        app:
          - { path: apps/admin-app, name: admin-app }
          - { path: apps/seller-app, name: seller-app }
          - { path: apps/shell-app, name: shell-app }
          - { path: apps/storefront-app, name: storefront-app }
    steps:
      - uses: actions/checkout@v4
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      - name: Deploy ${{ matrix.app.name }}
        run: |
          cd ${{ matrix.app.path }}
          railway up --service ${{ matrix.app.name }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Cost Estimate

| Resource | Monthly Cost |
|----------|-------------|
| 6 Backend Services | ~$30-60 |
| 4 Frontend Apps | ~$20-40 |
| MongoDB | ~$10-20 |
| Redis | ~$5-10 |
| **Total** | **~$65-130/month** |

---

## 🎨 Option 2: Render

**Best for:** Simple setup, free tier, blueprint deployments

### Why Render?

- ✅ **Blueprint (render.yaml)** for monorepo deployment
- ✅ Free tier for static sites
- ✅ Auto-scaling
- ✅ Built-in SSL
- ✅ Private networking between services

### Setup

#### 1. Create `render.yaml` in root

```yaml
# render.yaml
services:
  # Backend Services
  - type: web
    name: auth-service
    env: node
    rootDir: services/auth-service
    buildCommand: yarn install && yarn build
    startCommand: yarn start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromDatabase:
          name: mongodb
          property: connectionString
    healthCheckPath: /health

  - type: web
    name: product-service
    env: node
    rootDir: services/product-service
    buildCommand: yarn install && yarn build
    startCommand: yarn start
    envVars:
      - key: NODE_ENV
        value: production
      - key: REDIS_URL
        fromService:
          name: redis
          type: redis
          property: connectionString

  - type: web
    name: order-service
    env: node
    rootDir: services/order-service
    buildCommand: yarn install && yarn build
    startCommand: yarn start

  - type: web
    name: category-service
    env: node
    rootDir: services/category-service
    buildCommand: yarn install && yarn build
    startCommand: yarn start

  - type: web
    name: coupon-service
    env: node
    rootDir: services/coupon-service
    buildCommand: yarn install && yarn build
    startCommand: yarn start

  - type: web
    name: graphql-gateway
    env: node
    rootDir: services/graphql-gateway
    buildCommand: yarn install && yarn build
    startCommand: yarn start
    envVars:
      - key: AUTH_SERVICE_URL
        fromService:
          name: auth-service
          type: web
          property: host
      - key: PRODUCT_SERVICE_URL
        fromService:
          name: product-service
          type: web
          property: host

  # Frontend Apps
  - type: web
    name: storefront-app
    env: node
    rootDir: apps/storefront-app
    buildCommand: yarn install && yarn build
    startCommand: yarn start

  - type: static
    name: admin-app
    rootDir: apps/admin-app
    buildCommand: yarn install && yarn build
    staticPublishPath: dist
    headers:
      - path: /*
        name: Cache-Control
        value: public, max-age=31536000

  - type: static
    name: seller-app
    rootDir: apps/seller-app
    buildCommand: yarn install && yarn build
    staticPublishPath: dist

  - type: static
    name: shell-app
    rootDir: apps/shell-app
    buildCommand: yarn install && yarn build
    staticPublishPath: dist

# Databases
databases:
  - name: mongodb
    databaseName: ecommerce
    plan: starter

# Redis Cache
  - name: redis
    type: redis
    plan: starter
```

#### 2. Deploy via Dashboard

1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Select "Blueprint" deployment
4. Render auto-detects `render.yaml`
5. Review and deploy all services

### Cost Estimate

| Resource | Monthly Cost |
|----------|-------------|
| 6 Web Services (Starter) | ~$42 ($7 each) |
| 3 Static Sites | Free |
| 1 Web Service (Next.js) | ~$7 |
| MongoDB Starter | ~$7 |
| Redis Starter | ~$10 |
| **Total** | **~$66/month** |

---

## 🌊 Option 3: DigitalOcean App Platform

**Best for:** Predictable pricing, good documentation

### Setup

#### 1. Create `.do/app.yaml`

```yaml
# .do/app.yaml
name: 3asoftwares-ecommerce
region: nyc
features:
  - buildpack-stack=ubuntu-22

services:
  - name: auth-service
    source_dir: services/auth-service
    github:
      repo: 3asoftwares/e-commerce
      branch: main
      deploy_on_push: true
    build_command: yarn install && yarn build
    run_command: yarn start
    http_port: 4001
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production

  - name: product-service
    source_dir: services/product-service
    github:
      repo: 3asoftwares/e-commerce
      branch: main
    build_command: yarn install && yarn build
    run_command: yarn start
    http_port: 4002
    instance_size_slug: basic-xxs

  - name: order-service
    source_dir: services/order-service
    github:
      repo: 3asoftwares/e-commerce
      branch: main
    build_command: yarn install && yarn build
    run_command: yarn start
    http_port: 4003
    instance_size_slug: basic-xxs

  - name: category-service
    source_dir: services/category-service
    github:
      repo: 3asoftwares/e-commerce
      branch: main
    build_command: yarn install && yarn build
    run_command: yarn start
    http_port: 4004
    instance_size_slug: basic-xxs

  - name: coupon-service
    source_dir: services/coupon-service
    github:
      repo: 3asoftwares/e-commerce
      branch: main
    build_command: yarn install && yarn build
    run_command: yarn start
    http_port: 4005
    instance_size_slug: basic-xxs

  - name: graphql-gateway
    source_dir: services/graphql-gateway
    github:
      repo: 3asoftwares/e-commerce
      branch: main
    build_command: yarn install && yarn build
    run_command: yarn start
    http_port: 4000
    instance_size_slug: basic-xs
    routes:
      - path: /graphql

  - name: storefront
    source_dir: apps/storefront-app
    github:
      repo: 3asoftwares/e-commerce
      branch: main
    build_command: yarn install && yarn build
    run_command: yarn start
    http_port: 3003
    instance_size_slug: basic-xs
    routes:
      - path: /

static_sites:
  - name: admin-app
    source_dir: apps/admin-app
    github:
      repo: 3asoftwares/e-commerce
      branch: main
    build_command: yarn install && yarn build
    output_dir: dist

  - name: seller-app
    source_dir: apps/seller-app
    github:
      repo: 3asoftwares/e-commerce
      branch: main
    build_command: yarn install && yarn build
    output_dir: dist

  - name: shell-app
    source_dir: apps/shell-app
    github:
      repo: 3asoftwares/e-commerce
      branch: main
    build_command: yarn install && yarn build
    output_dir: dist

databases:
  - name: mongodb
    engine: MONGODB
    production: false
    cluster_name: ecommerce-db
```

#### 2. Deploy via CLI

```bash
# Install doctl
brew install doctl  # macOS
# or download from DigitalOcean

# Authenticate
doctl auth init

# Create app
doctl apps create --spec .do/app.yaml

# Update app
doctl apps update <app-id> --spec .do/app.yaml
```

### Cost Estimate

| Resource | Monthly Cost |
|----------|-------------|
| 5 Basic XXS ($5 each) | $25 |
| 2 Basic XS ($10 each) | $20 |
| 3 Static Sites | Free |
| MongoDB Starter | $15 |
| **Total** | **~$60/month** |

---

## ☁️ Option 4: AWS (ECS/EKS)

**Best for:** Enterprise, full control, existing AWS infrastructure

### Option 4A: AWS ECS with Fargate

#### 1. Create `aws/task-definitions/auth-service.json`

```json
{
  "family": "auth-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "auth-service",
      "image": "ACCOUNT.dkr.ecr.REGION.amazonaws.com/auth-service:latest",
      "portMappings": [
        {
          "containerPort": 4001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" },
        { "name": "PORT", "value": "4001" }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:mongodb-uri"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/auth-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:4001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

#### 2. GitHub Actions for ECS

```yaml
# .github/workflows/aws-ecs-deploy.yml
name: Deploy to AWS ECS

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          - auth-service
          - product-service
          - order-service
          - category-service
          - coupon-service
          - graphql-gateway
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and push Docker image
        run: |
          docker build -t $ECR_REGISTRY/${{ matrix.service }}:${{ github.sha }} \
            -f services/${{ matrix.service }}/Dockerfile \
            services/${{ matrix.service }}
          docker push $ECR_REGISTRY/${{ matrix.service }}:${{ github.sha }}
          docker tag $ECR_REGISTRY/${{ matrix.service }}:${{ github.sha }} \
            $ECR_REGISTRY/${{ matrix.service }}:latest
          docker push $ECR_REGISTRY/${{ matrix.service }}:latest
      
      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster ecommerce-cluster \
            --service ${{ matrix.service }} \
            --force-new-deployment
```

### Option 4B: AWS EKS (Kubernetes)

Use the existing k8s/ configurations with EKS:

```bash
# Create EKS cluster
eksctl create cluster \
  --name ecommerce-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3

# Apply Kubernetes configs
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/apps/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress.yaml
```

### Cost Estimate (AWS)

| Resource | Monthly Cost |
|----------|-------------|
| ECS Fargate (6 services) | ~$50-100 |
| ALB | ~$20 |
| ECR | ~$5 |
| DocumentDB or Atlas | ~$50+ |
| ElastiCache Redis | ~$15+ |
| **Total** | **~$140-200/month** |

---

## 🏃 Option 5: Google Cloud Run

**Best for:** Serverless containers, pay-per-request, auto-scaling to zero

### Setup

#### 1. Create `cloudbuild.yaml`

```yaml
# cloudbuild.yaml
steps:
  # Build and push auth-service
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/auth-service:$COMMIT_SHA'
      - '-f'
      - 'services/auth-service/Dockerfile'
      - 'services/auth-service'
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/auth-service:$COMMIT_SHA']
  
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'auth-service'
      - '--image'
      - 'gcr.io/$PROJECT_ID/auth-service:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--port'
      - '4001'
      - '--set-env-vars'
      - 'NODE_ENV=production'

  # Repeat for other services...
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/product-service:$COMMIT_SHA'
      - '-f'
      - 'services/product-service/Dockerfile'
      - 'services/product-service'

  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/product-service:$COMMIT_SHA']

  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'product-service'
      - '--image'
      - 'gcr.io/$PROJECT_ID/product-service:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'

images:
  - 'gcr.io/$PROJECT_ID/auth-service:$COMMIT_SHA'
  - 'gcr.io/$PROJECT_ID/product-service:$COMMIT_SHA'
```

#### 2. Service YAML (Declarative)

```yaml
# cloudrun/auth-service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: auth-service
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "0"
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containerConcurrency: 80
      containers:
        - image: gcr.io/PROJECT_ID/auth-service:latest
          ports:
            - containerPort: 4001
          env:
            - name: NODE_ENV
              value: production
          resources:
            limits:
              cpu: "1"
              memory: 512Mi
```

### Cost Estimate

| Resource | Monthly Cost |
|----------|-------------|
| Cloud Run (pay per request) | ~$20-50 |
| Cloud SQL / MongoDB Atlas | ~$30-50 |
| Memorystore Redis | ~$30 |
| Cloud Build | ~$5 |
| **Total** | **~$85-135/month** |

---

## 🔷 Option 6: Azure Container Apps

**Best for:** Microsoft ecosystem, .NET + Node.js mix

### Setup

```yaml
# azure/container-apps.yaml
name: ecommerce
resourceGroup: ecommerce-rg
location: eastus

containerApps:
  - name: auth-service
    image: ecommerceacr.azurecr.io/auth-service:latest
    targetPort: 4001
    ingress:
      external: true
    scale:
      minReplicas: 1
      maxReplicas: 5
    env:
      - name: NODE_ENV
        value: production

  - name: product-service
    image: ecommerceacr.azurecr.io/product-service:latest
    targetPort: 4002
    ingress:
      external: false  # Internal only
    scale:
      minReplicas: 0
      maxReplicas: 10
```

### Cost Estimate

| Resource | Monthly Cost |
|----------|-------------|
| Container Apps | ~$50-100 |
| Azure Cosmos DB | ~$25+ |
| Azure Cache for Redis | ~$15 |
| **Total** | **~$90-140/month** |

---

## 🪁 Option 7: Fly.io

**Best for:** Edge deployment, global distribution, simple config

### Setup

#### 1. Create `fly.toml` for each service

**services/auth-service/fly.toml**
```toml
app = "3asoftwares-auth-service"
primary_region = "iad"

[build]
  builder = "heroku/buildpacks:20"

[env]
  NODE_ENV = "production"
  PORT = "4001"

[http_service]
  internal_port = 4001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1

[[services]]
  protocol = "tcp"
  internal_port = 4001

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [[services.http_checks]]
    interval = "10s"
    timeout = "2s"
    path = "/health"
```

#### 2. Deploy script

```bash
#!/bin/bash
# scripts/fly-deploy.sh

SERVICES=(
  "services/auth-service"
  "services/product-service"
  "services/order-service"
  "services/category-service"
  "services/coupon-service"
  "services/graphql-gateway"
)

for service in "${SERVICES[@]}"; do
  echo "Deploying $service..."
  cd $service
  fly deploy
  cd ../..
done
```

### Cost Estimate

| Resource | Monthly Cost |
|----------|-------------|
| 6 Fly Machines (shared-cpu-1x) | ~$30 |
| 4 Frontend Apps | ~$15 |
| Fly Postgres | ~$7 |
| Upstash Redis | ~$10 |
| **Total** | **~$62/month** |

---

## 🖥️ Option 8: Self-Hosted Kubernetes

**Best for:** Full control, existing infrastructure, compliance requirements

Use the existing `k8s/` directory configurations with:

- **Bare metal**: k3s, microk8s
- **VPS providers**: Hetzner, Linode, Vultr
- **On-premise**: kubeadm, Rancher

```bash
# Using k3s on a VPS
curl -sfL https://get.k3s.io | sh -

# Apply configurations
kubectl apply -f k8s/
```

### Cost Estimate (Hetzner)

| Resource | Monthly Cost |
|----------|-------------|
| 3x CX21 (2 vCPU, 4GB) | ~$18 |
| MongoDB (self-hosted) | $0 |
| Redis (self-hosted) | $0 |
| Load Balancer | ~$5 |
| **Total** | **~$23/month** |

---

## 📊 Comparison Matrix

| Platform | Monorepo Support | Ease of Setup | Cost | Scaling | Best For |
|----------|-----------------|---------------|------|---------|----------|
| **Railway** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $$ | Auto | Startups, rapid dev |
| **Render** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $$ | Auto | Small teams |
| **DigitalOcean** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$ | Manual | Predictable costs |
| **AWS ECS** | ⭐⭐⭐ | ⭐⭐ | $$$ | Auto | Enterprise |
| **Cloud Run** | ⭐⭐⭐⭐ | ⭐⭐⭐ | $ | Auto | Serverless |
| **Azure** | ⭐⭐⭐ | ⭐⭐⭐ | $$$ | Auto | MS ecosystem |
| **Fly.io** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $ | Auto | Edge/Global |
| **K8s (self)** | ⭐⭐⭐⭐⭐ | ⭐ | $ | Manual | Full control |

---

## 🎯 Recommended Setup

### For Development/Staging
```
Frontend (Static): Cloudflare Pages (Free)
Frontend (SSR): Railway ($7/service)
Backend: Railway ($7/service)
Database: MongoDB Atlas (Free tier)
Cache: Upstash Redis (Free tier)
```

### For Production (Small-Medium)
```
Frontend (Static): Cloudflare Pages
Frontend (SSR): Render or Railway
Backend: Render or Railway
Database: MongoDB Atlas M10 ($57/month)
Cache: Redis Cloud or Upstash
Total: ~$100-150/month
```

### For Production (Enterprise)
```
Frontend: Cloudflare Pages + Workers
Backend: AWS ECS Fargate or GKE
Database: MongoDB Atlas or DocumentDB
Cache: ElastiCache or Memorystore
CDN: CloudFront or Cloudflare
Total: ~$300-500/month
```

---

## 📚 Related Documentation

- [Docker Guide](DOCKER_GUIDE.md)
- [Kubernetes Setup](../k8s/README.md)
- [CI/CD Pipeline](CI_CD_PIPELINE.md)
- [Architecture](ARCHITECTURE.md)
