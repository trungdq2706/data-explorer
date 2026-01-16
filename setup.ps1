# Quick Start Script for Windows Development

Write-Host "🚀 Data Explorer - Quick Start" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Python and npm found" -ForegroundColor Green

# Backend
Write-Host ""
Write-Host "📦 Backend Setup..." -ForegroundColor Yellow
Push-Location backend
if (-not (Test-Path "venv")) {
    python -m venv venv
}
& .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Write-Host "✓ Backend ready" -ForegroundColor Green
Pop-Location

# Frontend
Write-Host ""
Write-Host "📦 Frontend Setup..." -ForegroundColor Yellow
Push-Location frontend
npm install
Write-Host "✓ Frontend ready" -ForegroundColor Green
Pop-Location

# Done
Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the project:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  python -m uvicorn app:app --reload" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 3 - Test (optional):" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  python test_api.py" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:3000/s/demo_token_123" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
