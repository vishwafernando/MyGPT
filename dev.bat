@echo off
echo Starting MyGPT Development Environment...
echo.

echo Starting backend server in development mode...
cd /d "C:\Users\Administrator\MyGPT\backend"
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting client development server...
cd /d "C:\Users\Administrator\MyGPT\client"
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo ✅ Development servers started
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo Health check: http://localhost:5000/api/health
echo.
pause
