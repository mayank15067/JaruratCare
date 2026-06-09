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
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  appendMessage('user', text);
  chatInput.value = '';
  sendBtn.disabled = true;

  document.getElementById('quickChips').style.display = 'none';

  const typingId = showTyping();

  setTimeout(() => {
    removeTyping(typingId);

    let reply = '';

    const msg = text.toLowerCase();

    if (msg.includes('pm-jay') || msg.includes('ayushman')) {
      reply =
        'PM-JAY (Ayushman Bharat) provides health insurance coverage of up to ₹5 lakh per family per year for eligible beneficiaries. You can check eligibility on the official Ayushman Bharat portal.';
    }
    else if (
      msg.includes('fever') ||
      msg.includes('headache')
    ) {
      reply =
        'Fever and headache may be caused by infection, dehydration, or stress. Drink plenty of fluids, rest well, and consult a doctor if symptoms are severe, persist for more than 2–3 days, or are accompanied by breathing difficulties.';
    }
    else if (
      msg.includes('volunteer') ||
      msg.includes('become volunteer')
    ) {
      reply =
        'You can register using the Volunteer Registration form on this page. Our team will review your details and contact you for onboarding.';
    }
    else if (
      msg.includes('medicine') ||
      msg.includes('jan aushadhi')
    ) {
      reply =
        'The Jan Aushadhi scheme provides quality generic medicines at affordable prices through government-supported stores across India.';
    }
    else if (
      msg.includes('mental health') ||
      msg.includes('depression') ||
      msg.includes('anxiety')
    ) {
      reply =
        'Mental health is important. You may seek support from iCall, Vandrevala Foundation, or a qualified mental health professional. If you feel unsafe, seek immediate help from family or local emergency services.';
    }
    else if (
      msg.includes('patient') ||
      msg.includes('support')
    ) {
      reply =
        'Jarurat Care helps patients connect with volunteers, healthcare resources, and support services. Please fill out the Patient Support form for assistance.';
    }
    else {
      reply =
        'Thank you for your question. Jarurat Care provides healthcare support and guidance. For medical concerns, please consult a qualified healthcare professional.';
    }

    appendMessage('bot', reply);
    sendBtn.disabled = false;
  }, 1000);
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
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
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
