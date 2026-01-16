# 📋 Backend Architecture Summary

## ✨ Backend được tổ chức theo Clean Code Pattern

### 🏗️ Cấu Trúc Thư Mục

```
backend/
├── app.py                 # ✨ Main entry - chỉ setup FastAPI
├── config.py              # ⚙️ Tất cả config ở đây
├── requirements.txt       # 📦 Dependencies
├── test_api.py            # 🧪 API tests
├── Dockerfile             # 🐳 Docker config
│
├── constants/
│   └── datasets.py        # 📊 Dataset registry (whitelist)
│
├── core/                  # 🔐 Core logic
│   ├── auth.py            # Verify token
│   └── security.py        # Validate input
│
├── services/              # 💼 Business logic (reusable)
│   ├── dataset_service.py # Dataset operations
│   ├── query_service.py   # Query building & execution
│   └── bigquery_service.py # BigQuery client
│
├── schemas/               # 📋 Pydantic models
│   ├── dataset_schema.py  # Dataset DTOs
│   └── query_schema.py    # Query DTOs
│
├── api/
│   ├── dependencies.py    # FastAPI dependencies
│   └── routes/
│       ├── datasets.py    # Dataset endpoints
│       └── queries.py     # Query endpoints
│
└── utils/
    └── logger.py          # 📝 Logging
```

---

## 🎯 Design Principles

### 1. **Separation of Concerns**
- `app.py` - HTTP layer
- `services/` - Business logic
- `core/` - Security & validation
- `schemas/` - Data validation
- `constants/` - Configuration

### 2. **Single Responsibility**
- Mỗi file có 1 trách nhiệm duy nhất
- Dễ test, dễ maintain, dễ scale

### 3. **DRY (Don't Repeat Yourself)**
- Reusable services
- Centralized security checks
- Shared models

### 4. **Security First**
- Whitelist-based validation
- Safe SQL query building
- Token verification on every request

---

## 🔄 Data Flow

```
Frontend Request
    ↓
FastAPI Route (@app.get/@app.post)
    ↓
Dependency: verify_share_token()
    ↓
Service Layer (dataset_service, query_service)
    ↓
Security Validation (core/security.py)
    ↓
BigQuery Service (mock data)
    ↓
Pydantic Model Response
    ↓
Frontend Response
```

---

## 📦 What's Included

✅ **Mock Dataset**
- Orders (fact_orders) - 2 datasets
- Livestream (fact_livestream)
- Realistic sample data generator

✅ **API Endpoints**
- `/health` - Health check
- `/share/{token}/datasets` - List datasets
- `/share/{token}/dataset/{id}/fields` - Get fields
- `/share/{token}/query` - Execute query (POST)

✅ **Security**
- Token verification
- Input validation
- Whitelist-based dimension/measure

✅ **Error Handling**
- Custom HTTPException messages
- Logging on every operation
- Type hints for better IDE support

✅ **Testing**
- `test_api.py` - Full test suite
- Can test all endpoints

---

## 🚀 How to Use

### 1. Run Backend
```bash
cd backend
python -m uvicorn app:app --reload
```

### 2. Test API
```bash
cd backend
python test_api.py
```

### 3. Access Swagger Docs
```
http://localhost:8000/docs
```

### 4. Query Examples
```bash
# Using curl
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

---

## 🔑 Key Features

### ✨ Features Implemented

1. **Multi-Dataset Support**
   - Orders dataset
   - Livestream dataset
   - Easily add more

2. **Flexible Querying**
   - Any dimension × measure combination
   - Date range filtering
   - Optional platform filter
   - Configurable limit & order

3. **Mock Data Generator**
   - Realistic sample data
   - Date range aware
   - Platform filtering
   - Aggregation support

4. **Production-Ready Code**
   - Type hints everywhere
   - Comprehensive docstrings
   - Proper error handling
   - Logging on all operations

5. **Easy to Test**
   - Full test suite included
   - API documentation auto-generated
   - Swagger UI available

---

## 📈 To Scale Further

### Add Real BigQuery
```python
# In services/bigquery_service.py
from google.cloud import bigquery

client = bigquery.Client()
result = client.query(sql).result()
```

### Add More Datasets
```python
# In constants/datasets.py
DATASETS_REGISTRY = {
    "your_dataset": {
        "label": "Your Dataset",
        "table": "project.dataset.table",
        "dimensions": {...},
        "measures": {...},
    }
}
```

### Add Authentication
```python
# In core/auth.py
# Add JWT token verification
# Add user-based access control
```

---

## 📚 Code Quality

✅ **Clean Code Practices**
- Meaningful names
- Small functions
- No magic numbers
- Comprehensive docstrings
- Type hints

✅ **Error Handling**
- Proper HTTP status codes
- Descriptive error messages
- Centralized exception handling

✅ **Testing**
- Test suite included
- Easy to mock services
- Can be extended with pytest

---

## 🎓 Learning Value

Code này menggunakan best practices dari:
- Google Cloud (BigQuery patterns)
- FastAPI best practices
- Domain-Driven Design
- Clean Code principles
- 12-Factor App methodology

Anda bisa belajar:
- How to structure FastAPI apps
- Dependency injection pattern
- Service layer architecture
- Pydantic for validation
- How to build data APIs
- Testing strategies
- Error handling

---

## 📊 Summary

| Aspect | Status |
|--------|--------|
| Backend | ✅ Complete |
| Frontend | ✅ Complete |
| Mock Data | ✅ Complete |
| Tests | ✅ Complete |
| Documentation | ✅ Complete |
| Docker | ✅ Complete |
| Clean Architecture | ✅ Complete |

Ready to run! 🚀
