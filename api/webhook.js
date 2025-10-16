// Coinbase Commerce Webhook Handler
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error('COINBASE_WEBHOOK_SECRET not set');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  try {
    // Verify webhook signature
    const signature = req.headers['x-cc-webhook-signature'];
    const rawBody = JSON.stringify(req.body);
    
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    const eventType = event.event.type;

    console.log('Webhook event received:', eventType);

    // Handle different event types
    if (eventType === 'charge:confirmed' || eventType === 'charge:resolved') {
      const chargeData = event.event.data;
      const metadata = chargeData.metadata;
      
      console.log('Payment confirmed for charge:', chargeData.code);
      console.log('Plan:', metadata.plan, 'Duration:', metadata.duration);
      
      // Here you would:
      // 1. Store the payment record in your database
      // 2. Mark the charge as paid and pending Telegram auth
      // 3. The actual access key generation happens after Telegram login
      
      // For now, we'll just log it
      // In production, you'd want to use a database like:
      // - Vercel KV
      // - Upstash Redis
      // - PostgreSQL
      // - MongoDB
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
