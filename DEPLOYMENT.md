# Deploy to Vercel

Northborne O Sabah website is ready for production deployment on Vercel. This guide covers setup and deployment.

---

## Prerequisites

- GitHub account (free at github.com)
- Vercel account (free at vercel.com)
- Git installed locally (install from git-scm.com)

---

## Step 1: Prepare Git Repository

Initialize git and push to GitHub:

```bash
cd c:\Users\User\Documents

# Initialize git
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files (except those in .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: Northborne O Sabah website"
```

Create a new repository on GitHub:
1. Go to github.com and sign in
2. Click `New repository`
3. Name it `northborne-o-sabah`
4. Do NOT initialize with README (you already have one)
5. Click `Create repository`

Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/northborne-o-sabah.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project directory
cd c:\Users\User\Documents
vercel --prod
```

Follow the prompts:
- Link to existing GitHub repo? **Yes**
- Authorize Vercel with GitHub? **Yes**
- Select your `northborne-o-sabah` repo
- Deploy to production? **Yes**

**Your site is now live!** You'll see a URL like: `https://northborne-o-sabah.vercel.app`

### Option B: Vercel Dashboard (Manual)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click `Add New...` → `Project`
3. Select `Import Git Repository`
4. Connect GitHub account and select `northborne-o-sabah` repo
5. Click `Import`
6. Skip framework selection (project uses Express)
7. Click `Deploy`

---

## Step 3: Configure Environment Variables

After deployment, add your API credentials in Vercel Dashboard:

1. Go to your project in Vercel
2. Click `Settings` → `Environment Variables`
3. Add each variable (for Production):

```
STRIPE_SECRET_KEY = sk_live_YOUR_PRODUCTION_KEY
CIMB_CLIENT_ID = your_production_cimb_id
CIMB_CLIENT_SECRET = your_production_cimb_secret  
AMANI_ACCOUNT = your_actual_amani_account
NODE_ENV = production
```

4. Click `Save`
5. Redeploy: Click `Deployments` → Latest → `Redeploy`

---

## Step 4: Update Frontend API Endpoints

Your HTML files currently point to `localhost:4242`. Update them to your Vercel domain:

**Find and replace in all HTML files:**

```
From: http://localhost:4242
To:   https://northborne-o-sabah.vercel.app
```

Or use a more dynamic approach:

```javascript
// Add this to a global config file or in each script
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:4242'
  : 'https://northborne-o-sabah.vercel.app';
```

**Files to update:**
- `shop.html` (Stripe checkout)
- `agriculture.html` (CIMB payment)

### Example: Update shop.html

In `shop.html`, find the checkout function and update:

```javascript
// Before:
const response = await fetch('http://localhost:4242/create-checkout-session', {

// After:
const response = await fetch('https://northborne-o-sabah.vercel.app/create-checkout-session', {
```

---

## Step 5: Test Production

1. Open your Vercel URL (e.g., `https://norgit add .
git commit -m "Update API endpoints to Vercel production domain"
git push origin mainthborne-o-sabah.vercel.app`)
2. Test each page loads
3. Try a test payment:
   - Shop → Add items → Checkout
   - Stripe test card: `4242 4242 4242 4242`
4. Try investment:
   - Agriculture → Click "Invest via CIMB" button

If any endpoint fails, check:
- ✓ Server is running (check Vercel logs)
- ✓ Environment variables are set
- ✓ API endpoints are correct in HTML

---

## Custom Domain

To use your own domain (`northborneosabah.my`):

1. In Vercel Dashboard, go to `Settings` → `Domains`
2. Click `Add`
3. Enter your domain: `northborneosabah.my`
4. Follow DNS setup instructions for your registrar
5. Vercel will auto-provision free SSL certificate

DNS typically takes 24-48 hours to propagate.

---

## Monitoring & Logs

### View Deployment Logs

Vercel Dashboard → `Deployments` → Select deployment → `Logs`

Look for:
- Build errors (red text)
- Runtime errors from API calls
- Environment variable issues

### Server-side Logs

API calls log to Vercel console. Check:
1. Vercel Dashboard → Function logs
2. Look for CIMB/Stripe payment attempts

### Client-side Logs

In browser DevTools Console (F12):
- Check for fetch errors
- Verify API endpoints are correct
- Look for CORS issues

---

## Troubleshooting

### "Cannot find module X" error

**Problem:** Vercel can't find npm packages
**Solution:**
```bash
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
# Redeploy from Vercel
```

### API endpoints return 404

**Problem:** Routes not working in Vercel
**Solution:**
- Check `vercel.json` routes are correct
- API calls should use your Vercel domain (not localhost)
- Rebuild project: `npm run build`

### CORS errors when calling API

**Problem:** Frontend can't call backend from different domain
**Solution:**
- Already enabled in `server.js` with `cors()` middleware
- If still issues, add to `server.js`:
  ```javascript
  app.use(cors({
    origin: ['https://northborne-o-sabah.vercel.app', 'https://northborneosabah.my'],
    credentials: true
  }));
  ```

### Environment variables not set

**Problem:** Getting "STRIPE_SECRET_KEY not set" error
**Solution:**
1. Vercel Dashboard → Project Settings → Environment Variables
2. Add all required variables
3. Redeploy (click Redeploy button)
4. Check logs to confirm variables loaded

### Stripe/CIMB credentials not working

**Problem:** "Invalid API key" or "Authentication failed"
**Solution:**
1. Verify credentials are for PRODUCTION (not test)
2. Copy exactly (no extra spaces)
3. Use correct environment:
   - Production keys should NOT contain "test" or "sandbox"
   - Check with payment provider they're active

---

## Performance Tips

### Optimize Images

All images use external URLs (Unsplash). To serve locally:
```bash
mkdir assets
# Download images to assets/
# Update HTML to reference local paths
```

### Enable Caching

In `vercel.json`, add:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000" }]
    }
  ]
}
```

---

## Rollback to Previous Deployment

If something breaks:

1. Vercel Dashboard → `Deployments`
2. Find previous working deployment
3. Click `...` → `Promote to Production`
4. Verify site is back to normal

---

## Cost

**Vercel Free Tier Includes:**
- ✓ Unlimited serverless functions
- ✓ 100 GB bandwidth/month
- ✓ 1000 Function executions/day
- ✓ Free SSL certificate
- ✓ Automatic deployments from git

**Estimated Monthly Cost:**
- Stripe: ~2-3% of transaction volume
- CIMB: Variable (contact for rates)
- Vercel: FREE (unless exceeding limits)

---

## Support & Monitoring

### Enable Notifications

Vercel Dashboard → `Settings` → `Notifications`:
- Email on failed deployments
- Slack/Teams integration available

### Monitor Performance

Vercel provides built-in analytics:
- Page load times
- Top pages
- Error rates
- Traffic by location

---

## Next Steps

After deployment:

1. **Test all features** in production environment
2. **Set up payment system:**
   - Stripe: Configure transaction webhooks
   - CIMB: Set up payment notifications
3. **Enable analytics** (Google Analytics, Vercel Analytics)
4. **Set up monitoring** (Sentry for error tracking)
5. **Schedule backups** if using any database

---

## Quick Checklist

- [ ] Git initialized and code pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variables set in Vercel
- [ ] Frontend API endpoints updated to Vercel domain
- [ ] Test payment works (Stripe card + CIMB flow)
- [ ] Custom domain DNS configured (if using your own)
- [ ] SSL certificate active (Vercel auto-provides)
- [ ] Monitoring/alerts configured
- [ ] Mobile tested (responsive design)

---

**Questions?** Email info@northborneosabah.my or check Vercel docs at vercel.com/docs

**Last Updated:** February 2026
