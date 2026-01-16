# 🚀 Hướng Dẫn Chạy Data Explorer

## 📋 Yêu Cầu

- **Python 3.11+** (Download từ https://python.org)
- **Node.js 18+** (Download từ https://nodejs.org)
- **Git** (optional)

## ⚡ Quick Start (Recommended)

### Windows
```powershell
# Chạy PowerShell script
.\setup.ps1
```

### Mac/Linux
```bash
# Chạy bash script
chmod +x setup.sh
./setup.sh
```

---

## 📖 Manual Setup

### Step 1️⃣: Setup Backend

```bash
# Vào thư mục backend
cd backend

# Tạo virtual environment (chỉ lần đầu)
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Cài dependencies
pip install -r requirements.txt

# Chạy backend
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend sẽ chạy trên: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### Step 2️⃣: Setup Frontend (Terminal khác)

```bash
# Vào thư mục frontend
cd frontend

# Cài dependencies
npm install

# Chạy frontend
npm run dev
```

✅ Frontend sẽ chạy trên: **http://localhost:3000**

### Step 3️⃣: Test API (Terminal thứ 3 - optional)

```bash
# Vào thư mục backend
cd backend

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Chạy test suite
python test_api.py
```

---

## 🌐 Truy Cập Ứng Dụng

Mở browser và truy cập:

### Share URL với Token Demo:
```
http://localhost:3000/s/demo_token_123
```

### Các Token có sẵn:
- `demo_token_123` - Demo token (recommended)
- `prod_token_456` - Production token

---

## 📊 Datasets Có Sẵn

### 1. Orders Dataset
- **ID**: `orders`
- **Dimensions**: dt (date), platform, product_name
- **Measures**: revenue, orders

### 2. Livestream Dataset
- **ID**: `livestream`
- **Dimensions**: dt (date), host, platform
- **Measures**: revenue, sessions

---

## 🧪 Test Queries

### Test 1: Orders by Date
```json
{
  "dataset_id": "orders",
  "dimension": "dt",
  "measure": "revenue",
  "date_from": "2025-01-10",
  "date_to": "2025-01-16"
}
```

### Test 2: Orders by Platform
```json
{
  "dataset_id": "orders",
  "dimension": "platform",
  "measure": "orders",
  "date_from": "2025-01-10",
  "date_to": "2025-01-16"
}
```

### Test 3: Livestream by Date with Filter
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

---

## 🐛 Troubleshooting

### Backend không chạy

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**: 
```bash
cd backend
pip install -r requirements.txt
```

### Frontend không chạy

**Error**: `npm: command not found`

**Solution**: Cài Node.js từ https://nodejs.org

### Port 8000 đã được dùng

**Error**: `Address already in use`

**Solution**:
```bash
# Chạy backend trên port khác
python -m uvicorn app:app --reload --port 8001
```

Sau đó sửa frontend config trong `config.ts`:
```typescript
const API_BASE = "http://localhost:8001";
```

### Port 3000 đã được dùng

**Error**: `Port 3000 is in use`

**Solution**: Next.js sẽ tự dùng port 3001

---

## 🚀 Docker Setup (Alternative)

Nếu bạn có Docker installed:

```bash
# Build và chạy cả 2 services
docker-compose up -d

# Backend: http://localhost:8000
# Frontend: http://localhost:3000

# Dừng services
docker-compose down
```

---

## 📁 Project Structure

```
Web báo cáo/
├── backend/
│   ├── app.py                 # Main app
│   ├── config.py              # Configuration
│   ├── requirements.txt        # Dependencies
│   ├── test_api.py            # API tests
│   ├── Dockerfile             # Docker config
│   ├── core/
│   ├── services/
│   ├── schemas/
│   └── api/
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── src/
│
├── docker-compose.yml         # Multi-container setup
├── README.md                  # Project documentation
├── setup.sh                   # Linux/Mac setup
└── setup.ps1                  # Windows setup
```

---

## 📝 API Endpoints

### Health Check
```
GET http://localhost:8000/health
```

### List Datasets
```
GET http://localhost:8000/share/demo_token_123/datasets
```

### Get Dataset Fields
```
GET http://localhost:8000/share/demo_token_123/dataset/orders/fields
```

### Execute Query
```
POST http://localhost:8000/share/demo_token_123/query
Content-Type: application/json

{
  "dataset_id": "orders",
  "dimension": "dt",
  "measure": "revenue",
  "date_from": "2025-01-10",
  "date_to": "2025-01-16",
  "limit": 500,
  "order": "asc"
}
```

---

## 🔧 Development Tips

### Restart Backend (nếu có lỗi)
```bash
# Ctrl + C để dừng
# Sau đó chạy lại:
python -m uvicorn app:app --reload
```

### Xem API Documentation
```
http://localhost:8000/docs
```

### Format Code
```bash
# Backend
cd backend
black .

# Frontend
cd frontend
npm run format
```

### Debug Mode
Backend chạy ở mode debug nên tự reload khi bạn sửa code ✨

---

## ✅ Checklist

Sau khi cài, kiểm tra:

- [ ] Backend chạy trên http://localhost:8000
- [ ] Frontend chạy trên http://localhost:3000
- [ ] API docs có sẵn trên http://localhost:8000/docs
- [ ] Có thể truy cập http://localhost:3000/s/demo_token_123
- [ ] Chọn dataset "Orders"
- [ ] Select dimension "dt" và measure "revenue"
- [ ] Click "Run" để xem chart

---

## 🎉 Ready!

Giờ bạn đã sẵn sàng! Hãy:

1. Khám phá datasets
2. Thử các queries khác nhau
3. Sửa mock data nếu cần
4. Thêm real BigQuery connection khi sẵn sàng

---

## 📞 Support

Nếu có vấn đề:
1. Kiểm tra terminal error messages
2. Xem file logs trong `backend/logs/app.log`
3. Chạy `python test_api.py` để test API

Good luck! 🚀
