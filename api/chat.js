// Vercel Serverless Function for X.AI API Integration
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Get API key from environment variables
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    console.error('XAI_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Get messages from request body
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request. Messages array required.' });
  }

  // Add system prompt from environment variable or use default
  const systemPromptContent = process.env.SYSTEM_PROMPT || 
    'You are a helpful assistant. Provide concise, accurate answers and refuse requests that are illegal, unsafe, or unethical. Use Markdown for code.';
  
  // Log for debugging (first 100 chars)
  console.log('[API] Using system prompt:', systemPromptContent.substring(0, 100));
  console.log('[API] SYSTEM_PROMPT env exists:', !!process.env.SYSTEM_PROMPT);
  
  const systemPrompt = {
    role: 'system',
    content: systemPromptContent
  };

  const fullMessages = [systemPrompt, ...messages];

  try {
    // Call X.AI API with chat/completions endpoint
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-3',  // Using grok-3 model
        messages: fullMessages,
        temperature: 0.3,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`X.AI API error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ 
        error: `API error: ${response.status}`,
        details: errorText.substring(0, 300)
      });
    }

    const data = await response.json();
    
    // Extract the assistant's reply
    const content = data.choices?.[0]?.message?.content || 'No response generated';
    
    return res.status(200).json({ content });

  } catch (error) {
    console.error('Error calling X.AI API:', error);
    return res.status(500).json({ 
      error: 'Failed to communicate with AI service',
      message: error.message 
    });
  }
}