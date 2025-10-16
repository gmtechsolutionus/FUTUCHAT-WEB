# 🔍 Check Vercel Environment Variables

## Quick Access

**Direct Link to Your Environment Variables:**
👉 https://vercel.com/derick-tays-projects/futuchat-webapp/settings/environment-variables

---

## ✅ Required Environment Variables Checklist

### Currently Required (Existing):
- [ ] **XAI_API_KEY** - Your X.AI API key for Grok
- [ ] **SYSTEM_PROMPT** - Custom system prompt for the AI

### Newly Required (For Payment System):
- [ ] **COINBASE_COMMERCE_API_KEY** - Your Coinbase Commerce API key
- [ ] **COINBASE_WEBHOOK_SECRET** - Webhook secret from Coinbase
- [ ] **TELEGRAM_BOT_TOKEN** - Your Telegram bot token (format: 1234567890:ABC...)
- [ ] **TELEGRAM_BOT_USERNAME** - Your Telegram bot username (without @)

---

## 🔎 How to Check

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/derick-tays-projects/futuchat-webapp/settings/environment-variables
2. You should see a list of all environment variables

### Step 2: Verify Each Variable

#### ✅ Variables That Should Already Be Set:
```
XAI_API_KEY          → Should show as: xai-•••••••••••••
SYSTEM_PROMPT        → Should show as: •••••••••••••
```

#### 🆕 Variables That Need to Be Added:
```
COINBASE_COMMERCE_API_KEY  → Not set yet (need to add)
COINBASE_WEBHOOK_SECRET    → Not set yet (need to add)
TELEGRAM_BOT_TOKEN         → Not set yet (need to add)
TELEGRAM_BOT_USERNAME      → Not set yet (need to add)
```

---

## 📸 What You Should See

Your Vercel environment variables page should look like this:

```
Environment Variables
┌────────────────────────────────────────────────────┐
│ Name                          Value      Env       │
├────────────────────────────────────────────────────┤
│ XAI_API_KEY                   xai-••••  Prod/Prev/Dev │
│ SYSTEM_PROMPT                 •••••••   Prod/Prev/Dev │
│ COINBASE_COMMERCE_API_KEY     (not set)            │
│ COINBASE_WEBHOOK_SECRET       (not set)            │
│ TELEGRAM_BOT_TOKEN            (not set)            │
│ TELEGRAM_BOT_USERNAME         (not set)            │
└────────────────────────────────────────────────────┘
```

---

## ➕ How to Add Missing Variables

### For Coinbase Commerce:

1. **Get API Key:**
   - Go to: https://commerce.coinbase.com/
   - Navigate to Settings → API Keys
   - Create new API key or copy existing one
   - Should look like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

2. **Add to Vercel:**
   ```
   Name:  COINBASE_COMMERCE_API_KEY
   Value: [paste your Coinbase API key]
   Environment: ✅ Production, ✅ Preview, ✅ Development
   ```

3. **Get Webhook Secret:**
   - Go to: https://commerce.coinbase.com/settings/webhook-subscriptions
   - Create webhook or view existing
   - Webhook URL: https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app/api/webhook
   - Copy the webhook secret
   - Should look like: `whsec_abc123def456ghi789jkl`

4. **Add to Vercel:**
   ```
   Name:  COINBASE_WEBHOOK_SECRET
   Value: [paste your webhook secret]
   Environment: ✅ Production, ✅ Preview, ✅ Development
   ```

### For Telegram Bot:

1. **Get Bot Token:**
   - Open Telegram, search: @BotFather
   - Send: `/newbot`
   - Follow prompts to create bot
   - Copy the token (format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

2. **Add to Vercel:**
   ```
   Name:  TELEGRAM_BOT_TOKEN
   Value: [paste your bot token]
   Environment: ✅ Production, ✅ Preview, ✅ Development
   ```

3. **Set Bot Domain:**
   - In BotFather, send: `/setdomain`
   - Select your bot
   - Enter: `futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app`

4. **Add Username to Vercel:**
   ```
   Name:  TELEGRAM_BOT_USERNAME
   Value: your_bot_username (without @)
   Environment: ✅ Production, ✅ Preview, ✅ Development
   ```

---

## 🔄 After Adding Variables

### Important: You MUST Redeploy!

Environment variables only take effect after redeployment.

**Option 1: Trigger from GitHub**
```bash
git commit --allow-empty -m "Update environment variables"
git push
```

**Option 2: Use Vercel Dashboard**
1. Go to: https://vercel.com/derick-tays-projects/futuchat-webapp
2. Click "Redeploy" on the latest deployment

**Option 3: Use Vercel CLI** (if installed)
```bash
vercel --prod
```

---

## 🧪 Test If Variables Are Set

Create a test API endpoint to verify:

### Test Endpoint (Temporary):
Create `/workspace/api/test-env.js`:
```javascript
export default async function handler(req, res) {
  const envVars = {
    XAI_API_KEY: !!process.env.XAI_API_KEY,
    SYSTEM_PROMPT: !!process.env.SYSTEM_PROMPT,
    COINBASE_COMMERCE_API_KEY: !!process.env.COINBASE_COMMERCE_API_KEY,
    COINBASE_WEBHOOK_SECRET: !!process.env.COINBASE_WEBHOOK_SECRET,
    TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_BOT_USERNAME: !!process.env.TELEGRAM_BOT_USERNAME,
  };

  return res.status(200).json({
    message: 'Environment variable check',
    variables: envVars,
    allSet: Object.values(envVars).every(v => v === true)
  });
}
```

### Test It:
```bash
curl https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app/api/test-env
```

**Expected Response:**
```json
{
  "message": "Environment variable check",
  "variables": {
    "XAI_API_KEY": true,
    "SYSTEM_PROMPT": true,
    "COINBASE_COMMERCE_API_KEY": true,
    "COINBASE_WEBHOOK_SECRET": true,
    "TELEGRAM_BOT_TOKEN": true,
    "TELEGRAM_BOT_USERNAME": true
  },
  "allSet": true
}
```

---

## 🚨 Common Issues

### Issue 1: Variables Not Showing
**Cause:** Not saved correctly
**Fix:** Make sure to click "Save" after adding each variable

### Issue 2: Variables Not Working After Adding
**Cause:** No redeployment
**Fix:** Redeploy the application (see "After Adding Variables" above)

### Issue 3: "API key not configured" Error
**Cause:** Variable name typo or wrong environment selected
**Fix:** 
- Check spelling exactly matches (case-sensitive)
- Ensure "Production" environment is checked
- Redeploy

### Issue 4: Webhook Secret Not Working
**Cause:** Wrong secret or special characters issue
**Fix:**
- Copy secret directly from Coinbase dashboard
- No extra spaces or newlines
- Must match exactly

---

## 📋 Current Status Summary

### What We Know:
✅ **Project exists:** futuchat-webapp on Vercel
✅ **URL:** https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app
✅ **XAI_API_KEY:** Likely already set (for chat to work)

### What You Need to Check:
❓ **COINBASE_COMMERCE_API_KEY** - Need to verify/add
❓ **COINBASE_WEBHOOK_SECRET** - Need to verify/add
❓ **TELEGRAM_BOT_TOKEN** - Need to verify/add
❓ **TELEGRAM_BOT_USERNAME** - Need to verify/add

---

## 🎯 Quick Action Plan

1. **Check existing variables** (2 min)
   - Visit: https://vercel.com/derick-tays-projects/futuchat-webapp/settings/environment-variables
   - Confirm XAI_API_KEY and SYSTEM_PROMPT are set

2. **Set up Coinbase Commerce** (10 min)
   - Create account if needed
   - Get API key and webhook secret
   - Add both to Vercel

3. **Set up Telegram Bot** (5 min)
   - Create bot via @BotFather
   - Get token and username
   - Add both to Vercel

4. **Redeploy** (1 min)
   - Trigger new deployment

5. **Test** (5 min)
   - Visit your site
   - Try the payment flow

**Total Time: ~25 minutes**

---

## 📞 Need Help?

If you're stuck, let me know which step you're on and I'll help you through it!

**Most common help needed:**
- "How do I get Coinbase API key?" → See PAYMENT_SETUP_GUIDE.md
- "How do I create Telegram bot?" → See QUICK_START.md  
- "Variables not working" → Did you redeploy?
- "Where is webhook URL?" → It's already in your code: `/api/webhook`
