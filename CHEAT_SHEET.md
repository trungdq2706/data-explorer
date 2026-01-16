# ✅ CHEAT SHEET - Quick Reference

## 🚀 Chạy Project

### Option 1: Automatic Setup (Recommended)
```powershell
# Windows
.\setup.ps1

# Mac/Linux
./setup.sh
```

### Option 2: Manual Setup
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python -m uvicorn app:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Test (optional)
cd backend
python test_api.py
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Share Link | http://localhost:3000/s/demo_token_123 |

---

## 🔑 Available Tokens

| Token | Purpose |
|-------|---------|
| `demo_token_123` | Demo (recommended) |
| `prod_token_456` | Production |

---

## 📊 Datasets

### Orders
- **Dimensions**: dt, platform, product_name
- **Measures**: revenue, orders

### Livestream
- **Dimensions**: dt, host, platform
- **Measures**: revenue, sessions

---

## 🧪 Quick Test Queries

### Query 1: Orders by Date
```bash
curl -X POST "http://localhost:8000/share/demo_token_123/query" \
  -H "Content-Type: application/json" \
  -d '{
    "dataset_id": "orders",
    "dimension": "dt",
    "measure": "revenue",
    "date_from": "2025-01-10",
    "date_to": "2025-01-16"
  }'
```

### Query 2: Orders by Platform
```bash
curl -X POST "http://localhost:8000/share/demo_token_123/query" \
  -H "Content-Type: application/json" \
  -d '{
    "dataset_id": "orders",
    "dimension": "platform",
    "measure": "orders",
    "date_from": "2025-01-10",
    "date_to": "2025-01-16"
  }'
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/app.py` | Main FastAPI app |
| `backend/config.py` | Configuration |
| `backend/constants/datasets.py` | Dataset registry |
| `backend/services/query_service.py` | Query logic |
| `backend/test_api.py` | API tests |
| `frontend/src/app/s/[token]/page.tsx` | Share page |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| ModuleNotFoundError | `pip install -r requirements.txt` |
| npm not found | Install Node.js from nodejs.org |
| Port 8000 in use | Change port: `--port 8001` |
| Port 3000 in use | Next.js will use 3001 |
| Token invalid | Use `demo_token_123` |

---

## 🎯 Next Steps

1. ✅ Run backend
2. ✅ Run frontend
3. ✅ Test API with `python test_api.py`
4. ✅ Access http://localhost:3000/s/demo_token_123
5. ✅ Try different queries
6. 🔄 Add real BigQuery connection (when ready)
7. 🔄 Add more datasets
8. 🔄 Add authentication

---

## 📚 Documentation

- **README.md** - Project overview
- **GETTING_STARTED.md** - Detailed setup guide
- **ARCHITECTURE.md** - Architecture explanation
- **DIAGRAMS.md** - Visual diagrams
- **Backend API Docs** - http://localhost:8000/docs

---

## 💡 Pro Tips

✨ Backend auto-reloads when you save code
✨ API docs auto-generated at /docs
✨ Mock data is realistic and random
✨ All queries are validated before execution
✨ Easy to extend with more datasets

---

Good luck! 🚀
