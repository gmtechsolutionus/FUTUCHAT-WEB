# FutuChat Architecture - Payment & Authentication Flow

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│  │ Pricing     │  │ Payment      │  │ Telegram Login     │     │
│  │ Plans       │→ │ Processing   │→ │ & Activation       │     │
│  └─────────────┘  └──────────────┘  └────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
         ↓                  ↓                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel Serverless APIs                        │
│  ┌────────────────┐  ┌───────────────┐  ┌──────────────────┐   │
│  │ /api/          │  │ /api/         │  │ /api/            │   │
│  │ create-charge  │  │ webhook       │  │ activate-telegram│   │
│  └────────────────┘  └───────────────┘  └──────────────────┘   │
│  ┌────────────────┐  ┌───────────────┐                          │
│  │ /api/          │  │ /api/chat     │                          │
│  │ verify-payment │  │ (existing)    │                          │
│  └────────────────┘  └───────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
         ↓                  ↓                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌────────────────┐  ┌───────────────┐  ┌──────────────────┐   │
│  │ Coinbase       │  │ Telegram      │  │ X.AI Grok        │   │
│  │ Commerce API   │  │ Bot API       │  │ API              │   │
│  └────────────────┘  └───────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Payment Flow Diagram

```
┌──────────┐
│  User    │
│  Visits  │
│  Site    │
└────┬─────┘
     │
     ▼
┌──────────────────────┐
│  Gate Overlay Shows  │
│  - About             │
│  - Pricing Plans     │
│  - Buy Buttons       │
└────┬─────────────────┘
     │
     │ Clicks "Buy with Crypto"
     ▼
┌──────────────────────────┐
│  Frontend (app.js)       │
│  handleBuyPlan()         │
│  ↓                       │
│  POST /api/create-charge │
└────┬─────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│  API: create-charge.js      │
│  ↓                          │
│  Creates Coinbase charge    │
│  ↓                          │
│  Returns hostedUrl          │
└────┬────────────────────────┘
     │
     │ Store charge in localStorage
     │ Redirect to Coinbase
     ▼
┌──────────────────────────────┐
│  Coinbase Commerce           │
│  Payment Page                │
│  ↓                           │
│  User pays with crypto       │
│  (BTC, ETH, USDC, etc.)      │
└────┬─────────────────────────┘
     │
     │ Payment confirmed
     ▼
┌───────────────────────────────┐
│  Coinbase Webhook             │
│  → POST /api/webhook          │
│  (Verifies signature)         │
│                               │
│  Event: charge:confirmed      │
└───────────────────────────────┘
     │
     │ Redirect user back
     ▼
┌─────────────────────────────────┐
│  App: Payment Success Screen    │
│  ↓                              │
│  Verify payment via API         │
│  GET /api/verify-payment        │
│  ↓                              │
│  Show Telegram Login Widget     │
└────┬────────────────────────────┘
     │
     │ User clicks "Login with Telegram"
     ▼
┌──────────────────────────────────┐
│  Telegram OAuth                  │
│  ↓                               │
│  User authorizes bot             │
│  ↓                               │
│  Returns user data + auth hash   │
└────┬─────────────────────────────┘
     │
     │ onTelegramAuth(user)
     ▼
┌────────────────────────────────────┐
│  Frontend: app.js                  │
│  onTelegramAuth()                  │
│  ↓                                 │
│  POST /api/activate-telegram       │
│  - telegramData                    │
│  - chargeCode                      │
└────┬───────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  API: activate-telegram.js          │
│  ↓                                  │
│  1. Verify Telegram auth hash       │
│  2. Verify payment confirmed        │
│  3. Generate access key             │
│  4. Return activation data          │
└────┬────────────────────────────────┘
     │
     │ Returns: accessKey, expiresAt
     ▼
┌──────────────────────────────────────┐
│  Frontend: Auto-activate             │
│  ↓                                   │
│  1. Hash access key                  │
│  2. Save to ALLOWED_KEY_HASHES       │
│  3. Save activation to localStorage  │
│  4. Hide gate overlay                │
│  5. Show chat interface              │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────┐
│  User has    │
│  full access │
│  to FutuChat │
└──────────────┘
```

## 🔐 Security Architecture

### Authentication Layers:

1. **Payment Verification**
   - Coinbase Commerce webhook signature verification
   - Payment status confirmation via API
   - Prevents fake payment claims

2. **Identity Verification**
   - Telegram OAuth hash verification
   - Bot token cryptographic signing
   - Timestamp check (24h expiry)
   - Prevents auth spoofing

3. **Access Control**
   - SHA-256 hashed access keys
   - Time-based expiration
   - One payment = One Telegram ID
   - Stored in localStorage (client-side)

4. **API Security**
   - Environment variable secrets
   - HTTPS-only communication
   - CORS protection
   - Rate limiting (recommended)

## 📁 File Structure

```
/workspace
├── index.html                    # Main UI with pricing, payment, auth
├── app.js                        # Frontend logic
├── styles.css                    # Styling with payment UI
├── logo.svg                      # Brand logo
│
├── api/
│   ├── chat.js                  # X.AI Grok chat endpoint (existing)
│   ├── create-charge.js         # Create Coinbase payment charge
│   ├── webhook.js               # Handle Coinbase webhooks
│   ├── verify-payment.js        # Verify payment status
│   └── activate-telegram.js     # Verify Telegram & activate access
│
├── vercel.json                  # Vercel configuration
├── VERCEL_ENV_SETUP.md          # Environment variables guide
├── PAYMENT_SETUP_GUIDE.md       # Detailed payment setup
└── ARCHITECTURE.md              # This file
```

## 🗄️ Data Flow & Storage

### localStorage (Client-Side):

```javascript
// Pending payment
fc_pending_charge: {
  code: "ABC123XYZ",
  chargeId: "12345678-1234-1234-1234-123456789abc",
  plan: "30-day",
  amount: 80,
  duration: 30,
  timestamp: 1697123456789
}

// Active subscription
fc_activation_v1: {
  activatedAt: 1697123456789,
  expiresAt: 1699715456789,
  keyHash: "a4b18093...",
  telegramUser: {
    id: 123456789,
    firstName: "John",
    username: "johndoe"
  }
}

// Chat history
fc_conversation_v1: [
  { role: "user", content: "Hello", ts: 1697123456789 },
  { role: "bot", content: "Hi there!", ts: 1697123456790 }
]
```

### Backend (Recommended - Not Yet Implemented):

For production, implement a database to store:

```javascript
// payments table
{
  id: uuid,
  chargeId: string,
  chargeCode: string,
  plan: string,
  amount: number,
  currency: string,
  status: enum('pending', 'confirmed', 'expired'),
  createdAt: timestamp,
  confirmedAt: timestamp,
  expiresAt: timestamp
}

// users table
{
  id: uuid,
  telegramId: bigint,
  telegramUsername: string,
  firstName: string,
  lastName: string,
  chargeId: string (FK),
  accessKeyHash: string,
  activatedAt: timestamp,
  expiresAt: timestamp,
  status: enum('active', 'expired', 'banned')
}

// usage_logs table (optional)
{
  id: uuid,
  userId: uuid (FK),
  action: enum('chat', 'payment', 'login'),
  details: jsonb,
  createdAt: timestamp
}
```

## 🔌 API Endpoints

### `/api/create-charge` (POST)
**Purpose:** Create a Coinbase Commerce payment charge

**Request:**
```json
{
  "plan": "30-day",
  "amount": 80,
  "duration": 30
}
```

**Response:**
```json
{
  "chargeId": "12345678-1234-1234-1234-123456789abc",
  "hostedUrl": "https://commerce.coinbase.com/charges/ABC123XYZ",
  "code": "ABC123XYZ"
}
```

---

### `/api/webhook` (POST)
**Purpose:** Receive Coinbase Commerce webhook events

**Headers:**
- `x-cc-webhook-signature`: Signature for verification

**Body:** Coinbase webhook payload

**Response:**
```json
{ "received": true }
```

---

### `/api/verify-payment` (GET)
**Purpose:** Check if a payment is confirmed

**Query Params:**
- `chargeCode`: The charge code to verify

**Response:**
```json
{
  "confirmed": true,
  "status": "CONFIRMED",
  "metadata": {
    "plan": "30-day",
    "duration": 30
  },
  "pricing": { ... }
}
```

---

### `/api/activate-telegram` (POST)
**Purpose:** Verify Telegram login and activate access

**Request:**
```json
{
  "telegramData": {
    "id": 123456789,
    "first_name": "John",
    "username": "johndoe",
    "auth_date": 1697123456,
    "hash": "abc123..."
  },
  "chargeCode": "ABC123XYZ"
}
```

**Response:**
```json
{
  "success": true,
  "accessKey": "a4b18093...",
  "expiresAt": 1699715456789,
  "duration": 30,
  "user": {
    "id": 123456789,
    "firstName": "John",
    "username": "johndoe"
  }
}
```

---

### `/api/chat` (POST)
**Purpose:** Chat with X.AI Grok (existing)

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
```

**Response:**
```json
{
  "content": "Hi there! How can I help you?"
}
```

## 🎯 Key Features

### ✅ Implemented:
- Crypto payment via Coinbase Commerce
- Support for BTC, ETH, USDC, USDT, DAI, and more
- Telegram OAuth integration
- Automatic access key generation
- Time-based subscriptions (7/30 days)
- Payment verification
- Secure webhook handling
- Beautiful, modern UI with animations
- Mobile responsive design
- Chat interface with markdown support
- Code block syntax highlighting
- Copy-to-clipboard functionality

### 🚧 Recommended for Production:
- Database integration (Vercel KV, Upstash, Supabase)
- Persistent payment records
- User management dashboard
- Subscription renewal reminders
- Email notifications
- Admin panel for monitoring
- Analytics and reporting
- Rate limiting
- DDoS protection
- Automated key expiration cleanup

## 🔮 Future Enhancements

1. **Multi-tier Pricing**
   - Basic, Pro, Enterprise plans
   - Different feature access per tier

2. **Team Accounts**
   - Organization subscriptions
   - Multiple users per payment

3. **Referral System**
   - Earn credits for referrals
   - Discount codes

4. **API Access**
   - Developer API keys
   - Rate limits per plan

5. **Advanced Analytics**
   - Usage statistics
   - Cost per user
   - Retention metrics

6. **Auto-Renewal**
   - Saved payment methods
   - Automatic subscription renewal

7. **Support System**
   - In-app support chat
   - Ticket system via Telegram bot

## 📞 Integration Points

### Coinbase Commerce
- **API:** https://api.commerce.coinbase.com
- **Dashboard:** https://commerce.coinbase.com
- **Docs:** https://commerce.coinbase.com/docs

### Telegram Bot API
- **API:** https://api.telegram.org
- **Bot Father:** @BotFather
- **Docs:** https://core.telegram.org/bots

### X.AI Grok
- **API:** https://api.x.ai
- **Dashboard:** https://console.x.ai
- **Docs:** https://docs.x.ai

### Vercel
- **Dashboard:** https://vercel.com
- **Docs:** https://vercel.com/docs
- **CLI:** `vercel`

## 🎓 Learning Resources

- [Coinbase Commerce Integration Guide](https://commerce.coinbase.com/docs/)
- [Telegram Login Widget](https://core.telegram.org/widgets/login)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Crypto Payment Best Practices](https://blog.coinbase.com/accepting-cryptocurrency-payments-guide)

---

**Built with ❤️ for the cybersecurity community**
