@echo off
echo ===============================================================================
echo   National Digitized Discovery Platform for Startup (Project ID: 2026-27-WD-04)
echo   Final Year Project - Team NDDPS
echo ===============================================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "NDDPS Backend API" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 2 /nobreak > nul

echo Starting Frontend Dev Server (Vite Port 5173)...
start "NDDPS Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers have been launched in dedicated command windows!
echo - Backend API:  http://localhost:5000/api/health
echo - Frontend App: http://localhost:5173/
echo.
echo Press any key to exit this launcher window...
pause > nul
