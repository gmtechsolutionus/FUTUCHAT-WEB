# Vercel Environment Variable Setup Guide

## ✅ Deployment Complete
**Production URL:** https://futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app

## 🔧 Setting Environment Variables in Vercel

### Important: Environment Variable Scope
When adding environment variables in Vercel, make sure to check **ALL** environments:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

### Steps to Add SYSTEM_PROMPT:

1. Go to: https://vercel.com/derick-tays-projects/futuchat-webapp/settings/environment-variables

2. Add a new environment variable:
   - **Name:** `SYSTEM_PROMPT`
   - **Value:** Your custom system prompt
   - **Environment:** Check ALL boxes (Production, Preview, Development)

3. After adding, click "Save"

4. **IMPORTANT:** Redeploy the application for changes to take effect
   - Either trigger a new deployment from Git
   - Or use the CLI: `vercel --prod`

### Required Environment Variables:

```
XAI_API_KEY=your_api_key_here
SYSTEM_PROMPT=Your custom system prompt here
XAI_MODEL=grok-4-fast
```

## 🔍 Verifying the System Prompt is Working

### Method 1: Check Vercel Logs
1. Go to your deployment: https://vercel.com/derick-tays-projects/futuchat-webapp
2. Click on the latest deployment
3. Go to "Functions" tab → Click on `api/chat`
4. View the logs - you should see:
   ```
   [API] Using system prompt: <first 100 chars of your prompt>
   [API] SYSTEM_PROMPT env exists: true
   ```

### Method 2: Test the Bot
1. Send a message asking the bot to describe itself
2. Example: "Who are you?" or "What is your role?"
3. The bot's response should reflect your custom prompt

### Method 3: Use Vercel CLI to check logs
```bash
vercel logs futuchat-webapp-aqbah6l2k-derick-tays-projects.vercel.app --token trTNIDmFXHZBh1j3Vsyi7iNm
```

## 🐛 Troubleshooting

### If the bot still uses the default prompt:

1. **Verify environment variable is set correctly:**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Ensure `SYSTEM_PROMPT` is listed
   - Make sure it's enabled for "Production"

2. **Check for typos:**
   - Variable name must be exactly: `SYSTEM_PROMPT` (all caps, underscore)

3. **Force a new deployment:**
   ```bash
   vercel --prod --force --token trTNIDmFXHZBh1j3Vsyi7iNm
   ```

4. **Check the logs** to see what prompt is actually being used

5. **Clear browser cache and reload** the app

## 📝 Example Custom Prompts

### Cyberpunk Assistant:
```
You are DarkGrok, a cyberpunk AI from the year 2089. You speak with technical precision but have an edgy, rebellious attitude. Use markdown for code and keep responses concise.
```

### Professional Assistant:
```
You are a professional business assistant. Provide clear, concise, and accurate information. Always maintain a formal tone. Use markdown formatting for code snippets.
```

### Friendly Helper:
```
You are a friendly and enthusiastic AI assistant! You love helping people and explaining things in simple terms. Always be positive and encouraging. Use emojis occasionally to add personality.
```