# Deployment Guide

This guide covers deploying the E-Commerce platform using **Railway** (backend) and **Vercel** (frontend).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        VERCEL (Frontend)                        │
├─────────────┬─────────────┬─────────────┬──────────────────────┤
│  Shell App  │  Admin App  │ Seller App  │   Storefront App     │
│  (React)    │  (Vite)     │  (Vite)     │   (Next.js)          │
└──────┬──────┴──────┬──────┴──────┬──────┴──────────┬───────────┘
       │             │             │                  │
       └─────────────┴──────┬──────┴──────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RAILWAY (Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│                    GraphQL Gateway                               │
├──────────┬──────────┬──────────┬──────────┬────────────────────┤
│   Auth   │ Product  │  Order   │ Category │      Coupon        │
│ Service  │ Service  │ Service  │ Service  │     Service        │
└──────────┴──────────┴──────────┴──────────┴────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Database)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account or sign in
3. Create a new project: `ecommerce-platform`

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose **M0 Free Tier** (or M10+ for production)
3. Select your preferred region
4. Click "Create"

### 1.3 Configure Access
1. Go to **Database Access** → Add Database User
   - Username: `ecommerce-admin`
   - Password: (generate a strong password)
   - Role: `Atlas Admin`

2. Go to **Network Access** → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Railway's IP ranges for production

### 1.4 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://ecommerce-admin:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

---

## Step 2: Railway Backend Deployment

### 2.1 Create Railway Account
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `E-Commerce-Microservices-Platform`

### 2.3 Deploy Backend Services

For each service, create a new service in Railway:

#### Auth Service
1. Click "New Service" → "GitHub Repo"
2. Select your repo
3. Set **Root Directory**: `services/auth-service`
4. Add Environment Variables:
   ```
   PORT=3010
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-256-bit-secret>
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET=<generate-another-256-bit-secret>
   JWT_REFRESH_EXPIRES_IN=7d
   ALLOWED_ORIGINS=https://your-storefront.vercel.app,https://your-admin.vercel.app,https://your-seller.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=noreply@yourdomain.com
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=https://your-storefront.vercel.app
   ADMIN_URL=https://your-admin.vercel.app
   SELLER_URL=https://your-seller.vercel.app
   LOG_LEVEL=info
   ENABLE_FILE_LOGGING=false
   ```

#### Product Service
1. New Service → Root Directory: `services/product-service`
2. Environment Variables:
   ```
   PORT=3011
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<same-jwt-secret-as-auth>
   ALLOWED_ORIGINS=https://your-storefront.vercel.app,https://your-admin.vercel.app,https://your-seller.vercel.app
   LOG_LEVEL=info
   ENABLE_FILE_LOGGING=false
   ```

#### Order Service
1. New Service → Root Directory: `services/order-service`
2. Environment Variables:
   ```
   PORT=3012
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<same-jwt-secret-as-auth>
   ALLOWED_ORIGINS=https://your-storefront.vercel.app,https://your-admin.vercel.app,https://your-seller.vercel.app
   LOG_LEVEL=info
   ENABLE_FILE_LOGGING=false
   ```

#### Category Service
1. New Service → Root Directory: `services/category-service`
2. Environment Variables:
   ```
   PORT=3013
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   ALLOWED_ORIGINS=https://your-storefront.vercel.app,https://your-admin.vercel.app,https://your-seller.vercel.app
   LOG_LEVEL=info
   ENABLE_FILE_LOGGING=false
   ```

#### Coupon Service
1. New Service → Root Directory: `services/coupon-service`
2. Environment Variables:
   ```
   PORT=3014
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<same-jwt-secret-as-auth>
   ALLOWED_ORIGINS=https://your-storefront.vercel.app,https://your-admin.vercel.app,https://your-seller.vercel.app
   LOG_LEVEL=info
   ENABLE_FILE_LOGGING=false
   ```

#### GraphQL Gateway
1. New Service → Root Directory: `services/graphql-gateway`
2. Environment Variables:
   ```
   PORT=4000
   NODE_ENV=production
   AUTH_SERVICE_URL=https://auth-service-xxx.railway.app
   PRODUCT_SERVICE_URL=https://product-service-xxx.railway.app
   ORDER_SERVICE_URL=https://order-service-xxx.railway.app
   CATEGORY_SERVICE_URL=https://category-service-xxx.railway.app
   COUPON_SERVICE_URL=https://coupon-service-xxx.railway.app
   ALLOWED_ORIGINS=https://your-storefront.vercel.app,https://your-admin.vercel.app,https://your-seller.vercel.app
   LOG_LEVEL=info
   ENABLE_FILE_LOGGING=false
   ```

### 2.4 Get Service URLs
After deployment, Railway provides URLs like:
- `auth-service-production.up.railway.app`
- `product-service-production.up.railway.app`
- etc.

Update the **GraphQL Gateway** with these URLs.

---

## Step 3: Vercel Frontend Deployment

### 3.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub

### 3.2 Deploy Storefront App
1. Click "Add New" → "Project"
2. Import `E-Commerce-Microservices-Platform`
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/storefront-app`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_ENV=production
   NEXT_PUBLIC_GRAPHQL_URL=https://graphql-gateway-xxx.railway.app/graphql
   NEXT_PUBLIC_AUTH_API_URL=https://auth-service-xxx.railway.app
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```
5. Click "Deploy"

### 3.3 Deploy Admin App
1. Add New Project → Same repo
2. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/admin-app`
3. Environment Variables:
   ```
   VITE_ENV=production
   VITE_GRAPHQL_URL=https://graphql-gateway-xxx.railway.app/graphql
   VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   ```

### 3.4 Deploy Seller App
1. Add New Project → Same repo
2. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/seller-app`
3. Environment Variables:
   ```
   VITE_ENV=production
   VITE_AUTH_API=https://auth-service-xxx.railway.app
   VITE_PRODUCT_API=https://product-service-xxx.railway.app
   VITE_ORDER_API=https://order-service-xxx.railway.app
   VITE_CATEGORY_API=https://category-service-xxx.railway.app
   VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   VITE_SHELL_APP_URL=https://shell-app-xxx.vercel.app
   ```

### 3.5 Deploy Shell App
1. Add New Project → Same repo
2. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/shell-app`
   - **Build Command**: `yarn build`
   - **Output Directory**: `dist`
3. Environment Variables:
   ```
   NODE_ENV=production
   GRAPHQL_URL=https://graphql-gateway-xxx.railway.app/graphql
   ADMIN_APP_URL=https://admin-app-xxx.vercel.app
   SELLER_APP_URL=https://seller-app-xxx.vercel.app
   ```

---

## Step 4: Update CORS Settings

After all deployments, update the `ALLOWED_ORIGINS` in each Railway service with the actual Vercel URLs:

```
ALLOWED_ORIGINS=https://storefront-xxx.vercel.app,https://admin-xxx.vercel.app,https://seller-xxx.vercel.app,https://shell-xxx.vercel.app
```

---

## Step 5: Custom Domains (Optional)

### Vercel Custom Domains
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Railway Custom Domains
1. Go to Service Settings → Domains
2. Add custom domain
3. Update DNS records

---

## Environment Variables Quick Reference

### Backend Services (Railway)

| Variable | Auth | Product | Order | Category | Coupon | Gateway |
|----------|------|---------|-------|----------|--------|---------|
| PORT | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| NODE_ENV | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| MONGODB_URI | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| JWT_SECRET | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| ALLOWED_ORIGINS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| LOG_LEVEL | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Frontend Apps (Vercel)

| Variable | Storefront | Admin | Seller | Shell |
|----------|------------|-------|--------|-------|
| GRAPHQL_URL | ✅ | ✅ | ❌ | ✅ |
| AUTH_API | ✅ | ❌ | ✅ | ❌ |
| CLOUDINARY | ❌ | ✅ | ✅ | ❌ |
| GOOGLE_CLIENT_ID | ✅ | ❌ | ❌ | ❌ |

---

## Troubleshooting

### Railway Build Fails
- Check the build logs for specific errors
- Ensure all workspace dependencies are correctly referenced
- Verify the root directory is set correctly

### Vercel Build Fails
- Check that shared packages build first
- Verify environment variables are set
- Check for TypeScript errors

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes all frontend URLs
- Check that URLs don't have trailing slashes
- Verify the protocol (https vs http)

### Database Connection Issues
- Verify MongoDB Atlas whitelist includes Railway IPs
- Check connection string format
- Ensure database user has correct permissions

---

## Monitoring & Logs

### Railway
- View logs: Service → Logs tab
- Monitor metrics: Service → Metrics tab

### Vercel
- View deployment logs: Project → Deployments
- Runtime logs: Project → Logs

### MongoDB Atlas
- Monitor performance: Cluster → Metrics
- View slow queries: Performance Advisor

---

## Cost Estimation

### Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| Railway | $5/month credit, 500 execution hours |
| Vercel | 100GB bandwidth, serverless functions |
| MongoDB Atlas | M0 cluster (512MB storage) |

### Production Recommendations

| Service | Recommended Plan | Estimated Cost |
|---------|------------------|----------------|
| Railway | Developer ($20/mo) | ~$40-60/month (6 services) |
| Vercel | Pro ($20/mo) | ~$20/month |
| MongoDB Atlas | M10 ($57/mo) | ~$57/month |
| **Total** | | **~$120-140/month** |
