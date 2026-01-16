# Quick Run Script for Windows
# This script starts both backend and frontend

Write-Host "🚀 Starting Data Explorer..." -ForegroundColor Cyan
Write-Host ""

# Colors
$green = "Green"
$blue = "Cyan"

# Check Python
try {
    python --version | Out-Null
} catch {
    Write-Host "❌ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    npm --version | Out-Null
} catch {
    Write-Host "❌ npm not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Python and npm found" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "▶️  Starting Backend..." -ForegroundColor $blue
Push-Location backend

if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

& .\venv\Scripts\Activate.ps1
python -m pip install -q -r requirements.txt

$backendProcess = Start-Process -NoNewWindow -FilePath python -ArgumentList "-m", "uvicorn", "app:app", "--reload" -PassThru
Write-Host "✅ Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green
Start-Sleep -Seconds 2
Write-Host ""

Pop-Location

# Start Frontend
Write-Host "▶️  Starting Frontend..." -ForegroundColor $blue
Push-Location frontend

npm install --silent
npm run dev &

Write-Host "✅ Frontend started" -ForegroundColor Green
Start-Sleep -Seconds 2
Write-Host ""

Pop-Location

# Display info
Write-Host "================================" -ForegroundColor Green
Write-Host "🎉 Data Explorer is Running!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "📍 Demo:     http://localhost:3000/s/demo_token_123" -ForegroundColor Yellow
Write-Host "📍 Docs:     http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Open your browser and go to: http://localhost:3000/s/demo_token_123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop services" -ForegroundColor Yellow
