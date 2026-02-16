@echo off
REM Northborne O Sabah — Deploy to Vercel Quick Start
REM This script automates the git setup for Vercel deployment

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Northborne O Sabah — Vercel Deployment Setup              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✓ Git found
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ npm found
echo.

REM Initialize git repo
echo Initializing Git repository...
git init
git config user.name "Northborne O Sabah"
git config user.email "info@northborneosabah.my"

echo.
echo Adding files...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: Northborne O Sabah website with Stripe & CIMB integration"

echo.
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Next Steps for Vercel Deployment                          ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║ 1. CREATE GITHUB REPOSITORY:                              ║
echo ║    - Go to https://github.com/new                         ║
echo ║    - Repository name: northborne-o-sabah                  ║
echo ║    - Click "Create repository"                            ║
echo ║                                                            ║
echo ║ 2. PUSH CODE TO GITHUB:                                   ║
echo ║                                                            ║
echo ║    git remote add origin https://github.com/YOUR_USERNAME/northborne-o-sabah.git
echo ║    git branch -M main                                     ║
echo ║    git push -u origin main                                ║
echo ║                                                            ║
echo ║ 3. DEPLOY TO VERCEL:                                      ║
echo ║                                                            ║
echo ║    npm install -g vercel                                  ║
echo ║    vercel --prod                                          ║
echo ║                                                            ║
echo ║    (Follow prompts to connect GitHub and deploy)          ║
echo ║                                                            ║
echo ║ 4. SET ENVIRONMENT VARIABLES in Vercel:                   ║
echo ║                                                            ║
echo ║    STRIPE_SECRET_KEY=sk_live_...                          ║
echo ║    CIMB_CLIENT_ID=...                                     ║
echo ║    CIMB_CLIENT_SECRET=...                                 ║
echo ║    AMANI_ACCOUNT=...                                      ║
echo ║    NODE_ENV=production                                    ║
echo ║                                                            ║
echo ║ 5. UPDATE API ENDPOINTS in HTML files:                    ║
echo ║                                                            ║
echo ║    Replace: http://localhost:4242                         ║
echo ║    With:    https://YOUR-PROJECT.vercel.app               ║
echo ║                                                            ║
echo ║ 📖 See DEPLOYMENT.md for detailed instructions            ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

pause
