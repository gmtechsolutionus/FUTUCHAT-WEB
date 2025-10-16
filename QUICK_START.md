# 🚀 Quick Start - Crypto Payment & Telegram Login

## ✅ What's Been Implemented

Your FutuChat app now has a complete payment and authentication flow:

### Frontend Features:
- ✅ "Buy with Crypto" buttons on pricing cards
- ✅ Beautiful payment success screen
- ✅ Telegram login integration
- ✅ Auto-activation after payment + login
- ✅ Smooth animations and transitions
- ✅ Mobile-responsive design
- ✅ Loading states and error handling

### Backend APIs:
- ✅ `/api/create-charge` - Creates Coinbase Commerce charges
- ✅ `/api/webhook` - Handles Coinbase payment webhooks
- ✅ `/api/verify-payment` - Verifies payment status
- ✅ `/api/activate-telegram` - Verifies Telegram auth & activates access

### Security:
- ✅ Webhook signature verification
- ✅ Telegram auth hash verification
- ✅ SHA-256 access key hashing
- ✅ Time-based auth expiration
- ✅ Environment variable protection

---

## ⚙️ Configuration Required (3 Steps)

### Step 1: Set Up Coinbase Commerce (10 minutes)

1. Go to https://commerce.coinbase.com/
2. Create account & complete verification
3. Get API key from Settings → API Keys
4. Get webhook secret from Settings → Webhooks
5. Add webhook URL: `https://your-domain.vercel.app/api/webhook`

### Step 2: Create Telegram Bot (5 minutes)

1. Open Telegram, search `@BotFather`
2. Send `/newbot` and follow instructions
3. Save the bot token (e.g., `1234567890:ABCdef...`)
4. Send `/setdomain` and enter your domain
5. Save the bot username (e.g., `futuchat_access_bot`)

### Step 3: Configure Vercel (5 minutes)

Add these environment variables in Vercel:

```bash
# Existing
XAI_API_KEY=your_key_here
SYSTEM_PROMPT=your_prompt_here

# New - Payment
COINBASE_COMMERCE_API_KEY=your_coinbase_key
COINBASE_WEBHOOK_SECRET=your_webhook_secret

# New - Telegram
TELEGRAM_BOT_TOKEN=1234567890:ABCdef...
TELEGRAM_BOT_USERNAME=futuchat_access_bot
```

Then update `app.js` line ~381:
```javascript
const BOT_USERNAME = 'futuchat_access_bot'; // Your actual bot username
```

**Deploy and you're done!**

---

## 🧪 Testing Your Setup

### Test the Full Flow:

1. **Open your app** → Should see gate overlay with pricing
2. **Click "Buy with Crypto"** on 7-day plan ($30)
3. **Redirected to Coinbase** → Complete payment
   - Use a small test amount first!
4. **Return to app** → See "Payment Received!" screen
5. **Click Telegram login** → Authorize the bot
6. **Auto-activation** → Access granted, chat interface appears
7. **Send a message** → Should work!

### Verify Each Component:

#### Test Payment Creation:
```bash
curl -X POST https://your-domain.vercel.app/api/create-charge \
  -H "Content-Type: application/json" \
  -d '{"plan":"7-day","amount":30,"duration":7}'
```
Should return: `{ "chargeId": "...", "hostedUrl": "...", "code": "..." }`

#### Test Webhook:
1. Make a test payment in Coinbase Commerce dashboard
2. Check Vercel function logs for webhook events
3. Should see: "Webhook event received: charge:confirmed"

#### Test Payment Verification:
```bash
curl https://your-domain.vercel.app/api/verify-payment?chargeCode=YOUR_CODE
```
Should return: `{ "confirmed": true/false, "status": "...", ... }`

---

## 🎯 User Flow Overview

```
User Journey:
┌─────────────────────────────────────────────────────────────┐
│ 1. View Pricing → 2. Buy with Crypto → 3. Pay on Coinbase  │
│                                                              │
│ 4. Return to App → 5. Login with Telegram → 6. Activated!  │
└─────────────────────────────────────────────────────────────┘

Technical Flow:
┌─────────────────────────────────────────────────────────────┐
│ Click Buy → API creates charge → Redirect to Coinbase      │
│                                                              │
│ Pay crypto → Webhook confirms → Return with success        │
│                                                              │
│ Show login → Auth with Telegram → Generate access key      │
│                                                              │
│ Auto-activate → Hash key → Save → Grant access to chat     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation Files

- **PAYMENT_SETUP_GUIDE.md** - Detailed setup instructions
- **ARCHITECTURE.md** - Technical architecture & flow diagrams
- **VERCEL_ENV_SETUP.md** - Environment variables reference
- **QUICK_START.md** - This file!

---

## 🆘 Common Issues

### "Payment system not configured"
→ Add `COINBASE_COMMERCE_API_KEY` to Vercel environment variables

### "Telegram bot not configured"
→ Update `BOT_USERNAME` in `app.js` line ~381

### "Invalid webhook signature"
→ Check `COINBASE_WEBHOOK_SECRET` matches Coinbase dashboard

### "Payment not confirmed yet"
→ Wait a few minutes for blockchain confirmation (BTC can take 10-60 min)

### Telegram login button not showing
→ Check bot domain is registered with @BotFather using `/setdomain`

---

## 💡 Pro Tips

1. **Test with small amounts first** - Use $1-2 to test the flow
2. **Monitor Vercel logs** - Check for API errors
3. **Use Coinbase test mode** - If available for your account
4. **Set up database** - For production, add persistent storage
5. **Enable analytics** - Track conversions and user behavior

---

## 🎉 Next Steps

### Immediate:
- [ ] Configure Coinbase Commerce
- [ ] Create Telegram bot
- [ ] Set environment variables
- [ ] Update bot username in code
- [ ] Test full payment flow

### Soon:
- [ ] Add database (Vercel KV, Upstash, or Supabase)
- [ ] Set up error monitoring (Sentry)
- [ ] Enable Vercel Analytics
- [ ] Create admin dashboard
- [ ] Set up automated testing

### Later:
- [ ] Add email notifications
- [ ] Implement referral system
- [ ] Create subscription management
- [ ] Add more payment plans
- [ ] Build Telegram bot commands

---

## 📞 Need Help?

1. Check **PAYMENT_SETUP_GUIDE.md** for detailed instructions
2. Review **ARCHITECTURE.md** for technical details
3. Check Vercel function logs for errors
4. Verify all environment variables are set
5. Test each API endpoint individually

**Support Channels:**
- Coinbase Commerce: https://help.coinbase.com/
- Telegram Bots: https://core.telegram.org/bots
- Vercel: https://vercel.com/support

---

**🔥 You're ready to accept crypto payments and authenticate users with Telegram!**

Happy launching! 🚀
