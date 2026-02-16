#!/bin/bash

# Northborne O Sabah — Quick Setup Script (macOS/Linux)
# This script installs dependencies and guides setup

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Northborne O Sabah — Payment Server Setup                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "Please install from: https://nodejs.org/"
    echo ""
    exit 1
fi

echo "✓ Node.js found:"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found!"
    echo "Please install Node.js from: https://nodejs.org/"
    echo ""
    exit 1
fi

echo "✓ npm found:"
npm --version
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi

echo ""
echo "✓ Dependencies installed successfully!"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your Stripe SECRET KEY"
    echo ""
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Setup Complete! Next Steps:                               ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  1. Get your Stripe API key:                              ║"
echo "║     → Visit: https://dashboard.stripe.com/test/keys       ║"
echo "║     → Copy your SECRET Key (sk_test_...)                  ║"
echo "║                                                            ║"
echo "║  2. Edit .env file:                                       ║"
echo "║     → nano .env  (or your editor)                         ║"
echo "║     → Paste your key in STRIPE_SECRET_KEY=                ║"
echo "║                                                            ║"
echo "║  3. Start servers (in separate terminals):                ║"
echo "║                                                            ║"
echo "║     Terminal 1 (Frontend):                                ║"
echo "║     python3 -m http.server 8000                           ║"
echo "║     → Open: http://localhost:8000                         ║"
echo "║                                                            ║"
echo "║     Terminal 2 (Stripe Server):                           ║"
echo "║     npm start                                             ║"
echo "║     → Server runs on: http://localhost:4242               ║"
echo "║                                                            ║"
echo "║  4. Test payment:                                         ║"
echo "║     → Go to: http://localhost:8000/shop.html              ║"
echo "║     → Add items and checkout                              ║"
echo "║     → Test card: 4242 4242 4242 4242                      ║"
echo "║     → Any future date + any CVC                           ║"
echo "║                                                            ║"
echo "║  📖 See README.md for full documentation                  ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
