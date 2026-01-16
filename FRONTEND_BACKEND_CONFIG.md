# 🔧 Frontend-Backend Configuration Guide

## API URL Configuration

### Default Setup (Development)
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

**No changes needed!** Frontend đã configure sẵn để gọi `http://localhost:8000`

---

## If Backend is on Different Host

### Option 1: Edit Frontend Config (Easy)

File: `frontend/src/config.ts`

```typescript
// Change this line:
export const API_BASE_URL = "http://your-backend-host:8000";

// Example:
export const API_BASE_URL = "http://192.168.4.92:8000";
```

Then restart frontend: `npm run dev`

### Option 2: Environment Variable

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://192.168.4.92:8000
```

Then in `frontend/src/config.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

### Option 3: Docker Compose

Edit `docker-compose.yml`:

```yaml
frontend:
  environment:
    - NEXT_PUBLIC_API_URL=http://backend:8000
```

---

## Testing API Connection

### Using Frontend
1. Open browser at http://localhost:3000/s/demo_token_123
2. If you see dropdown lists, API is working ✅
3. If you see error, check backend URL

### Using Backend Docs
- Open http://localhost:8000/docs
- Try endpoints in Swagger UI

### Using Test Script
```bash
cd backend
python test_api.py
```

Should show ✓ for all tests

---

## Common Issues

### Frontend can't connect to backend

**Error**: "Cannot POST /share/demo_token_123/query"

**Solution**: 
1. Check backend is running: http://localhost:8000/health
2. Check API_BASE_URL in `frontend/src/config.ts`
3. Check firewall allows port 8000

### CORS Error

**Error**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**: Backend already has CORS enabled, but make sure:
1. Backend is running
2. API URL is correct
3. Check browser console for actual error

### Token Invalid

**Error**: "Invalid or inactive share token"

**Solution**:
1. Use `demo_token_123` (default)
2. Check token in URL: http://localhost:3000/s/**demo_token_123**
3. Tokens defined in `backend/config.py`

---

## URL Format Guide

### Frontend URLs
```
http://localhost:3000/s/{token}

Examples:
http://localhost:3000/s/demo_token_123
http://localhost:3000/s/prod_token_456
```

### Backend Endpoints
```
GET  http://localhost:8000/health
GET  http://localhost:8000/share/{token}/datasets
GET  http://localhost:8000/share/{token}/dataset/{dataset_id}/fields
POST http://localhost:8000/share/{token}/query
```

### API Documentation
```
http://localhost:8000/docs       (Swagger UI)
http://localhost:8000/openapi.json (OpenAPI spec)
```

---

## After Configuring

1. ✅ Restart frontend if you changed config
2. ✅ Check http://localhost:8000/health (backend status)
3. ✅ Open http://localhost:3000/s/demo_token_123 (frontend)
4. ✅ Select dataset and run query

---

If everything works, you should see data loading and charts rendering! 🎉
