# DRISHTI AI - Localhost Launcher for PowerShell
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "                 DRISHTI AI - LOCALHOST LAUNCHER                     " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting Vite Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " Both services started in separate terminal windows!" -ForegroundColor Green
Write-Host " - Frontend:   http://localhost:5173" -ForegroundColor White
Write-Host " - API Docs:   http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host " - Health:     http://127.0.0.1:8000/health" -ForegroundColor White
Write-Host "=====================================================================" -ForegroundColor Cyan
