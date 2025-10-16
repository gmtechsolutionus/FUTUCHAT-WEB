# 🔍 How to Find Your Coinbase Webhook Secret

## ⚠️ What You Sent vs What We Need

**What you sent:**
```
96574bb9-9e20-403a-8159-ae6755e4c090
```
This looks like a **UUID** or **API Key ID**, not a webhook secret.

**What we need:**
```
whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx
```
Webhook secrets start with `whsec_` followed by a long string.

---

## 📍 Where to Find the Webhook Secret

### Step 1: Go to Coinbase Commerce Dashboard

1. Visit: https://commerce.coinbase.com/
2. Log in to your account

### Step 2: Navigate to Webhook Settings

1. Click on **Settings** (gear icon) in the sidebar
2. Select **Webhook subscriptions**

### Step 3: Find or Create Webhook

#### If you see an existing webhook:
```
┌──────────────────────────────────────────┐
│ Webhook Subscriptions                    │
├──────────────────────────────────────────┤
│ Endpoint URL: https://your-site.com/...  │
│ Status: Active ✓                         │
│                                          │
│ Shared secret: whsec_abc123... [Show]   │  ← Click "Show"
│                                          │
│ Events: charge:confirmed, charge:...    │
└──────────────────────────────────────────┘
```

1. Find the **"Shared secret"** or **"Webhook secret"** field
2. Click **"Show"** or **"Reveal"** button
3. Copy the entire secret (starts with `whsec_`)

#### If you DON'T have a webhook yet:
```
1. Click "Create webhook endpoint" or "Add endpoint"
2. Enter webhook URL:
   https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app/api/webhook
3. Select events:
   - ✅ charge:confirmed
   - ✅ charge:resolved
4. Click "Create"
5. The webhook secret will be displayed
6. Copy it immediately (starts with whsec_)
```

---

## 🎯 What Different Keys Look Like

### ❌ What you sent (NOT webhook secret):
```
96574bb9-9e20-403a-8159-ae6755e4c090
```
This is likely:
- API Key ID
- Charge ID
- Organization ID

### ✅ API Key (already have this):
```
Format: Long alphanumeric string or UUID
Example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
Location: Settings → API Keys
Variable: COINBASE_COMMERCE_API_KEY ✓ Already set!
```

### ✅ Webhook Secret (what we need):
```
Format: whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx
Example: whsec_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
Location: Settings → Webhook Subscriptions
Variable: COINBASE_WEBHOOK_SECRET ← Need this!
```

---

## 📸 Visual Guide

### In Coinbase Commerce Dashboard:

```
Navigation Bar:
[Home] [Payments] [Checkout] [Settings] ← Click here

Settings Menu:
├─ General
├─ API Keys        ← Your API key is here (already have)
├─ Webhook subscriptions  ← Webhook secret is here (need this)
├─ Notifications
└─ Security
```

### Webhook Page Looks Like:

```
┌─────────────────────────────────────────────────┐
│ Webhook Subscriptions                           │
│                                                 │
│ Configure webhooks to receive real-time events │
│                                                 │
│ [+ Create webhook endpoint]                     │
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ Endpoint #1                                 ││
│ │ URL: https://your-site.vercel.app/api/...  ││
│ │                                             ││
│ │ Shared secret: whsec_•••••••••  [Show]     ││ ← Click Show
│ │                                             ││
│ │ Events:                                     ││
│ │ • charge:confirmed                          ││
│ │ • charge:resolved                           ││
│ │                                             ││
│ │ [Edit] [Delete] [Test]                      ││
│ └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

## 🔐 Complete Setup Checklist

### Already Completed ✅
- [x] Coinbase Commerce account created
- [x] API key obtained
- [x] API key added to Vercel: `COINBASE_COMMERCE_API_KEY`

### Need to Complete ❌
- [ ] Go to Settings → Webhook subscriptions
- [ ] Create or find webhook endpoint
- [ ] Copy webhook secret (starts with `whsec_`)
- [ ] Send webhook secret to me
- [ ] I'll add it to Vercel
- [ ] Redeploy app
- [ ] Test payment flow

---

## 💡 Quick Tips

### Tip 1: Can't Find Webhook Settings?
Try these URLs directly:
- https://commerce.coinbase.com/settings
- https://commerce.coinbase.com/settings/webhook-subscriptions

### Tip 2: Webhook Not Created Yet?
Create it now with:
- **URL:** `https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app/api/webhook`
- **Events:** `charge:confirmed`, `charge:resolved`

### Tip 3: Secret Not Visible?
Some dashboards hide it by default. Look for:
- "Show" button
- "Reveal" button
- Eye icon 👁️
- "View secret" link

---

## 📞 Still Can't Find It?

If you're having trouble, tell me what you see on your screen and I'll guide you step by step!

**Send me a screenshot or describe the Coinbase webhook page**, and I'll help you locate the webhook secret.

---

## ⚡ Once You Have It

When you find the webhook secret (starts with `whsec_`), just paste it here and I'll:
1. Add it to Vercel immediately
2. Verify it's set correctly
3. Help you redeploy
4. Test the webhook

**Looking for something that starts with:** `whsec_`
