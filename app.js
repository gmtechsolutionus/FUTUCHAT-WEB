const ALLOWED_KEY_HASHES = new Set([
  '384ed68a54d3a53354294235ee394846665fee682f8b42fb008292043bda4973',
  '143e076b7405aeb28efb25908c9f35d60e596474e30c679d8a527d50f7f50bbf',
  'a4b1809351f07b5fd273d3764223339a0005aa988f5b98c7f6c51909780071f5',
  '654938e5f26827fa42178975ebc7a4521173312143294773e4c3173ab6c7146c',
  '6f14cc0ecf7c27acfce9151240e680c678593547e1b3aa9d49e8d7a7cdcd2bad',
  '24445fc5b93b029c1b037b2288e679c2d9b9a18eb713c58e5cf9b7ca97d0e6d4',
  'a0823759c7cfb152d69d33fbb9b616c4589d080ec7905824987b73539aa2131c',
  '77eafd14218dd6d026cf5e893e4cc78402dd9f57e1b48b076feb39154889015f',
  '29d7a7a67e0d6a163114612824c2cd83163bb1539a9bb4e22275ef5509ed6a82',
  '771ac628cd513ee6005594e6db4f2c5b0c0de69e24e53bfadda58793032cd260',
]);

const STORAGE_KEYS = {
  activation: 'fc_activation_v1',
  conversation: 'fc_conversation_v1',
};

const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;

function $(id) { return document.getElementById(id); }

async function sha256Hex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function loadActivation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.activation);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveActivation(record) {
  localStorage.setItem(STORAGE_KEYS.activation, JSON.stringify(record));
}

function isActivationValid(record) {
  if (!record || typeof record.expiresAt !== 'number') return false;
  return Date.now() < record.expiresAt;
}

function updateActivationUI(record) {
  const overlay = $('gateOverlay');
  const pill = $('activationStatus');
  if (isActivationValid(record)) {
    overlay.classList.add('hidden');
    const remainingMs = record.expiresAt - Date.now();
    const remainingDays = Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
    pill.textContent = `Active · ${remainingDays}d left`;
    pill.style.color = '#b7ffdd';
  } else {
    overlay.classList.remove('hidden');
    pill.textContent = 'Locked';
    pill.style.color = '';
  }
}

async function handleActivate() {
  const input = $('accessKeyInput');
  const error = $('gateError');
  error.textContent = '';
  const raw = (input.value || '').trim();
  if (!raw) { error.textContent = 'Access key is required.'; return; }
  try {
    const digest = await sha256Hex(raw);
    if (!ALLOWED_KEY_HASHES.has(digest)) {
      error.textContent = 'Invalid access key.';
      return;
    }
    const now = Date.now();
    const record = { activatedAt: now, expiresAt: now + DAYS_30_MS, keyHash: digest };
    saveActivation(record);
    updateActivationUI(record);
    input.value = '';
  } catch {
    error.textContent = 'Unexpected error. Try again.';
  }
}

function loadConversation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.conversation);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveConversation(messages) {
  localStorage.setItem(STORAGE_KEYS.conversation, JSON.stringify(messages));
}

const API_PATH = '/api/chat';

function renderMarkdownToHTML(markdown) {
  try {
    if (window.marked) {
      const rawHtml = window.marked.parse(markdown);
      return window.DOMPurify ? window.DOMPurify.sanitize(rawHtml) : rawHtml;
    }
  } catch {}
  // Fallback minimal formatting
  const escaped = (markdown || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/```[\s\S]*?```/g, m => {
      const code = m.slice(3, -3);
      return `<pre><code>${code}</code></pre>`;
    })
    .replace(/\n/g, '<br>');
}

function enhanceCodeBlocks(scope) {
  const blocks = scope.querySelectorAll('pre');
  blocks.forEach(pre => {
    if (pre.dataset.enhanced === '1') return;
    pre.dataset.enhanced = '1';
    pre.classList.add('code-block');
    const code = pre.querySelector('code');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code ? code.innerText : pre.innerText);
        btn.textContent = 'Copied';
        setTimeout(() => (btn.textContent = 'Copy'), 1400);
      } catch {
        btn.textContent = 'Error';
        setTimeout(() => (btn.textContent = 'Copy'), 1400);
      }
    });
    pre.appendChild(btn);
  });
}

function renderMessage(container, message) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${message.role}`;
  if (message.role === 'bot') {
    wrapper.innerHTML = renderMarkdownToHTML(message.content);
    enhanceCodeBlocks(wrapper);
  } else {
    wrapper.textContent = message.content;
  }
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

function setSendDisabled(disabled) {
  const btn = $('sendBtn');
  btn.disabled = disabled;
}

function bindComposer(messages, container) {
  const textarea = $('messageInput');
  const form = $('composer');

  const autoResize = () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(160, textarea.scrollHeight) + 'px';
  };
  textarea.addEventListener('input', () => {
    setSendDisabled(!textarea.value.trim());
    autoResize();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const activation = loadActivation();
    if (!isActivationValid(activation)) {
      $('gateOverlay').classList.remove('hidden');
      return;
    }

    const text = textarea.value.trim();
    if (!text) return;

    const user = { role: 'user', content: text, ts: Date.now() };
    messages.push(user);
    renderMessage(container, user);
    saveConversation(messages);

    textarea.value = '';
    setSendDisabled(true);
    autoResize();

    await respond(messages, container, text);
  });
}


async function respond(messages, container, userText) {
  const thinking = { role: 'bot', content: '…', ts: Date.now() };
  renderMessage(container, thinking);

  const payload = {
    // Map local conversation to Chat Completions format
    messages: messages
      .filter(m => m.role === 'user' || m.role === 'bot')
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
      .slice(-24),
  };

  try {
    console.log('Calling API at:', API_PATH);
    console.log('Payload:', payload);
    
    const res = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    console.log('API Response status:', res.status);
    
    const data = await res.json().catch((e) => {
      console.error('Failed to parse JSON response:', e);
      return {};
    });
    
    console.log('API Response data:', data);
    
    container.lastElementChild.remove();
    
    if (!res.ok) {
      const errorMsg = data.error || data.details || res.statusText || 'Unknown error';
      console.error('API Error:', errorMsg);
      throw new Error(errorMsg);
    }
    
    const reply = { role: 'bot', content: data.content || 'No response.', ts: Date.now() };
    messages.push(reply);
    renderMessage(container, reply);
    saveConversation(messages);
  } catch (err) {
    console.error('Error in respond function:', err);
    container.lastElementChild.remove();
    const reply = { role: 'bot', content: `❌ API Error: ${err.message || 'Failed to get response'}`.trim(), ts: Date.now() };
    messages.push(reply);
    renderMessage(container, reply);
    saveConversation(messages);
  }
}

function restoreMessages(messages, container) {
  container.innerHTML = '';
  for (const m of messages) renderMessage(container, m);
}

// Payment handling
async function handleBuyPlan(plan, amount, duration) {
  const buyButtons = document.querySelectorAll('.buy-btn');
  buyButtons.forEach(btn => {
    btn.disabled = true;
    btn.textContent = 'Processing...';
  });

  try {
    const response = await fetch('/api/create-charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, amount, duration })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create payment');
    }

    // Store charge info for later verification
    localStorage.setItem('fc_pending_charge', JSON.stringify({
      code: data.code,
      chargeId: data.chargeId,
      plan,
      amount,
      duration,
      timestamp: Date.now()
    }));

    // Redirect to Coinbase payment page
    window.location.href = data.hostedUrl;

  } catch (error) {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error.message}`);
    buyButtons.forEach(btn => {
      btn.disabled = false;
      btn.innerHTML = '<svg class="crypto-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.5 16.5h-3v-3h3v3zm0-4.5h-3V6h3v6z"/></svg>Buy with Crypto';
    });
  }
}

function wireBuyButtons() {
  const buyButtons = document.querySelectorAll('.buy-btn');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      const amount = btn.dataset.amount;
      const duration = btn.dataset.duration;
      handleBuyPlan(plan, amount, duration);
    });
  });
}

// Telegram login callback
window.onTelegramAuth = async function(user) {
  const errorDiv = $('activationError');
  errorDiv.textContent = '';

  const pendingCharge = localStorage.getItem('fc_pending_charge');
  if (!pendingCharge) {
    errorDiv.textContent = 'No pending payment found.';
    return;
  }

  const chargeData = JSON.parse(pendingCharge);

  try {
    // Show loading state
    const container = $('telegramLoginContainer');
    container.innerHTML = '<div class="loading">Activating your access...</div>';

    // Verify payment and activate
    const response = await fetch('/api/activate-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramData: user,
        chargeCode: chargeData.code
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Activation failed');
    }

    // Store access key hash and activate
    const keyHash = await sha256Hex(data.accessKey);
    ALLOWED_KEY_HASHES.add(keyHash);
    
    const record = {
      activatedAt: Date.now(),
      expiresAt: data.expiresAt,
      keyHash: keyHash,
      telegramUser: data.user
    };
    
    saveActivation(record);
    localStorage.removeItem('fc_pending_charge');
    
    // Show success and redirect
    container.innerHTML = `
      <div class="activation-complete">
        <div class="success-icon-large">✓</div>
        <h4>Activation Complete!</h4>
        <p>Welcome, ${data.user.firstName}! Your access is now active.</p>
        <p class="access-details">${data.duration} days • Expires: ${new Date(data.expiresAt).toLocaleDateString()}</p>
      </div>
    `;

    setTimeout(() => {
      updateActivationUI(record);
    }, 2000);

  } catch (error) {
    console.error('Activation error:', error);
    errorDiv.textContent = `Activation failed: ${error.message}`;
  }
};

// Check for payment success redirect
async function checkPaymentSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const isPaymentSuccess = window.location.pathname.includes('/payment-success') || urlParams.has('payment');
  
  if (!isPaymentSuccess) return;

  const pendingCharge = localStorage.getItem('fc_pending_charge');
  if (!pendingCharge) return;

  const chargeData = JSON.parse(pendingCharge);
  
  // Show payment success section
  $('gateActivation').classList.add('hidden');
  $('paymentSuccess').classList.remove('hidden');

  // Verify payment status
  try {
    const response = await fetch(`/api/verify-payment?chargeCode=${chargeData.code}`);
    const data = await response.json();

    if (data.confirmed) {
      // Initialize Telegram Login Widget
      initTelegramLogin();
    } else {
      $('activationError').textContent = 'Payment is being processed. Please wait and refresh the page in a few minutes.';
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    $('activationError').textContent = 'Unable to verify payment. Please contact support.';
  }
}

function initTelegramLogin() {
  const container = $('telegramLoginContainer');
  
  // Telegram bot username (without @)
  // Bot: @wormotic_bot
  const BOT_USERNAME = 'wormotic_bot';
  
  // Create Telegram login button using widget
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.setAttribute('data-telegram-login', BOT_USERNAME);
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-onauth', 'onTelegramAuth(user)');
  script.setAttribute('data-request-access', 'write');
  
  container.appendChild(script);
  
  // If bot username not configured, show error
  if (BOT_USERNAME === 'YOUR_BOT_USERNAME') {
    container.innerHTML = `
      <div class="config-error">
        <p style="color: var(--danger); margin: 10px 0;">⚠️ Telegram bot not configured</p>
        <p style="color: var(--muted); font-size: 13px;">
          Please update the bot username in app.js<br>
          See PAYMENT_SETUP_GUIDE.md for instructions
        </p>
      </div>
    `;
  }
}

function wireGate() {
  $('activateBtn').addEventListener('click', handleActivate);
  $('accessKeyInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleActivate(); }
  });
}

function clearConversation(messages, container) {
  if (confirm('Clear all messages? This cannot be undone.')) {
    messages.length = 0;
    saveConversation(messages);
    container.innerHTML = '';
  }
}

function boot() {
  const messages = loadConversation();
  const container = $('messages');

  restoreMessages(messages, container);
  bindComposer(messages, container);
  wireGate();
  wireBuyButtons();

  // Wire clear button
  $('clearBtn').addEventListener('click', () => clearConversation(messages, container));

  // Check for payment success
  checkPaymentSuccess();

  const activation = loadActivation();
  updateActivationUI(activation);
}

document.addEventListener('DOMContentLoaded', boot);
