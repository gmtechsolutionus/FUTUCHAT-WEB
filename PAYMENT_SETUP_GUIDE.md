# FutuChat - Crypto Payment & Telegram Login Setup Guide

This guide explains how to integrate Coinbase Commerce for crypto payments and Telegram login for FutuChat access control.

## 🎯 Flow Overview

### User Journey:
1. **View Pricing** → User sees pricing plans with "Buy with Crypto" buttons
2. **Initiate Payment** → Click button → Create Coinbase Commerce charge
3. **Pay with Crypto** → Redirect to Coinbase → Complete payment (BTC, ETH, USDC, etc.)
4. **Payment Confirmation** → Coinbase confirms → Redirect back to app
5. **Telegram Login** → User must login via Telegram to complete activation
6. **Auto-Activation** → System verifies payment + Telegram → Generates access key → Activates automatically
7. **Access Granted** → User can now use FutuChat

### Security Benefits:
- ✅ Payment verification via Coinbase Commerce
- ✅ User identity via Telegram OAuth
- ✅ One payment = One Telegram account
- ✅ Prevents key sharing and abuse
- ✅ Trackable user activity

---

## 🔧 Setup Instructions

### 1. Coinbase Commerce Setup

#### Create Coinbase Commerce Account:
1. Go to https://commerce.coinbase.com/
2. Sign up or login
3. Complete KYC verification (required for receiving payments)

#### Get API Credentials:
1. Navigate to **Settings** → **API Keys**
2. Create a new API key
3. Copy the **API Key** (starts with a long string)
4. Save it securely

#### Setup Webhook:
1. Go to **Settings** → **Webhook subscriptions**
2. Add webhook URL: `https://your-domain.vercel.app/api/webhook`
3. Copy the **Webhook Secret**
4. Select events to receive: `charge:confirmed`, `charge:resolved`

#### Important Notes:
- Test with small amounts first
- Coinbase Commerce supports: BTC, ETH, USDC, USDT, DAI, BCH, LTC, DOGE
- Payments are converted to USD equivalent
- Settlement to your bank account takes 1-2 business days

---

### 2. Telegram Bot Setup

#### Create Telegram Bot:
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow prompts to name your bot (e.g., "FutuChat Access Bot")
4. Choose username (e.g., `futuchat_access_bot`)
5. BotFather will give you a **Bot Token** (format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)
6. Save this token securely

#### Configure Bot for Login:
1. Send `/setdomain` to @BotFather
2. Select your bot
3. Enter your domain: `your-domain.vercel.app`
4. Send `/setdescription` and add: "Access verification bot for FutuChat"
5. Send `/setabouttext` and add: "This bot verifies your identity for FutuChat access"

#### Optional - Set Bot Commands:
```
/start - Start interaction with bot
/help - Get help with activation
/status - Check your subscription status
```

---

### 3. Vercel Environment Variables

Add these environment variables in your Vercel project:

#### Required Variables:

```bash
# X.AI API (existing)
XAI_API_KEY=your_xai_api_key_here
SYSTEM_PROMPT=your_system_prompt_here

# Coinbase Commerce
COINBASE_COMMERCE_API_KEY=your_coinbase_api_key_here
COINBASE_WEBHOOK_SECRET=your_webhook_secret_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=futuchat_access_bot
```

#### How to Add in Vercel:
1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**
6. **Redeploy** your application for changes to take effect

---

### 4. Update Frontend Configuration

#### Edit `app.js`:

Find this line (around line 381):
```javascript
script.setAttribute('data-telegram-login', 'YOUR_BOT_USERNAME');
```

Replace `YOUR_BOT_USERNAME` with your actual bot username (without @):
```javascript
script.setAttribute('data-telegram-login', 'futuchat_access_bot');
```

---

## 🗄️ Database Recommendations

The current implementation stores data temporarily. For production, integrate a database:

### Recommended Options:

#### Option 1: Vercel KV (Redis) - **Easiest**
```bash
npm install @vercel/kv
```
- ✅ Serverless-ready
- ✅ Fast key-value storage
- ✅ Built-in Vercel integration
- ✅ Free tier available

#### Option 2: Upstash Redis - **Best for scale**
```bash
npm install @upstash/redis
```
- ✅ Serverless Redis
- ✅ REST API
- ✅ Pay-as-you-go pricing

#### Option 3: Supabase PostgreSQL - **Most features**
```bash
npm install @supabase/supabase-js
```
- ✅ Full PostgreSQL database
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Storage for files

### Data to Store:

```javascript
// Payments table
{
  chargeId: string,
  chargeCode: string,
  plan: string,
  amount: number,
  duration: number,
  status: 'pending' | 'confirmed' | 'resolved',
  createdAt: timestamp,
  confirmedAt: timestamp
}

// Users table
{
  telegramId: number,
  telegramUsername: string,
  firstName: string,
  lastName: string,
  chargeCode: string, // Link to payment
  accessKeyHash: string,
  activatedAt: timestamp,
  expiresAt: timestamp
}

// Access logs (optional - for analytics)
{
  telegramId: number,
  action: 'login' | 'chat' | 'payment',
  timestamp: timestamp,
  metadata: json
}
```

---

## 🧪 Testing the Integration

### Test Mode:
1. Use small payment amounts for testing ($1-2)
2. Use Coinbase Commerce test mode if available
3. Create a test Telegram account

### Test Flow:
1. Click "Buy with Crypto" on 7-day plan
2. Should redirect to Coinbase Commerce
3. Complete payment with crypto (or use test mode)
4. Redirect back to your app
5. See payment success screen
6. Click Telegram login button
7. Authorize bot access
8. Should auto-activate and show chat interface

### Verify:
- Check Vercel logs for API calls
- Check Coinbase Commerce dashboard for payments
- Check browser console for errors
- Check localStorage for activation data

---

## 🔐 Security Best Practices

### API Keys:
- ✅ **NEVER** commit API keys to git
- ✅ Use Vercel environment variables
- ✅ Rotate keys periodically
- ✅ Use different keys for development/production

### Webhook Security:
- ✅ Always verify webhook signatures
- ✅ Check timestamp to prevent replay attacks
- ✅ Validate payload structure

### Access Control:
- ✅ Verify Telegram auth hash on backend
- ✅ Check auth_date timestamp (reject old logins)
- ✅ Store access key hashes, not plain keys
- ✅ Implement rate limiting for API endpoints

### User Privacy:
- ✅ Only store necessary Telegram data (ID, username)
- ✅ Don't store payment details (use Coinbase IDs)
- ✅ Implement data deletion on request
- ✅ Clear expired activations periodically

---

## 🚀 Going Live

### Pre-Launch Checklist:
- [ ] Coinbase Commerce account verified
- [ ] All environment variables set in Vercel
- [ ] Telegram bot domain configured
- [ ] Database integrated (recommended)
- [ ] Test full payment flow
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Enable Vercel Analytics
- [ ] Configure custom domain with SSL
- [ ] Update webhook URLs to production domain
- [ ] Test webhook delivery

### Post-Launch:
- Monitor Coinbase Commerce dashboard for payments
- Check Vercel function logs for errors
- Track user activations
- Monitor support requests via Telegram
- Set up automated expiration notifications

---

## 📊 Monitoring & Analytics

### Key Metrics to Track:
- Payment conversions (clicks → payments)
- Telegram login completion rate
- Plan popularity (7-day vs 30-day)
- User retention
- Activation errors
- Webhook delivery success

### Recommended Tools:
- **Vercel Analytics** - Page views, conversions
- **Coinbase Commerce Dashboard** - Payment analytics
- **Sentry** - Error tracking
- **PostHog** - Product analytics
- **Telegram Bot Analytics** - User engagement

---

## 🆘 Troubleshooting

### Payment Not Redirecting:
- Check COINBASE_COMMERCE_API_KEY is set correctly
- Verify API key has correct permissions
- Check Vercel function logs for errors
- Test with Coinbase Commerce API directly

### Telegram Login Not Working:
- Verify bot username in code matches actual username
- Check domain is registered with @BotFather
- Ensure HTTPS is enabled (required for Telegram login)
- Test bot token with Telegram API directly

### Webhook Not Receiving Events:
- Verify webhook URL is publicly accessible
- Check webhook secret matches environment variable
- Test signature verification logic
- Use Coinbase Commerce webhook testing tool

### Access Not Activating:
- Check browser console for errors
- Verify payment was confirmed in Coinbase
- Check localStorage for pending charge data
- Test activate-telegram API endpoint manually

---

## 📞 Support

### Coinbase Commerce:
- Docs: https://commerce.coinbase.com/docs/
- Support: https://help.coinbase.com/

### Telegram Bots:
- Docs: https://core.telegram.org/bots
- Login Widget: https://core.telegram.org/widgets/login

### Vercel:
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

---

## 🎓 Next Steps

### Enhancements:
1. **Database Integration** - Add persistent storage
2. **Email Notifications** - Notify on successful activation
3. **Subscription Management** - Allow users to check status
4. **Auto-Renewal** - Remind users before expiration
5. **Referral System** - Give discounts for referrals
6. **Usage Analytics** - Track chat usage per user
7. **Admin Dashboard** - View all activations, payments
8. **Multiple Plans** - Add more pricing tiers
9. **Discounts** - Implement promo codes
10. **Telegram Notifications** - Send messages via bot

### Advanced Features:
- Multi-currency pricing
- Team/organization plans
- API access tiers
- Custom AI model selection per plan
- Chat history export
- Priority support for premium users

---

**🎉 You're all set! Good luck with your launch!**

For questions or issues, refer to the troubleshooting section or contact support through the channels listed above.
