// Activate Access after Telegram Login
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!TELEGRAM_BOT_TOKEN) {
    return res.status(500).json({ error: 'Telegram auth not configured' });
  }

  const { telegramData, chargeCode } = req.body;

  if (!telegramData || !chargeCode) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    // Verify Telegram login data
    const checkString = Object.keys(telegramData)
      .filter(key => key !== 'hash')
      .sort()
      .map(key => `${key}=${telegramData[key]}`)
      .join('\n');

    const secretKey = crypto.createHash('sha256')
      .update(TELEGRAM_BOT_TOKEN)
      .digest();

    const hash = crypto.createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');

    if (hash !== telegramData.hash) {
      return res.status(401).json({ error: 'Invalid Telegram authentication' });
    }

    // Check if auth is not too old (within 24 hours)
    const authTime = parseInt(telegramData.auth_date);
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - authTime > 86400) {
      return res.status(401).json({ error: 'Telegram authentication expired' });
    }

    // Verify payment was confirmed
    const COINBASE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY;
    const paymentResponse = await fetch(
      `https://api.commerce.coinbase.com/charges/${chargeCode}`,
      {
        headers: {
          'X-CC-Api-Key': COINBASE_API_KEY,
          'X-CC-Version': '2018-03-22'
        }
      }
    );

    if (!paymentResponse.ok) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const paymentData = await paymentResponse.json();
    const charge = paymentData.data;
    
    const isConfirmed = charge.timeline?.some(
      event => event.status === 'CONFIRMED' || event.status === 'RESOLVED'
    );

    if (!isConfirmed) {
      return res.status(402).json({ error: 'Payment not confirmed yet' });
    }

    // Generate access key based on Telegram user ID and charge
    const accessKeyString = `${telegramData.id}-${chargeCode}-${Date.now()}`;
    const accessKey = crypto.createHash('sha256')
      .update(accessKeyString)
      .digest('hex')
      .substring(0, 32);

    // Calculate expiration based on plan duration
    const duration = parseInt(charge.metadata.duration) || 30;
    const expiresAt = Date.now() + (duration * 24 * 60 * 60 * 1000);

    // In production, store this in a database:
    // - accessKey hash
    // - telegramUserId
    // - chargeCode
    // - createdAt
    // - expiresAt
    
    console.log('Access activated:', {
      telegramId: telegramData.id,
      username: telegramData.username,
      chargeCode,
      duration,
      accessKey: accessKey.substring(0, 8) + '...'
    });

    return res.status(200).json({
      success: true,
      accessKey,
      expiresAt,
      duration,
      user: {
        id: telegramData.id,
        firstName: telegramData.first_name,
        username: telegramData.username
      }
    });

  } catch (error) {
    console.error('Activation error:', error);
    return res.status(500).json({ 
      error: 'Activation failed',
      message: error.message 
    });
  }
}
