@echo off
title DRISHTI AI Localhost Launcher
echo =====================================================================
echo                 DRISHTI AI - LOCALHOST LAUNCHER
echo =====================================================================
echo.
echo [1/2] Starting DRISHTI AI Backend (FastAPI on http://127.0.0.1:8000)...
start "DRISHTI AI Backend (FastAPI)" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 >nul

echo [2/2] Starting DRISHTI AI Frontend (Vite on http://localhost:5173)...
start "DRISHTI AI Frontend (Vite)" cmd /k "npm run dev"

echo.
echo =====================================================================
echo  Services launched in separate windows!
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://127.0.0.1:8000
echo  - API Docs (Swagger): http://127.0.0.1:8000/docs
echo =====================================================================
echo.
