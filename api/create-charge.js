// Coinbase Commerce API - Create Charge
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const COINBASE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY;
  
  if (!COINBASE_API_KEY) {
    console.error('COINBASE_COMMERCE_API_KEY not set');
    return res.status(500).json({ error: 'Payment system not configured' });
  }

  const { plan, amount, duration } = req.body;

  if (!plan || !amount || !duration) {
    return res.status(400).json({ error: 'Missing required fields: plan, amount, duration' });
  }

  try {
    const chargeData = {
      name: `FutuChat ${plan} Access`,
      description: `${duration} days of premium FutuChat access for security professionals`,
      pricing_type: 'fixed_price',
      local_price: {
        amount: amount.toString(),
        currency: 'USD'
      },
      metadata: {
        plan: plan,
        duration: duration,
        product: 'futuchat-access'
      },
      redirect_url: `${req.headers.origin || 'https://futuchat.vercel.app'}/payment-success`,
      cancel_url: `${req.headers.origin || 'https://futuchat.vercel.app'}/`
    };

    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': COINBASE_API_KEY,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify(chargeData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Coinbase API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to create payment charge',
        details: errorData.substring(0, 300)
      });
    }

    const data = await response.json();
    
    return res.status(200).json({
      chargeId: data.data.id,
      hostedUrl: data.data.hosted_url,
      code: data.data.code
    });

  } catch (error) {
    console.error('Error creating charge:', error);
    return res.status(500).json({ 
      error: 'Payment system error',
      message: error.message 
    });
  }
}
