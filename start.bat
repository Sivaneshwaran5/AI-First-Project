@echo off
echo Starting AI Sales Intelligence Platform...

:: Start the backend server in a new window
echo Starting Backend Server...
start "Backend" cmd /c "cd backend && npm run dev"

:: Wait for a few seconds to let backend start
timeout /t 3 /nobreak > NUL

:: Start the frontend server in a new window and open browser
echo Starting Frontend Server...
start "Frontend" cmd /c "cd frontend && npm run dev -- --open"

echo Both servers are starting! The browser will open automatically.
