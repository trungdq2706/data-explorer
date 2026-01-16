# ✅ Frontend-Backend Integration Verification

## Step 1: Start Backend

```bash
cd backend
python -m uvicorn app:app --reload
```

**Expected Output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

## Step 2: Verify Backend is Working

### Using Browser
Open: http://localhost:8000/health

**Expected Response**:
```json
{
  "status": "healthy",
  "service": "Data Explorer API"
}
```

### Using Terminal
```bash
curl http://localhost:8000/health
```

---

## Step 3: Start Frontend

```bash
cd frontend
npm run dev
```

**Expected Output**:
```
- Local:        http://localhost:3000
```

---

## Step 4: Verify Frontend-Backend Connection

### Option 1: Manual Test (Easy)

1. Open browser console (F12)
2. Go to: http://localhost:3000/s/demo_token_123
3. Paste this in console:

```javascript
// Quick test
fetch('http://localhost:8000/share/demo_token_123/datasets')
  .then(r => r.json())
  .then(d => console.log('✅ Connected!', d))
  .catch(e => console.error('❌ Error:', e));
```

**Expected**: See datasets list in console ✅

### Option 2: Automated Test (Better)

1. Open browser console
2. Go to: http://localhost:3000/s/demo_token_123
3. Copy-paste content from `frontend/integration-test.js`
4. Press Enter

**Expected**: All 4 tests pass ✅

### Option 3: Backend Test Suite

```bash
cd backend
python test_api.py
```

**Expected**: All endpoints tested ✅

---

## Step 5: Test Full Flow

1. Open: http://localhost:3000/s/demo_token_123
2. You should see:
   - Header with token
   - Dataset dropdown (filled with data) ✅
   - Dimension dropdown (filled) ✅
   - Measure dropdown (filled) ✅
   - Date picker (default date range) ✅
   - Run button ✅

3. Click "Run" button
4. Wait a moment...
5. Chart should appear with data ✅

---

## Common Issues & Solutions

### Issue 1: "Cannot find module 'react'"
```
❌ Error: Cannot find module 'react'
```

**Solution**:
```bash
cd frontend
npm install
npm run dev
```

### Issue 2: Backend not running
```
❌ frontend network error
```

**Solution**:
```bash
cd backend
python -m uvicorn app:app --reload
# Check: http://localhost:8000/health
```

### Issue 3: CORS error in console
```
❌ Access to XMLHttpRequest blocked by CORS policy
```

**Solution**: This shouldn't happen! Backend has CORS enabled. Check:
1. Backend URL is correct: http://localhost:8000
2. Backend is actually running
3. No firewall blocking port 8000

### Issue 4: "Token invalid"
```
❌ Invalid or inactive share token
```

**Solution**:
- URL should be: `http://localhost:3000/s/demo_token_123`
- Check token is exactly: `demo_token_123`
- Don't include extra spaces

### Issue 5: No data in dropdown
```
Empty dataset dropdown
```

**Solution**:
1. Check backend logs - should show API calls
2. Run `python test_api.py` to verify backend
3. Check browser console (F12) for errors

---

## Checklist: All Verified ✅

- [ ] Backend running on http://localhost:8000
- [ ] Backend health check works
- [ ] Frontend running on http://localhost:3000
- [ ] Frontend can access http://localhost:3000/s/demo_token_123
- [ ] Frontend loads dataset dropdown
- [ ] Frontend loads dimension dropdown
- [ ] Frontend loads measure dropdown
- [ ] Frontend can execute query
- [ ] Chart displays with data
- [ ] No errors in console (F12)

---

## URLs to Check

| Component | URL | Expected |
|-----------|-----|----------|
| Backend Health | http://localhost:8000/health | JSON response |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Frontend | http://localhost:3000 | React app |
| Demo Page | http://localhost:3000/s/demo_token_123 | Explore page |

---

## If Everything Works! 🎉

Congratulations! Your frontend and backend are perfectly integrated!

Now you can:
1. Explore datasets
2. Change queries
3. See beautiful charts
4. Export data (if implemented)
5. Deploy to production

---

## Next Steps

1. ✅ Test with different queries
2. ✅ Try different date ranges
3. ✅ Try different platforms
4. 🔄 Connect real BigQuery (advanced)
5. 🔄 Add authentication (advanced)

---

## Support

If something doesn't work:

1. Check the TROUBLESHOOTING section above
2. Run `python test_api.py` for backend
3. Check browser console (F12) for errors
4. Read FRONTEND_BACKEND_CONFIG.md for URL setup

Good luck! 🚀
