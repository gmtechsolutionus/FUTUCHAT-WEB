// Test endpoint to check if environment variables are set
// Access at: https://your-domain.vercel.app/api/test-env
// DELETE THIS FILE after verifying your environment variables!

export default async function handler(req, res) {
  // Check if each environment variable is set (returns true/false)
  const envVars = {
    XAI_API_KEY: !!process.env.XAI_API_KEY,
    SYSTEM_PROMPT: !!process.env.SYSTEM_PROMPT,
    COINBASE_COMMERCE_API_KEY: !!process.env.COINBASE_COMMERCE_API_KEY,
    COINBASE_WEBHOOK_SECRET: !!process.env.COINBASE_WEBHOOK_SECRET,
    TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_BOT_USERNAME: !!process.env.TELEGRAM_BOT_USERNAME,
  };

  // Count how many are set
  const setCount = Object.values(envVars).filter(v => v === true).length;
  const totalCount = Object.keys(envVars).length;
  const allSet = setCount === totalCount;

  // Provide helpful messages
  const missing = Object.entries(envVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  let message = '';
  if (allSet) {
    message = '✅ All environment variables are set!';
  } else {
    message = `⚠️ ${totalCount - setCount} environment variable(s) missing`;
  }

  return res.status(200).json({
    status: allSet ? 'success' : 'incomplete',
    message,
    summary: `${setCount}/${totalCount} variables set`,
    variables: envVars,
    missing: missing.length > 0 ? missing : undefined,
    allSet,
    note: 'DELETE /api/test-env.js after verification for security!'
  });
}
