// Stripe Checkout Server for Northborne O Sabah
// Requires: npm install express stripe cors dotenv
// Usage: STRIPE_SECRET_KEY=sk_test_... npm start

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_SECRET_KEY');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Product catalog (unit_amount in cents, currency lowercase)
const PRICE_MAP = {
  'apple': {
    unit_amount: 1200,
    currency: 'myr',
    name: 'Sabah Organic Apple (1 kg)',
    image: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=200'
  },
  'honey': {
    unit_amount: 4500,
    currency: 'myr',
    name: 'Local Wild Honey (250g)',
    image: 'https://images.unsplash.com/photo-1587049352861-d91d84f3f990?w=200'
  },
  'spice': {
    unit_amount: 1500,
    currency: 'myr',
    name: 'Traditional Spice Mix (100g)',
    image: 'https://images.unsplash.com/photo-1596040299140-b65b43a08a99?w=200'
  }
};

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    
    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    // Build line items
    const line_items = items.map(item => {
      const product = PRICE_MAP[item.id];
      
      if (!product) {
        throw new Error(`Unknown product: ${item.id}`);
      }

      return {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            images: [product.image]
          },
          unit_amount: product.unit_amount
        },
        quantity: item.quantity || 1
      };
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.BASE_URL || 'http://localhost:8000'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:8000'}/cancel.html`,
      locale: 'auto'
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Real CIMB API integration (Connect API v2)
// Supports both production and sandbox environments
app.post('/create-cimb-payment', async (req, res) => {
  try {
    const { amount, currency = 'MYR', description = 'Investment in Northborne O Sabah' } = req.body || {};
    const numericAmount = Number(amount);
    
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // CIMB API endpoints and credentials
    const isSandbox = process.env.NODE_ENV !== 'production';
    const baseUrl = isSandbox 
      ? 'https://sandbox.apiconnect.cimb.com' 
      : 'https://api.apiconnect.cimb.com';
    
    const clientId = process.env.CIMB_CLIENT_ID;
    const clientSecret = process.env.CIMB_CLIENT_SECRET;
    const amaniAccount = process.env.AMANI_ACCOUNT || '00012345678';

    if (!clientId || !clientSecret) {
      return res.status(500).json({ 
        error: 'CIMB credentials not configured. Set CIMB_CLIENT_ID and CIMB_CLIENT_SECRET in .env' 
      });
    }

    // Step 1: Get OAuth2 access token
    const tokenUrl = `${baseUrl}/oauth/access_token`;
    const tokenAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${tokenAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&scope=payments'
    });

    if (!tokenRes.ok) {
      const tokenErr = await tokenRes.text();
      console.error('CIMB token error:', tokenErr);
      return res.status(401).json({ error: 'Failed to authenticate with CIMB API' });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: Create payment request using CIMB Connect API
    const paymentUrl = `${baseUrl}/v2.0/payment-initiation/payments`;
    const idempotencyKey = `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const paymentPayload = {
      debtorAccount: amaniAccount,
      instructedAmount: {
        amount: (numericAmount / 100).toFixed(2), // CIMB expects amount as string
        currency: currency.toUpperCase()
      },
      creditorAccount: amaniAccount, // Investment funds to Amani account
      creditorName: 'Northborne O Sabah - Amani Malaysia Group',
      remittanceInformation: description,
      endToEndIdentification: idempotencyKey
    };

    const paymentRes = await fetch(paymentUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
        'X-Request-ID': idempotencyKey
      },
      body: JSON.stringify(paymentPayload)
    });

    if (!paymentRes.ok) {
      const paymentErr = await paymentRes.json();
      console.error('CIMB payment creation error:', paymentErr);
      return res.status(paymentRes.status).json({ 
        error: paymentErr.message || 'Failed to create CIMB payment' 
      });
    }

    const paymentData = await paymentRes.json();

    // Step 3: Return payment details to client
    const response = {
      status: 'success',
      provider: 'cimb_connect_api',
      environment: isSandbox ? 'sandbox' : 'production',
      payment_id: paymentData.paymentId || idempotencyKey,
      amount: numericAmount,
      currency: currency,
      beneficiary_account: amaniAccount,
      beneficiary_name: 'Northborne O Sabah - Amani Malaysia Group',
      description: description,
      status: paymentData.transactionStatus || 'PENDING',
      consent_url: paymentData.links?.consentUrl || null,
      created_at: new Date().toISOString()
    };

    console.log('CIMB payment created successfully:', response);
    return res.json(response);
  } catch (err) {
    console.error('CIMB payment error:', err.message);
    return res.status(500).json({ error: `Payment processing error: ${err.message}` });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: 'Northborne O Sabah Stripe Server' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 4242;

// Export for Vercel serverless
module.exports = app;

// Local development server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n✓ Northborne O Sabah Stripe Server running on http://localhost:${PORT}`);
    console.log(`✓ POST   /create-checkout-session — Create Stripe checkout`);
    console.log(`✓ POST   /create-cimb-payment — Create CIMB payment`);
    console.log(`✓ GET    /health — Server status\n`);
    
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('YOUR_SECRET_KEY')) {
      console.warn('⚠️  WARNING: STRIPE_SECRET_KEY not set properly!');
      console.warn('   Set it with: export STRIPE_SECRET_KEY=sk_test_...\n');
    }
  });
}
