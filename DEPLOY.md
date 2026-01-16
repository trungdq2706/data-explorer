# Deployment Guide

## Tùy chọn 1: Docker Compose (Recommended - Local/VPS)

### Yêu cầu
- Docker & Docker Compose installed

### Deploy
```bash
# 1. Build images
docker-compose build

# 2. Start services
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Access
- Frontend: http://localhost:3000/s/demo123
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Stop
```bash
docker-compose down
```

---

## Tùy chọn 2: Vercel (Frontend) + Railway (Backend)

### Frontend Deployment (Vercel)

1. **Prepare**
   ```bash
   cd frontend
   npm run build
   ```

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com
   - Connect GitHub account
   - Select `frontend` folder as root
   - Set environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.railway.app
     ```
   - Deploy

### Backend Deployment (Railway)

1. **Prepare**
   ```bash
   cd backend
   ```

2. **Push to GitHub**

3. **Deploy to Railway**
   - Go to https://railway.app
   - New Project → GitHub Repo
   - Select `backend` folder
   - Set environment variables:
     ```
     DEBUG=False
     LOG_LEVEL=INFO
     ```
   - Deploy

4. **Update Frontend**
   - Go to Vercel
   - Update `NEXT_PUBLIC_API_URL` to Railway backend URL

---

## Tùy chọn 3: AWS/GCP/Azure (Production)

### AWS ECS
```bash
# 1. Create ECR repositories
aws ecr create-repository --repository-name data-explorer-backend
aws ecr create-repository --repository-name data-explorer-frontend

# 2. Push images
docker tag data-explorer-backend:latest {AWS_ACCOUNT}.dkr.ecr.{REGION}.amazonaws.com/data-explorer-backend:latest
docker push ...

# 3. Create ECS cluster & services
# Use CloudFormation or AWS Console
```

### GCP Cloud Run
```bash
gcloud run deploy data-explorer-backend \
  --image gcr.io/{PROJECT}/data-explorer-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars DEBUG=False

gcloud run deploy data-explorer-frontend \
  --image gcr.io/{PROJECT}/data-explorer-frontend \
  --platform managed \
  --region us-central1 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://backend-url.run.app
```

---

## Production Checklist

- [ ] Set `DEBUG=False` in backend
- [ ] Use production database (BigQuery)
- [ ] Set strong `SHARE_TOKENS` in config
- [ ] Enable HTTPS
- [ ] Configure CORS properly (backend config.py)
- [ ] Set up error logging/monitoring
- [ ] Enable auto-scaling
- [ ] Backup database
- [ ] Monitor performance

---

## Environment Variables

### Backend (.env)
```
DEBUG=False
LOG_LEVEL=INFO
GCP_PROJECT_ID=your-project-id
BIGQUERY_DATASET=your-dataset
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## Performance Optimization

1. **Frontend**
   - Enable Static Export: `output: 'export'` in next.config.js
   - Use CDN (Cloudflare, CloudFront)
   - Enable compression

2. **Backend**
   - Use Gunicorn with multiple workers
   - Enable caching
   - Use read replicas for BigQuery

3. **Database**
   - Index frequently queried columns
   - Use clustering for large tables
   - Monitor query performance

---

## Monitoring & Logging

- **Sentry** for error tracking
- **Datadog** for metrics
- **CloudWatch** for AWS logs
- **Stackdriver** for GCP logs
