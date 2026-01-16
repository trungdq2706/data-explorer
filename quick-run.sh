#!/bin/bash
# Quick Run Script for Linux/Mac
# This script starts both backend and frontend in the background

set -e

echo "🚀 Starting Data Explorer..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo "❌ $1 not found. Please install it."
    exit 1
  fi
}

echo "📋 Checking requirements..."
check_command python
check_command npm
echo "✅ Requirements OK"
echo ""

# Start Backend
echo "${BLUE}▶️  Starting Backend...${NC}"
cd backend
if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python -m venv venv
fi

source venv/bin/activate 2>/dev/null || source venv/Scripts/activate
pip install -q -r requirements.txt

python -m uvicorn app:app --reload &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
sleep 2
echo ""

# Start Frontend
echo "${BLUE}▶️  Starting Frontend...${NC}"
cd ../frontend
npm install -q
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
sleep 2
echo ""

# Display info
echo "${GREEN}================================${NC}"
echo "🎉 Data Explorer is Running!"
echo "${GREEN}================================${NC}"
echo ""
echo "📍 Backend:  http://localhost:8000"
echo "📍 Frontend: http://localhost:3000"
echo "📍 Demo:     http://localhost:3000/s/demo_token_123"
echo "📍 Docs:     http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
