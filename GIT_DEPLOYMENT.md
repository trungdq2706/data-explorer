# Git & GitHub Deployment Guide

## Step 1: Install Git

**Windows:**
- Download từ https://git-scm.com/download/win
- Install với default settings

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

---

## Step 2: Setup GitHub

1. Tạo account tại https://github.com
2. Tạo new repository:
   - Name: `data-explorer` (hoặc tên khác)
   - Description: "Data Explorer Dashboard"
   - Public (để có thể deploy free)
   - Click "Create repository"

3. Copy HTTPS URL (vd: `https://github.com/yourname/data-explorer.git`)

---

## Step 3: Push Code to GitHub

```bash
# 1. Navigate to project
cd "C:\Web báo cáo"

# 2. Initialize git (nếu chưa có)
git init

# 3. Add remote
git remote add origin https://github.com/yourname/data-explorer.git

# 4. Add all files
git add .

# 5. First commit
git commit -m "Initial commit: Data Explorer App"

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy from GitHub

### Option A: Vercel (Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel

1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Click "New Project"
4. Select your GitHub repo
5. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
     ```
6. Click "Deploy"

**Result:** Frontend at `https://your-domain.vercel.app/s/demo123`

---

#### Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect GitHub account
5. Select your repo
6. Configure:
   - Root Directory: `backend`
   - Environment Variables:
     ```
     DEBUG=False
     LOG_LEVEL=INFO
     ```
7. Click "Deploy"

**Result:** Backend at `https://your-backend.up.railway.app`

---

### Option B: Docker Hub + Deploy to Any VPS

1. Push Docker image to Docker Hub
2. SSH to VPS and run:
```bash
docker pull yourusername/data-explorer-backend
docker pull yourusername/data-explorer-frontend
docker run -d -p 8000:8000 yourusername/data-explorer-backend
docker run -d -p 3000:3000 yourusername/data-explorer-frontend
```

---

### Option C: GitHub Actions (Auto Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## Step 5: Update After Changes

```bash
# Make changes
# ...

# Commit
git add .
git commit -m "Fix: Update API endpoint"

# Push
git push origin main

# Auto-deploys on Vercel & Railway!
```

---

## Environment Setup

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-url
```

### Backend (.env)
```
DEBUG=False
LOG_LEVEL=INFO
SHARE_TOKENS=demo123,prod_token_456
GCP_PROJECT_ID=your-project
BIGQUERY_DATASET=your-dataset
CORS_ORIGINS=https://your-domain.com
```

---

## Troubleshooting

**Lỗi CORS?**
- Update `CORS_ORIGINS` trong backend `config.py`

**Lỗi 401 Unauthorized?**
- Check token config
- Verify frontend URL matches CORS settings

**Lỗi timeout?**
- Tăng timeout trong frontend config
- Check backend logs

---

## Monitoring

- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app/dashboard
- GitHub: https://github.com/yourname/data-explorer/deployments

---

## Rollback

```bash
# View commit history
git log

# Rollback to previous version
git reset --hard <commit-hash>
git push -f origin main

# Auto-redeploys previous version
```

---

## Performance Tips

1. **Frontend**
   - Enable image optimization
   - Use static generation where possible
   - Minify code

2. **Backend**
   - Use connection pooling
   - Add caching headers
   - Monitor query performance

3. **Database**
   - Create indexes
   - Use read replicas
   - Archive old data
