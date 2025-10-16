# 🚀 FutuChat - Crypto Payment & Telegram Auth Integration

> Advanced AI chat platform with cryptocurrency payments and Telegram authentication

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![Coinbase Commerce](https://img.shields.io/badge/Payments-Coinbase%20Commerce-1652F0?logo=coinbase)](https://commerce.coinbase.com)
[![Telegram](https://img.shields.io/badge/Auth-Telegram-26A5E4?logo=telegram)](https://telegram.org)
[![X.AI](https://img.shields.io/badge/AI-X.AI%20Grok-000000)](https://x.ai)

---

## 🌟 Features

### 💰 Cryptocurrency Payments
- Accept BTC, ETH, USDC, USDT, DAI, and more via Coinbase Commerce
- Two pricing tiers: **7 Days ($30)** and **30 Days ($80)**
- Secure payment verification with webhook signatures
- Real-time payment status tracking

### 🔐 Telegram Authentication
- One-click login with Telegram OAuth
- Secure identity verification
- No email/password required
- Privacy-preserving (only Telegram ID stored)

### 💬 AI Chat Interface
- Powered by X.AI Grok
- Markdown rendering with syntax highlighting
- Code block copy functionality
- Conversation history persistence

### 🎨 Beautiful UI
- Modern glassmorphism design
- Neon glow effects and animations
- Fully mobile-responsive
- Dark cyberpunk aesthetic

---

## 🏗️ Architecture

```
Frontend (HTML/CSS/JS)
    ↓
Vercel Serverless Functions
    ↓
External APIs:
├─ Coinbase Commerce (Payments)
├─ Telegram Bot API (Authentication)
└─ X.AI Grok (Chat AI)
```

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed flow diagrams**

---

## 🚀 Quick Start

### Prerequisites
- Vercel account
- Coinbase Commerce account
- Telegram bot token
- X.AI API key

### Setup (20 minutes)

1. **Clone and Deploy**
   ```bash
   git clone <your-repo>
   cd futuchat
   vercel
   ```

2. **Configure Services** (see [QUICK_START.md](./QUICK_START.md))
   - Set up Coinbase Commerce
   - Create Telegram bot
   - Add environment variables

3. **Update Configuration**
   - Edit `app.js` line 381 with your bot username
   - Deploy changes

4. **Test Payment Flow**
   - Visit your deployed site
   - Test with small payment amount
   - Verify Telegram login works

**📖 Detailed instructions:** [QUICK_START.md](./QUICK_START.md)

---

## ⚙️ Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# AI Chat (existing)
XAI_API_KEY=your_xai_key
SYSTEM_PROMPT=your_custom_prompt

# Crypto Payments (new)
COINBASE_COMMERCE_API_KEY=your_coinbase_key
COINBASE_WEBHOOK_SECRET=your_webhook_secret

# Telegram Auth (new)
TELEGRAM_BOT_TOKEN=1234567890:ABC...
TELEGRAM_BOT_USERNAME=your_bot_username
```

**📖 Setup guide:** [PAYMENT_SETUP_GUIDE.md](./PAYMENT_SETUP_GUIDE.md)

---

## 📁 Project Structure

```
/workspace
├── index.html                  # Main UI
├── app.js                      # Frontend logic
├── styles.css                  # Styling
├── logo.svg                    # Brand logo
│
├── api/
│   ├── chat.js                # X.AI Grok integration
│   ├── create-charge.js       # Create payment charge
│   ├── webhook.js             # Payment webhooks
│   ├── verify-payment.js      # Verify payment status
│   └── activate-telegram.js   # Telegram auth & activation
│
└── docs/
    ├── QUICK_START.md         # Fast setup guide
    ├── PAYMENT_SETUP_GUIDE.md # Detailed payment setup
    ├── ARCHITECTURE.md        # Technical architecture
    └── IMPLEMENTATION_SUMMARY.md  # What was built
```

---

## 🎯 User Flow

1. **User visits site** → Sees pricing plans with "Buy with Crypto" buttons
2. **Clicks buy** → Redirects to Coinbase Commerce payment page
3. **Pays with crypto** → BTC, ETH, USDC, or other supported coins
4. **Payment confirms** → Returns to app with success screen
5. **Logs in via Telegram** → One-click OAuth authentication
6. **Auto-activation** → Access key generated and activated
7. **Access granted** → Can now use AI chat interface

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed flow diagrams**

---

## 🔒 Security

### Multi-Layer Security:
- ✅ **Payment Verification:** Webhook HMAC-SHA256 signature validation
- ✅ **Identity Verification:** Telegram auth hash cryptographic verification
- ✅ **Access Control:** SHA-256 hashed access keys with time-based expiration
- ✅ **API Protection:** Environment variables, HTTPS-only, sanitized errors

### Best Practices:
- No sensitive data in client code
- All secrets in environment variables
- Signature verification on all webhooks
- Auth timestamp expiration checks
- Hashed key storage (not plaintext)

---

## 🧪 Testing

### Test Payment Flow:
```bash
# 1. Create test charge
curl -X POST https://your-domain.vercel.app/api/create-charge \
  -H "Content-Type: application/json" \
  -d '{"plan":"7-day","amount":30,"duration":7}'

# 2. Verify payment (after paying)
curl "https://your-domain.vercel.app/api/verify-payment?chargeCode=ABC123"
```

### Manual Testing:
1. Click "Buy with Crypto" button
2. Complete small test payment ($1-2)
3. Return to app after payment
4. Login with Telegram
5. Verify auto-activation works
6. Test chat functionality

---

## 📊 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/create-charge` | POST | Create Coinbase payment charge |
| `/api/webhook` | POST | Receive payment confirmations |
| `/api/verify-payment` | GET | Check payment status |
| `/api/activate-telegram` | POST | Verify Telegram & activate access |
| `/api/chat` | POST | AI chat endpoint (existing) |

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed API documentation**

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Fast setup in 20 minutes
- **[PAYMENT_SETUP_GUIDE.md](./PAYMENT_SETUP_GUIDE.md)** - Complete payment setup
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture & flows
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built
- **[VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)** - Environment variables

---

## 🎨 UI Screenshots

### Pricing Plans
Beautiful pricing cards with "Buy with Crypto" buttons, neon glow effects, and "Most Popular" badge.

### Payment Success
Animated success screen with Telegram login widget integration.

### Chat Interface
Modern dark theme with markdown rendering, code highlighting, and smooth animations.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Vercel Serverless Functions (Node.js)
- **Payments:** Coinbase Commerce API
- **Authentication:** Telegram Bot API OAuth
- **AI:** X.AI Grok API
- **Deployment:** Vercel
- **Storage:** localStorage (client-side)

### Recommended for Production:
- **Database:** Vercel KV, Upstash Redis, or Supabase
- **Monitoring:** Sentry, LogRocket
- **Analytics:** Vercel Analytics, PostHog

---

## 📈 Roadmap

### ✅ Completed:
- Crypto payment integration
- Telegram authentication
- Auto-activation flow
- Payment webhooks
- Beautiful UI/UX
- Mobile responsive design
- Comprehensive documentation

### 🚧 Recommended Next:
- [ ] Database integration for persistence
- [ ] User dashboard for subscription management
- [ ] Email notifications
- [ ] Admin panel
- [ ] Usage analytics
- [ ] Rate limiting
- [ ] Automated testing

### 🔮 Future Ideas:
- Team/organization plans
- Referral system
- Multiple pricing tiers
- API access tiers
- Mobile app
- White-label options

---

## 🆘 Troubleshooting

### Payment Issues
- **"Payment system not configured"** → Add `COINBASE_COMMERCE_API_KEY` to Vercel
- **"Invalid webhook signature"** → Check `COINBASE_WEBHOOK_SECRET` matches
- **Payment not confirming** → Wait for blockchain confirmation (can take 10-60 min for BTC)

### Telegram Issues
- **Login button not showing** → Update bot username in `app.js`
- **"Telegram bot not configured"** → Register domain with @BotFather using `/setdomain`
- **Auth failing** → Verify `TELEGRAM_BOT_TOKEN` is correct

### General Issues
- Check Vercel function logs for errors
- Verify all environment variables are set
- Test each API endpoint individually
- Clear browser cache and localStorage

**See [PAYMENT_SETUP_GUIDE.md](./PAYMENT_SETUP_GUIDE.md) for detailed troubleshooting**

---

## 📞 Support

- **Documentation:** See docs/ folder
- **Coinbase Commerce:** https://commerce.coinbase.com/docs
- **Telegram Bots:** https://core.telegram.org/bots
- **Vercel:** https://vercel.com/docs

---

## 📄 License

[Your License Here]

---

## 🙏 Acknowledgments

- **Coinbase Commerce** - Crypto payment infrastructure
- **Telegram** - Authentication platform
- **X.AI** - Grok AI model
- **Vercel** - Serverless deployment platform

---

## 🎯 Get Started Now!

1. Read [QUICK_START.md](./QUICK_START.md)
2. Set up Coinbase Commerce & Telegram bot
3. Configure environment variables
4. Deploy and test!

**You'll be accepting crypto payments in 20 minutes! 🚀**

---

*Built with ❤️ for the cybersecurity community*
