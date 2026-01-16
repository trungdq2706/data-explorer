#!/bin/bash
# Quick Start Script for Development

echo "🚀 Data Explorer - Quick Start"
echo "=============================="

# Check Python
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.11+"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js"
    exit 1
fi

echo "✓ Python and npm found"

# Backend
echo ""
echo "📦 Backend Setup..."
cd backend
if [ ! -d "venv" ]; then
    python -m venv venv
fi
source venv/Scripts/activate 2>/dev/null || source venv/bin/activate
pip install -r requirements.txt
echo "✓ Backend ready"

# Frontend
echo ""
echo "📦 Frontend Setup..."
cd ../frontend
npm install
echo "✓ Frontend ready"

# Done
echo ""
echo "=============================="
echo "✅ Setup Complete!"
echo ""
echo "To run the project:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/Scripts/activate (Windows) or source venv/bin/activate (Mac/Linux)"
echo "  python -m uvicorn app:app --reload"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Terminal 3 - Test (optional):"
echo "  cd backend"
echo "  python test_api.py"
echo ""
echo "Then open: http://localhost:3000/s/demo_token_123"
echo "=============================="
