# 🔗 Coinbase Commerce Webhook Setup Guide

## Your Webhook Details

**Webhook URL:**
```
https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app/api/webhook
```

**Events to Subscribe:**
- `charge:confirmed`
- `charge:resolved`

---

## 📋 Step-by-Step Setup

### Step 1: Log into Coinbase Commerce

1. Go to: https://commerce.coinbase.com/
2. Log in to your account
3. Navigate to **Settings** → **Webhook subscriptions**

### Step 2: Create New Webhook (or Update Existing)

#### If Creating New:
1. Click **"Create a webhook endpoint"** or **"Add endpoint"**
2. Enter the webhook URL:
   ```
   https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app/api/webhook
   ```
3. Select events to receive:
   - ✅ `charge:confirmed` - When payment is confirmed
   - ✅ `charge:resolved` - When payment is finalized
4. Click **"Create"** or **"Save"**

#### If Updating Existing:
1. Find your existing webhook
2. Click **"Edit"** or settings icon
3. Update URL to:
   ```
   https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app/api/webhook
   ```
4. Ensure `charge:confirmed` and `charge:resolved` are selected
5. Click **"Save"**

### Step 3: Copy Webhook Secret

After creating/updating the webhook, you'll see:
- **Webhook URL:** (your URL)
- **Shared Secret:** `whsec_...` ← This is what you need!

**Copy this secret!** It looks like:
```
whsec_abc123def456ghi789jkl0mnop
```

---

## 🔐 Add Webhook Secret to Vercel

### Option 1: Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/derick-tays-projects/futuchat-webapp/settings/environment-variables

2. Click **"Add New"** or **"Add Variable"**

3. Enter:
   ```
   Name:  COINBASE_WEBHOOK_SECRET
   Value: whsec_your_actual_secret_here
   Environment: ✅ Production ✅ Preview ✅ Development
   ```

4. Click **"Save"**

### Option 2: Using API (Quick)

Run this command (replace `YOUR_SECRET_HERE` with actual secret):

```bash
curl -X POST "https://api.vercel.com/v10/projects/futuchat-webapp/env" \
  -H "Authorization: Bearer trTNIDmFXHZBh1j3Vsyi7iNm" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "COINBASE_WEBHOOK_SECRET",
    "value": "whsec_YOUR_SECRET_HERE",
    "type": "encrypted",
    "target": ["production", "preview", "development"]
  }'
```

---

## 🧪 Test Your Webhook

### Method 1: Coinbase Dashboard Test

1. In Coinbase Commerce webhook settings
2. Find your webhook
3. Click **"Send test webhook"** or similar button
4. Check Vercel logs to see if received

### Method 2: Make Small Test Payment

1. Go to your site: https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app
2. Click "Buy with Crypto" on 7-day plan
3. Complete payment with small amount ($1-2)
4. Watch Vercel logs for webhook events

### Method 3: Check Vercel Logs

```bash
# View function logs
vercel logs --follow

# Or via Vercel dashboard:
# https://vercel.com/derick-tays-projects/futuchat-webapp/logs
```

You should see:
```
[webhook] Webhook event received: charge:confirmed
[webhook] Payment confirmed for charge: ABC123XYZ
[webhook] Plan: 7-day Duration: 7
```

---

## 🔍 Webhook Payload Example

Your `/api/webhook.js` will receive payloads like this:

```json
{
  "event": {
    "type": "charge:confirmed",
    "data": {
      "code": "ABC123XYZ",
      "id": "12345678-1234-1234-1234-123456789abc",
      "pricing": {
        "local": { "amount": "30.00", "currency": "USD" }
      },
      "metadata": {
        "plan": "7-day",
        "duration": "7",
        "product": "futuchat-access"
      },
      "timeline": [
        { "status": "NEW", "time": "2024-01-01T12:00:00Z" },
        { "status": "PENDING", "time": "2024-01-01T12:01:00Z" },
        { "status": "CONFIRMED", "time": "2024-01-01T12:15:00Z" }
      ]
    }
  }
}
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Webhook URL is correct in Coinbase dashboard
- [ ] Webhook secret is copied
- [ ] `COINBASE_WEBHOOK_SECRET` added to Vercel
- [ ] Environment variable set for Production (minimum)
- [ ] Application redeployed
- [ ] Test webhook sent successfully
- [ ] Webhook appears in Vercel logs

---

## 🚨 Troubleshooting

### Webhook Not Receiving Events

**Problem:** No events showing in logs
**Solution:**
1. Check webhook URL is exactly: `.../api/webhook`
2. Verify webhook is enabled in Coinbase
3. Check Vercel function logs for errors
4. Ensure app was redeployed after adding secret

### "Invalid signature" Error

**Problem:** Webhook rejected with signature error
**Solution:**
1. Verify `COINBASE_WEBHOOK_SECRET` matches Coinbase exactly
2. No extra spaces or newlines in secret
3. Secret must start with `whsec_`
4. Redeploy after adding correct secret

### Webhook Receives but Doesn't Process

**Problem:** Events received but not logged properly
**Solution:**
1. Check `/api/webhook.js` for errors
2. View Vercel function logs
3. Verify event types match: `charge:confirmed` or `charge:resolved`

---

## 📞 Support Links

- **Coinbase Webhook Docs:** https://commerce.coinbase.com/docs/api/#webhooks
- **Vercel Logs:** https://vercel.com/derick-tays-projects/futuchat-webapp/logs
- **Your Webhook Code:** `/workspace/api/webhook.js`

---

## 🎯 Quick Summary

1. **URL:** `https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app/api/webhook`
2. **Events:** `charge:confirmed`, `charge:resolved`
3. **Secret:** Copy from Coinbase → Add to Vercel as `COINBASE_WEBHOOK_SECRET`
4. **Redeploy:** Push to git or click redeploy in Vercel
5. **Test:** Make small payment and check logs

---

**Need the webhook secret added via API?** Just paste it here and I'll add it for you!

Format:
```
whsec_your_secret_here
```
