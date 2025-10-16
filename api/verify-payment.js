// Verify Payment Status
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const COINBASE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY;
  
  if (!COINBASE_API_KEY) {
    return res.status(500).json({ error: 'Payment system not configured' });
  }

  const { chargeCode } = req.query;

  if (!chargeCode) {
    return res.status(400).json({ error: 'Missing chargeCode parameter' });
  }

  try {
    const response = await fetch(`https://api.commerce.coinbase.com/charges/${chargeCode}`, {
      method: 'GET',
      headers: {
        'X-CC-Api-Key': COINBASE_API_KEY,
        'X-CC-Version': '2018-03-22'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Coinbase API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to verify payment' 
      });
    }

    const data = await response.json();
    const charge = data.data;
    
    // Check if payment is confirmed
    const isConfirmed = charge.timeline?.some(
      event => event.status === 'CONFIRMED' || event.status === 'RESOLVED'
    );

    return res.status(200).json({
      confirmed: isConfirmed,
      status: charge.timeline?.[charge.timeline.length - 1]?.status || 'PENDING',
      metadata: charge.metadata,
      pricing: charge.pricing
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ 
      error: 'Verification failed',
      message: error.message 
    });
  }
}
