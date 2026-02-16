# Northborne O Sabah — Website Setup Guide

Welcome to the Northborne O Sabah project! This guide covers installation, setup, and deployment of the website and Stripe payment server.

## 📋 Project Overview

A modern, multi-page website for a Sabah-based agricultural and community organization featuring:
- **6 Main Pages**: Home, About, Shop, Register, Finance, Agriculture
- **E-commerce**: Product catalog with Stripe Checkout integration
- **Live Data**: Cryptocurrency prices (CoinGecko API), Trading widget (TradingView)
- **Interactive Features**: Floating chat widget, background music player, scroll animations
- **Modern Design**: Glasmorphism effects, gradient backgrounds, responsive layout

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **Python 3** (for simple HTTP server) - [Download](https://www.python.org/)
- **Git** (optional, for version control)

### Option 1: Run Frontend Only (No Payments)

Perfect for viewing the site without payment processing:

```bash
# Navigate to project directory
cd c:\Users\User\Documents

# Start Python's built-in HTTP server
python -m http.server 8000

# Open in browser
http://localhost:8000
```

All pages work except Stripe checkout will show an error (intentional without backend).

---

### Option 2: Run With Stripe Payment Server

For full e-commerce functionality:

#### 1. Install Dependencies
```bash
# Install Node.js packages
npm install
```

This installs:
- `express` — Web framework
- `stripe` — Stripe API client
- `cors` — Cross-origin support

#### 2. Get Stripe API Keys

1. Sign up for free at [stripe.com](https://stripe.com)
2. Go to Dashboard → Developers → API Keys
3. Copy your **Secret Key** (starts with `sk_test_`)

#### 3. Set Environment Variable

**Windows (PowerShell):**
```powershell
$env:STRIPE_SECRET_KEY = "sk_test_YOUR_KEY_HERE"
```

**Windows (Command Prompt):**
```cmd
set STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

**macOS/Linux:**
```bash
export STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

Or create `.env` file in project root:
```
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

#### 4. Start Both Servers

In separate terminals:

**Terminal 1 — Frontend (HTTP server):**
```bash
python -m http.server 8000
```

**Terminal 2 — Stripe Server (Node):**
```bash
npm start
# or: node server.js
```

Expected output:
```
Sample Stripe server running on http://localhost:4242
```

#### 5. Test the Shop

1. Open [http://localhost:8000/shop.html](http://localhost:8000/shop.html)
2. Add items to cart
3. Click "Checkout" button
4. Use Stripe test card: `4242 4242 4242 4242`
5. Enter any future expiry date & any CVC
6. Confirm payment → redirects to success.html

---

## 📁 Project Structure

```
c:\Users\User\Documents\
├── index.html                 # Homepage with Gaya Street market hero
├── about.html                 # Company mission & org structure
├── shop.html                  # E-commerce product catalog
├── register.html              # Membership registration + feedback form
├── finance.html               # Investment opportunities & crypto prices
├── agriculture.html           # Sustainable farming & aquaponics info
├── success.html               # Stripe payment success page
├── cancel.html                # Stripe payment cancelled page
├── scroll-animations.js       # Scroll effects & number counters
├── chat-widget.js             # Floating chat assistant
├── chat-style.css             # Chat styling
├── music-widget.js            # Background music player
├── music-style.css            # Music player styling
├── server.js                  # Express + Stripe checkout server
├── package.json               # Node.js dependencies
├── README.md                  # This file
└── assets/
    └── franksinatra.mp3       # Background music (optional, add manually)
```

---

## 🎨 Design System

### Colors
- **Primary**: `#0b6623` (forest green)
- **Dark**: `#154d2e` (deep green)
- **Text**: `#0f1724` (near-black)
- **Muted**: `#6b7280` (gray)

### Fonts
- **Family**: Inter, system-ui fallback
- **Sizing**: Responsive rem units

### Modern Effects
- **Glasmorphism**: `backdrop-filter: blur(10px)`
- **Animations**: Fade-in on scroll, hover lift effects
- **Gradients**: 135deg linear backgrounds with radial texture overlay

---

## 🔧 Configuration

### Stripe Product Mapping

Edit the `PRICE_MAP` in `server.js`:

```javascript
const PRICE_MAP = {
  'apple': {unit_amount:1200,currency:'myr',name:'Sabah Organic Apple (1 kg)'},
  'honey': {unit_amount:4500,currency:'myr',name:'Local Wild Honey (250g)'},
  'spice': {unit_amount:1500,currency:'myr',name:'Traditional Spice Mix (100g)'}
};
```

**Note:** `unit_amount` is in **cents**, so 1200 = MYR 12.00

### Update Social Media URLs

Search all `.html` files for social link placeholders:
```html
<a href="https://facebook.com/northborneosabah" target="_blank">f</a>
```

Replace with actual URLs to your social profiles.

---

## 📊 APIs & Integrations

### CoinGecko (Crypto Prices)
- **Endpoint**: `https://api.coingecko.com/api/v3/simple/price`
- **Auth**: None (free tier)
- **Used On**: finance.html
- **Refresh**: Every 30 seconds

Edit coin IDs in `finance.html`:
```javascript
const ids = 'bitcoin,ethereum,cardano,solana';
```

### TradingView Trading Widget
- **Type**: Embed script (iframe)
- **Auth**: None (free lightweight ticker)
- **Used On**: finance.html

### YouTube Embeds
- **Used On**: register.html (membership information video)
- **Update**: Replace video ID in iframe src

---

## 📦 Deployment

### Deploy Frontend Only (Static Site)

**GitHub Pages:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/northborne-o-sabah.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

**Vercel (Recommended):**
1. Push code to GitHub
2. Sign up at [vercel.com](https://vercel.com)
3. Import GitHub repo
4. Deploy (automatic on push)

**Netlify:**
Similar process, sign up at [netlify.com](https://netlify.com)

### Deploy Backend (Stripe Server)

**Heroku (Free tier available):**
1. Install Heroku CLI
2. `heroku create northborne-o-sabah`
3. `heroku config:set STRIPE_SECRET_KEY=sk_test_...`
4. `git push heroku main`

**Railway (Modern alternative):**
1. Connect GitHub repo at [railway.app](https://railway.app)
2. Set environment variables
3. Auto-deploys on push

### Update Server Endpoints

After deploying, update `shop.html`:
```javascript
const response = await fetch('https://your-server.herokuapp.com/create-checkout-session', {
```

---

## ⚙️ Troubleshooting

### Stripe Checkout Error
**Error**: "Could not contact server"
- ✓ Ensure `npm start` is running on port 4242
- ✓ Check STRIPE_SECRET_KEY environment variable is set
- ✓ No CORS errors? Install `cors` package

### Animations Not Showing
- ✓ Confirm `scroll-animations.js` is loaded in browser DevTools
- ✓ Check browser compatibility (all modern browsers supported)

### Chat Widget Not Appearing
- ✓ Ensure `chat-widget.js` and `chat-style.css` are in same folder
- ✓ Check browser console for JS errors

### Music Player Issues
- ✓ Autoplay requires user interaction (browser policy)
- ✓ Must have `assets/franksinatra.mp3` file or update path
- ✓ Check volume is not muted by browser settings

---

## 📱 Responsive Design

All pages are mobile-responsive with breakpoints at:
- **700px**: Hero heights reduce, sidebox positioning changes
- **820px**: Grid switches to single column, fonts scale
- **900px**: Shop cart repositions, form layouts adjust

---

## 🔐 Security Notes

⚠️ **Development Only:**
- Never commit real Stripe secret keys to git
- Use environment variables or `.env` files (not in git)
- Test cards only: `4242 4242 4242 4242` (never real cards)

**Production Checklist:**
- [ ] Set `NODE_ENV=production` on server
- [ ] Use HTTPS (mandatory for Stripe)
- [ ] Enable CSP headers
- [ ] Add rate limiting on checkout endpoint
- [ ] Store payment records in database
- [ ] Implement server-side cart validation
- [ ] Add order confirmation emails

---

## 📞 Support & Contact

- **Email**: info@northborneosabah.my
- **Domain**: northborneosabah.my
- **GitHub**: [Your repo link]

---

## 📄 License

MIT License — Feel free to use and modify for your organization.

---

## 🙌 Credits

Built with modern web technologies:
- HTML5, CSS3, Vanilla JavaScript
- [Stripe API](https://stripe.com)
- [CoinGecko API](https://coingecko.com)
- [TradingView Widget](https://www.tradingview.com)
- [Unsplash Images](https://unsplash.com)

---

**Last Updated**: February 2026
