# Data Explorer - Backend & Frontend

Ứng dụng explore dữ liệu kiểu Looker với FastAPI + Next.js

## 📁 Project Structure

```
Web báo cáo/
├── backend/          # FastAPI backend
└── frontend/         # Next.js frontend
```

## 🚀 Quick Start

### 1️⃣ Backend Setup

#### Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

#### Run backend:
```bash
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend sẽ chạy trên: `http://localhost:8000`

#### Test backend:
```bash
# Trong terminal khác
python test_api.py
```

### 2️⃣ Frontend Setup

#### Install dependencies:
```bash
cd frontend
npm install
```

#### Run frontend:
```bash
npm run dev
```

Frontend sẽ chạy trên: `http://localhost:3000`

## 📊 API Endpoints

### Health Check
```
GET /health
```

### List Datasets
```
GET /share/{token}/datasets
```

Response:
```json
[
  {"id": "orders", "label": "Orders (Fact)"},
  {"id": "livestream", "label": "Livestream (Fact)"}
]
```

### Get Dataset Fields
```
GET /share/{token}/dataset/{dataset_id}/fields
```

Response:
```json
{
  "dimensions": ["dt", "platform", "product_name"],
  "measures": ["revenue", "orders"]
}
```

### Execute Query
```
POST /share/{token}/query
```

Body:
```json
{
  "dataset_id": "orders",
  "dimension": "dt",
  "measure": "revenue",
  "date_from": "2025-01-01",
  "date_to": "2025-01-16",
  "platform": "tiktok",
  "limit": 500,
  "order": "asc"
}
```

Response:
```json
{
  "rows": [
    {"dt": "2025-01-01", "revenue": 1500.50},
    {"dt": "2025-01-02", "revenue": 2100.75}
  ]
}
```

## 🔐 Share Tokens

Mặc định có 2 token để test:
- `demo_token_123` - Demo token
- `prod_token_456` - Production token

Để thêm token mới, sửa trong `config.py`:
```python
SHARE_TOKENS = {
    "your_token": {"active": True, "label": "Your Label"},
}
```

## 📝 Test Queries

### Test 1: Orders by Day (Revenue)
```json
{
  "dataset_id": "orders",
  "dimension": "dt",
  "measure": "revenue",
  "date_from": "2025-01-10",
  "date_to": "2025-01-16"
}
```

### Test 2: Orders by Platform (Count)
```json
{
  "dataset_id": "orders",
  "dimension": "platform",
  "measure": "orders",
  "date_from": "2025-01-10",
  "date_to": "2025-01-16"
}
```

### Test 3: Livestream by Date (Revenue)
```json
{
  "dataset_id": "livestream",
  "dimension": "dt",
  "measure": "revenue",
  "date_from": "2025-01-10",
  "date_to": "2025-01-16",
  "platform": "tiktok"
}
```

## 🏗️ Architecture

### Backend
- **app.py** - Main FastAPI app
- **config.py** - Configuration
- **core/** - Auth & Security
- **services/** - Business logic
- **schemas/** - Pydantic models
- **api/routes/** - API endpoints
- **constants/** - Dataset registry
- **utils/** - Utilities

### Frontend
- **src/app/** - App layout
- **src/components/** - React components
- **src/pages/s/[token]** - Share page

## 🛠️ Development

### Format Code
```bash
# Backend
cd backend
black .

# Frontend
cd frontend
npm run format
```

### Run Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Docker)
```bash
cd backend
docker build -t data-explorer-api .
docker run -p 8000:8000 data-explorer-api
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel
```

## 📖 Documentation

- Backend API docs: http://localhost:8000/docs
- Backend OpenAPI: http://localhost:8000/openapi.json

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License

## 👤 Author

Your Name

## ❓ Support

Có vấn đề gì? Vui lòng tạo issue hoặc liên hệ...
