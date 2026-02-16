@echo off
REM Northborne O Sabah — Quick Setup Script (Windows)
REM This script installs dependencies and guides setup

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Northborne O Sabah — Payment Server Setup                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo Please install from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm not found!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ npm found:
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo.
echo ✓ Dependencies installed successfully!
echo.

REM Check for .env file
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env and add your Stripe SECRET KEY
    echo.
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Setup Complete! Next Steps:                               ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║  1. Get your Stripe API key:                              ║
echo ║     → Visit: https://dashboard.stripe.com/test/keys       ║
echo ║     → Copy your SECRET Key (sk_test_...)                  ║
echo ║                                                            ║
echo ║  2. Edit .env file:                                       ║
echo ║     → Open: .env                                          ║
echo ║     → Paste your key in STRIPE_SECRET_KEY=                ║
echo ║                                                            ║
echo ║  3. Start servers (in separate terminals):                ║
echo ║                                                            ║
echo ║     Terminal 1 (Frontend):                                ║
echo ║     python -m http.server 8000                            ║
echo ║     → Open: http://localhost:8000                         ║
echo ║                                                            ║
echo ║     Terminal 2 (Stripe Server):                           ║
echo ║     npm start                                             ║
echo ║     → Server runs on: http://localhost:4242               ║
echo ║                                                            ║
echo ║  4. Test payment:                                         ║
echo ║     → Go to: http://localhost:8000/shop.html              ║
echo ║     → Add items and checkout                              ║
echo ║     → Test card: 4242 4242 4242 4242                      ║
echo ║     → Any future date + any CVC                           ║
echo ║                                                            ║
echo ║  📖 See README.md for full documentation                  ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

pause
