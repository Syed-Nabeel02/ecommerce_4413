# Deployment Guide - E-Commerce Application

Complete guide to deploy your Spring Boot + React e-commerce application using:
- **Railway** (Backend)
- **Neon** (PostgreSQL Database)
- **Cloudinary** (Image Storage)
- **Netlify** (Frontend)

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Set Up Neon Database](#step-1-set-up-neon-database)
3. [Step 2: Set Up Cloudinary](#step-2-set-up-cloudinary)
4. [Step 3: Deploy Backend to Railway](#step-3-deploy-backend-to-railway)
5. [Step 4: Deploy Frontend to Netlify](#step-4-deploy-frontend-to-netlify)
6. [Step 5: Testing](#step-5-testing)
7. [Troubleshooting](#troubleshooting)
8. [Environment Variables Reference](#environment-variables-reference)

---

## Prerequisites

Before starting, ensure you have:
- [ ] GitHub account
- [ ] Git installed locally
- [ ] Your code pushed to a GitHub repository
- [ ] Credit card (for service verification - **all services are free tier**)

---

## Step 1: Set Up Neon Database

### 1.1 Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Click **Sign Up** (use GitHub for easy login)
3. Verify your email

### 1.2 Create Database

1. Click **Create Project**
2. Configure:
   - **Project Name**: `ecommerce-db` (or your preference)
   - **Database Name**: `ecommerce`
   - **Region**: Choose closest to your users (e.g., US East)
   - **PostgreSQL Version**: 16 (latest)
3. Click **Create Project**

### 1.3 Get Connection Details

1. After creation, you'll see the **Connection Details** page
2. Copy the **Connection string** (should look like):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/ecommerce?sslmode=require
   ```
3. **IMPORTANT**: Save these separately:
   - **Host**: `ep-xxx-xxx.us-east-2.aws.neon.tech`
   - **Database**: `ecommerce`
   - **Username**: (shown in dashboard)
   - **Password**: (shown in dashboard)
   - **Full Connection String**: (entire URL above)

### 1.4 Initialize Database Schema

1. In Neon dashboard, click **SQL Editor**
2. Copy and paste the contents of your `db-init/01-init-data.sql` file
3. Click **Run** to create tables and seed data
4. Verify tables were created by running:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

✅ **Checkpoint**: You should see tables like `users`, `products`, `categories`, `orders`, etc.

---

## Step 2: Set Up Cloudinary

### 2.1 Create Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up with email or Google
3. Verify your email

### 2.2 Get API Credentials

1. After login, you'll be on the **Dashboard**
2. In the **Account Details** section, you'll see:
   - **Cloud Name**: `dxxxxx` (copy this)
   - **API Key**: `123456789012345` (copy this)
   - **API Secret**: `xxxxxxxxxxxxxxxxxxxx` (click "Show" then copy)

3. **IMPORTANT**: Save these credentials:
   ```
   CLOUDINARY_CLOUD_NAME=dxxxxx
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxx
   ```

### 2.3 Configure Upload Preset (Optional)

1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `ecommerce-products`
   - **Signing mode**: Signed (recommended for security)
   - **Folder**: `products`
5. Click **Save**

✅ **Checkpoint**: You have your Cloud Name, API Key, and API Secret saved

---

## Step 3: Deploy Backend to Railway

### 3.1 Prepare Your Repository

1. Ensure your code is pushed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. Make sure your `.gitignore` excludes:
   ```
   .env
   target/
   *.log
   ```

### 3.2 Create Railway Account

1. Go to [https://railway.app](https://railway.app)
2. Click **Login with GitHub**
3. Authorize Railway to access your repositories

### 3.3 Create New Project

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository: `ecomrevert` (or your repo name)
4. Railway will detect it's a Java/Maven project

### 3.4 Configure Build Settings

1. Click on your deployed service
2. Go to **Settings** tab
3. Configure:
   - **Root Directory**: `ecommerce-backend`
   - **Build Command**: (leave default - Railway auto-detects Maven)
   - **Start Command**: `java -jar target/*.jar`
   - **Port**: Railway will auto-detect from `server.port=5000`

### 3.5 Add Environment Variables

1. Click **Variables** tab
2. Click **New Variable** and add each of these:

```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xxx-xxx.us-east-2.aws.neon.tech/ecommerce?sslmode=require
SPRING_DATASOURCE_USERNAME=your-neon-username
SPRING_DATASOURCE_PASSWORD=your-neon-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxx

# Frontend URL (temporary - update after Netlify deployment)
FRONTEND_URL=https://localhost:5173

# Image settings (kept for backwards compatibility)
PROJECT_IMAGE=products/
IMAGE_BASE_URL=https://your-app.up.railway.app/images

# AWS (not used, but kept to avoid errors)
AWS_S3_BUCKET_NAME=ecommerce-product-images
AWS_REGION=us-east-2
```

3. Click **Add** for each variable

### 3.6 Deploy

1. Railway will automatically deploy after you add variables
2. Watch the **Deployments** tab for build progress
3. Wait for deployment to complete (5-10 minutes for first build)

### 3.7 Get Backend URL

1. Go to **Settings** tab
2. Scroll to **Domains** section
3. Click **Generate Domain**
4. Railway will generate a URL like: `https://your-app.up.railway.app`
5. **SAVE THIS URL** - you'll need it for frontend configuration

### 3.8 Test Backend

1. Open: `https://your-app.up.railway.app/api/public/products`
2. You should see JSON response with products
3. Test Swagger UI: `https://your-app.up.railway.app/swagger-ui/index.html`

✅ **Checkpoint**: Backend is running and returning data

---

## Step 4: Deploy Frontend to Netlify

### 4.1 Update Frontend Configuration

1. Open `ecom-frontend/.env` locally
2. Update with your Railway backend URL:
   ```env
   VITE_API_URL=https://your-app.up.railway.app
   ```

3. Commit and push:
   ```bash
   git add ecom-frontend/.env
   git commit -m "Update API URL for production"
   git push origin main
   ```

### 4.2 Create Netlify Account

1. Go to [https://app.netlify.com/signup](https://app.netlify.com/signup)
2. Click **Sign up with GitHub**
3. Authorize Netlify

### 4.3 Create New Site

1. Click **Add new site** → **Import an existing project**
2. Click **GitHub**
3. Authorize and select your repository
4. Configure build settings:
   - **Base directory**: `ecom-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `ecom-frontend/dist`

### 4.4 Add Environment Variables

1. Before deploying, click **Show advanced**
2. Click **New variable** and add:
   ```
   VITE_API_URL=https://your-app.up.railway.app
   ```

### 4.5 Deploy

1. Click **Deploy site**
2. Wait for build to complete (2-5 minutes)
3. Netlify will generate a URL like: `https://random-name-123.netlify.app`

### 4.6 Update Backend CORS

1. Go back to **Railway dashboard**
2. Click on your backend service
3. Go to **Variables** tab
4. Update `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://random-name-123.netlify.app
   ```
5. Save - Railway will automatically redeploy

### 4.7 Configure Custom Domain (Optional)

1. In Netlify, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow instructions to add your domain
4. Netlify provides free SSL certificate

✅ **Checkpoint**: Frontend is deployed and can communicate with backend

---

## Step 5: Testing

### 5.1 Test Complete User Flow

1. **Open Frontend**: `https://your-site.netlify.app`

2. **Test Product Listing**:
   - Should see products from database
   - Images should load from Cloudinary (for new uploads)

3. **Test User Registration**:
   - Create a new account
   - Verify you can login

4. **Test Image Upload** (Admin):
   - Login as admin
   - Go to product management
   - Upload a product image
   - Verify image appears (should be Cloudinary URL)
   - Check Cloudinary dashboard - image should appear in "products" folder

5. **Test Shopping Cart**:
   - Add products to cart
   - Update quantities
   - Remove items

6. **Test Checkout**:
   - Complete an order
   - Verify order appears in database

### 5.2 Verify Cloudinary Integration

1. Upload a product image
2. Open browser DevTools → Network tab
3. Find the image request
4. URL should start with: `https://res.cloudinary.com/your-cloud-name/`

### 5.3 Check Database

1. Go to Neon dashboard → SQL Editor
2. Run:
   ```sql
   SELECT * FROM products ORDER BY product_id DESC LIMIT 5;
   ```
3. New product images should have full Cloudinary URLs

✅ **Success**: Application fully deployed and functional!

---

## Troubleshooting

### Backend Issues

#### Build Fails on Railway
**Problem**: Maven build fails

**Solutions**:
1. Check Java version in `pom.xml` matches Railway (use Java 17 or 21)
2. Update `pom.xml`:
   ```xml
   <properties>
       <java.version>17</java.version>
   </properties>
   ```
3. Commit and push

#### Database Connection Error
**Problem**: `Connection refused` or `Authentication failed`

**Solutions**:
1. Verify Neon connection string includes `?sslmode=require`
2. Check username/password are correct
3. Ensure Neon database is running (check dashboard)
4. Verify Railway environment variables are set correctly

#### CORS Error
**Problem**: Frontend can't reach backend

**Solutions**:
1. Check `FRONTEND_URL` in Railway matches Netlify URL exactly
2. Ensure no trailing slash: ✅ `https://site.netlify.app` ❌ `https://site.netlify.app/`
3. Check backend logs in Railway for CORS errors

### Frontend Issues

#### API Calls Fail
**Problem**: Network errors or 404 on API calls

**Solutions**:
1. Verify `VITE_API_URL` in Netlify environment variables
2. Check backend URL is accessible: `curl https://your-app.up.railway.app/api/public/products`
3. Check browser console for actual error

#### Images Don't Load
**Problem**: Product images show broken

**Solutions**:
1. Check Cloudinary credentials in Railway
2. Verify images exist in Cloudinary dashboard
3. For old images, ensure `IMAGE_BASE_URL` is set correctly

### Cloudinary Issues

#### Upload Fails
**Problem**: Image upload returns error

**Solutions**:
1. Verify Cloudinary credentials are correct
2. Check file size (free tier: max 10MB per image)
3. Check allowed formats (jpg, png, webp)
4. Review Railway logs for exact error

#### Images Not Appearing
**Problem**: Upload succeeds but image not visible

**Solutions**:
1. Check Cloudinary dashboard - is image there?
2. Verify URL in database starts with `https://res.cloudinary.com/`
3. Check browser console for CORS/loading errors

---

## Environment Variables Reference

### Railway (Backend)

| Variable | Example | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://ep-xxx.neon.tech/ecommerce?sslmode=require` | Neon database connection |
| `SPRING_DATASOURCE_USERNAME` | `neon_user` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `xxxxx` | Database password |
| `CLOUDINARY_CLOUD_NAME` | `dxxxxx` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `123456789012345` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `xxxxxxxxxxxx` | Cloudinary API secret |
| `FRONTEND_URL` | `https://site.netlify.app` | Your Netlify frontend URL |
| `PROJECT_IMAGE` | `products/` | Image folder path (legacy) |
| `IMAGE_BASE_URL` | `https://app.railway.app/images` | Base URL for images (legacy) |

### Netlify (Frontend)

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `https://your-app.up.railway.app` | Railway backend URL |

---

## Monitoring & Maintenance

### Check Railway Logs
```bash
# In Railway dashboard:
1. Click on your service
2. Click "View Logs"
3. Filter by errors
```

### Check Neon Database Health
```bash
# In Neon dashboard:
1. Go to Monitoring tab
2. Check connection count
3. Review query performance
```

### Monitor Cloudinary Usage
```bash
# In Cloudinary dashboard:
1. Go to "Reports" → "Usage"
2. Check storage: 25GB limit
3. Check bandwidth: 25GB/month limit
4. Check transformations: 25,000/month limit
```

---

## Cost Breakdown (Free Tier Limits)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Railway** | $5 credit/month | ~500 execution hours |
| **Neon** | Free forever | 0.5GB storage, 1 project |
| **Cloudinary** | Free forever | 25GB storage, 25GB bandwidth/month |
| **Netlify** | Free forever | 100GB bandwidth/month, 300 build minutes |

**Total Monthly Cost**: $0 (within free tier limits)

**When to Upgrade**:
- Railway: After $5 credit runs out (~1 month)
- Neon: If you need >0.5GB database
- Cloudinary: If you exceed 25GB storage/bandwidth
- Netlify: If you exceed 100GB bandwidth

---

## Next Steps

After successful deployment:

1. **Set up custom domain** on Netlify
2. **Enable SSL** (Netlify does this automatically)
3. **Set up monitoring** (Railway has built-in monitoring)
4. **Configure backups** (Neon has automatic backups)
5. **Add error tracking** (e.g., Sentry)
6. **Set up CI/CD** (auto-deploy on git push - already enabled!)

---

## Need Help?

- **Railway**: [railway.app/help](https://railway.app/help)
- **Neon**: [neon.tech/docs](https://neon.tech/docs)
- **Cloudinary**: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)

---

## Useful Commands

### Rebuild Backend (Railway)
```bash
# Trigger redeploy in Railway dashboard:
Settings → "Redeploy"
```

### Rebuild Frontend (Netlify)
```bash
# Trigger redeploy in Netlify dashboard:
Deploys → "Trigger deploy"
```

### Clear Cloudinary Cache
```bash
# In Cloudinary dashboard:
Media Library → Select images → "Delete"
```

### Reset Database (Neon)
```bash
# In Neon SQL Editor:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Then re-run db-init/01-init-data.sql
```

---

**Good luck with your deployment! 🚀**