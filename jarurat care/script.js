// ── TAB SWITCHING ──
function switchTab(name, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

// ── FORM SUBMIT ──
function submitForm(successId) {
  const el = document.getElementById(successId);
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// ── CHATBOT ──
const messagesArea = document.getElementById('messagesArea');
const chatInput    = document.getElementById('chatInput');
const sendBtn      = document.getElementById('sendBtn');

const SYSTEM_PROMPT = `You are JaruratBot, a helpful AI health support assistant for Jarurat Care, an Indian NGO focused on providing healthcare support to underserved communities.

Your role:
- Answer health FAQs in simple, clear language suitable for general Indian public
- Explain government health schemes (PM-JAY, Ayushman Bharat, Jan Aushadhi, etc.)
- Provide basic, safe information about common symptoms and when to seek medical help
- Explain how to register as a patient or volunteer on Jarurat Care
- Provide information about free/low-cost medical resources in India
- Offer supportive guidance on mental health resources (iCall, Vandrevala Foundation, etc.)

Important rules:
- Always recommend consulting a real doctor for serious symptoms
- Never diagnose or prescribe
- Keep responses concise (3-5 sentences max unless a detailed explanation is needed)
- Use a warm, empathetic tone with occasional Hindi words when appropriate
- Focus on India-specific healthcare context`;

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  appendMessage('user', text);
  chatInput.value = '';
  sendBtn.disabled = true;

  // Hide quick chips after first message
  document.getElementById('quickChips').style.display = 'none';

  const typingId = showTyping();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: text }]
      })
    });

    removeTyping(typingId);

    if (!response.ok) {
      appendMessage('bot', "I'm having trouble connecting right now. Please try again or call our helpline at 1800-XXX-XXXX.");
      return;
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response. Please try again.";
    appendMessage('bot', reply);

  } catch (err) {
    removeTyping(typingId);
    appendMessage('bot', "Network issue detected. Please check your connection or contact our team directly.");
  } finally {
    sendBtn.disabled = false;
  }
}

function sendChip(btn) {
  chatInput.value = btn.textContent;
  sendMessage();
}

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.innerHTML = `
    <div class="msg-avatar">${role === 'bot' ? '🤖' : 'You'}</div>
    <div class="msg-bubble">${text.replace(/\n/g, '<br/>')}</div>
  `;
  messagesArea.appendChild(div);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

function showTyping() {
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'msg bot typing-indicator';
  div.id = id;
  div.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble">
      <div class="dot"></div><div class="dot"></div><div class="dot"></div>
    </div>
  `;
  messagesArea.appendChild(div);
  messagesArea.scrollTop = messagesArea.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}
