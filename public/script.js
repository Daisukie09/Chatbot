// ===== State =====
const state = {
  conversations: JSON.parse(localStorage.getItem('claude_chats') || '[]'),
  currentId: null,
  isGenerating: false,
  abortController: null,
};

// ===== DOM =====
const $ = (id) => document.getElementById(id);
const el = {
  sidebar: $('sidebar'),
  overlay: $('sidebarOverlay'),
  toggleSidebar: $('toggleSidebar'),
  newChatBtn: $('newChatBtn'),
  chatHistory: $('chatHistory'),
  chatArea: $('chatArea'),
  welcomeScreen: $('welcomeScreen'),
  messageInput: $('messageInput'),
  sendBtn: $('sendBtn'),
  stopBtn: $('stopBtn'),
  chatTitle: $('chatTitle'),
  clearAllBtn: $('clearAllBtn'),
  streamToggle: $('streamToggle'),
  thinkingToggle: $('thinkingToggle'),
  charCount: $('charCount'),
};

// ===== Init =====
function init() {
  setupListeners();
  renderHistory();
  if (state.conversations.length > 0) {
    loadChat(state.conversations[0].id);
  }
  el.messageInput.focus();
}

// ===== Event Listeners =====
function setupListeners() {
  el.toggleSidebar.addEventListener('click', () => {
    el.sidebar.classList.toggle('open');
  });

  el.overlay.addEventListener('click', () => {
    el.sidebar.classList.remove('open');
  });

  el.newChatBtn.addEventListener('click', newChat);

  el.sendBtn.addEventListener('click', sendMessage);
  el.stopBtn.addEventListener('click', stopGeneration);

  el.messageInput.addEventListener('input', () => {
    autoResize();
    el.sendBtn.disabled = !el.messageInput.value.trim();
    el.charCount.textContent = el.messageInput.value.length;
  });

  el.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (el.messageInput.value.trim() && !state.isGenerating) {
        sendMessage();
      }
    }
  });

  el.clearAllBtn.addEventListener('click', () => {
    if (confirm('Delete all conversations?')) {
      state.conversations = [];
      state.currentId = null;
      save();
      renderHistory();
      showWelcome();
    }
  });
}

function autoResize() {
  const ta = el.messageInput;
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
}

// ===== Conversation Management =====
function createChat(title) {
  const chat = {
    id: Date.now().toString(),
    title: title.slice(0, 50),
    messages: [],
    created: new Date().toISOString(),
  };
  state.conversations.unshift(chat);
  state.currentId = chat.id;
  save();
  renderHistory();
  return chat;
}

function getChat() {
  return state.conversations.find((c) => c.id === state.currentId);
}

function loadChat(id) {
  state.currentId = id;
  const chat = getChat();
  if (!chat) return;
  el.chatTitle.textContent = chat.title;
  renderMessages(chat.messages);
  renderHistory();
  el.sidebar.classList.remove('open');
}

function newChat() {
  state.currentId = null;
  el.chatTitle.textContent = 'New Chat';
  showWelcome();
  renderHistory();
  el.messageInput.focus();
  el.sidebar.classList.remove('open');
}

function deleteChat(id, e) {
  e.stopPropagation();
  state.conversations = state.conversations.filter((c) => c.id !== id);
  save();
  renderHistory();
  if (state.currentId === id) {
    state.conversations.length > 0 ? loadChat(state.conversations[0].id) : newChat();
  }
}

function save() {
  localStorage.setItem('claude_chats', JSON.stringify(state.conversations));
}

// ===== Rendering =====
function renderHistory() {
  el.chatHistory.innerHTML = state.conversations
    .map(
      (c) => `
    <div class="chat-item ${c.id === state.currentId ? 'active' : ''}" onclick="loadChat('${c.id}')">
      <span class="chat-item-title"><i class="fas fa-message" style="margin-right:8px;font-size:11px;opacity:0.5"></i>${esc(c.title)}</span>
      <button class="chat-item-delete" onclick="deleteChat('${c.id}', event)"><i class="fas fa-times"></i></button>
    </div>`
    )
    .join('');
}

function showWelcome() {
  el.chatArea.innerHTML = '';
  const w = el.welcomeScreen.cloneNode(true);
  w.style.display = 'flex';
  el.chatArea.appendChild(w);
}

function renderMessages(messages) {
  el.chatArea.innerHTML = '';
  if (!messages.length) return showWelcome();
  messages.forEach((m) => {
    if (m.role === 'user') {
      addUserMsg(m.content, false);
    } else if (m.role === 'assistant') {
      addAssistantMsg(m.content, m.thinking, false);
    }
  });
  scrollDown();
}

function addUserMsg(content, animate = true) {
  removeWelcome();
  const div = document.createElement('div');
  div.className = 'message user';
  if (!animate) div.style.animation = 'none';
  div.innerHTML = `
    <div class="msg-inner">
      <div class="msg-avatar"><i class="fas fa-user"></i></div>
      <div class="msg-body">
        <div class="msg-label">You</div>
        <div class="msg-text"><p>${esc(content)}</p></div>
      </div>
    </div>`;
  el.chatArea.appendChild(div);
  scrollDown();
}

function addAssistantMsg(content, thinking = '', animate = true) {
  removeWelcome();
  const div = document.createElement('div');
  div.className = 'message assistant';
  if (!animate) div.style.animation = 'none';

  const showThinking = el.thinkingToggle.checked;
  let thinkingHtml = '';
  if (thinking && showThinking) {
    thinkingHtml = `
      <div class="thinking-block">
        <div class="thinking-header" onclick="toggleThinking(this)">
          <span><i class="fas fa-brain"></i> Thinking Process</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="thinking-content">${esc(thinking)}</div>
      </div>`;
  }

  div.innerHTML = `
    <div class="msg-inner">
      <div class="msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="msg-body">
        <div class="msg-label">Claude</div>
        ${thinkingHtml}
        <div class="msg-text">${formatMd(content)}</div>
        <div class="msg-actions">
          <button class="msg-action" onclick="copyMsg(this)"><i class="fas fa-copy"></i> Copy</button>
        </div>
      </div>
    </div>`;

  el.chatArea.appendChild(div);
  div.querySelectorAll('pre code').forEach((b) => hljs.highlightElement(b));
  scrollDown();
  return div;
}

function createStreamDiv() {
  removeWelcome();
  const div = document.createElement('div');
  div.className = 'message assistant';
  div.innerHTML = `
    <div class="msg-inner">
      <div class="msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="msg-body">
        <div class="msg-label">Claude</div>
        <div class="thinking-area"></div>
        <div class="msg-text">
          <div class="typing"><span></span><span></span><span></span></div>
        </div>
      </div>
    </div>`;
  el.chatArea.appendChild(div);
  scrollDown();
  return div;
}

function updateStreamThinking(div, thinkingText) {
  if (!el.thinkingToggle.checked) return;
  const area = div.querySelector('.thinking-area');
  area.innerHTML = `
    <div class="thinking-block">
      <div class="thinking-header" onclick="toggleThinking(this)">
        <span><i class="fas fa-brain"></i> Thinking<span class="thinking-dots"><span></span><span></span><span></span></span></span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="thinking-content">${esc(thinkingText)}</div>
    </div>`;
  // Auto-scroll thinking to bottom
  const tc = area.querySelector('.thinking-content');
  if (tc) tc.scrollTop = tc.scrollHeight;
  scrollDown();
}

function finalizeStreamThinking(div, thinkingText) {
  if (!el.thinkingToggle.checked || !thinkingText) {
    const area = div.querySelector('.thinking-area');
    if (area) area.innerHTML = '';
    return;
  }
  const area = div.querySelector('.thinking-area');
  area.innerHTML = `
    <div class="thinking-block">
      <div class="thinking-header collapsed" onclick="toggleThinking(this)">
        <span><i class="fas fa-brain"></i> Thinking Process</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="thinking-content hidden">${esc(thinkingText)}</div>
    </div>`;
}

function updateStreamText(div, text) {
  const msgText = div.querySelector('.msg-text');
  msgText.innerHTML = formatMd(text) + `
    <div class="msg-actions">
      <button class="msg-action" onclick="copyMsg(this)"><i class="fas fa-copy"></i> Copy</button>
    </div>`;
  msgText.querySelectorAll('pre code').forEach((b) => hljs.highlightElement(b));
  scrollDown();
}

// ===== Send Message =====
async function sendMessage() {
  const content = el.messageInput.value.trim();
  if (!content || state.isGenerating) return;

  let chat = getChat();
  if (!chat) {
    chat = createChat(content.slice(0, 50) + (content.length > 50 ? '...' : ''));
  }

  chat.messages.push({ role: 'user', content });
  addUserMsg(content);

  if (chat.messages.filter((m) => m.role === 'user').length === 1) {
    chat.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
    el.chatTitle.textContent = chat.title;
    renderHistory();
  }

  el.messageInput.value = '';
  el.sendBtn.disabled = true;
  el.charCount.textContent = '0';
  autoResize();

  state.isGenerating = true;
  el.sendBtn.classList.add('hidden');
  el.stopBtn.classList.remove('hidden');

  const apiMessages = chat.messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }));

  const useStream = el.streamToggle.checked;

  try {
    if (useStream) {
      await streamRequest(apiMessages, chat);
    } else {
      await regularRequest(apiMessages, chat);
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      addAssistantMsg(`⚠️ **Error:** ${err.message}`);
    }
  } finally {
    state.isGenerating = false;
    el.sendBtn.classList.remove('hidden');
    el.stopBtn.classList.add('hidden');
    el.sendBtn.disabled = !el.messageInput.value.trim();
    save();
  }
}

// Regular Request
async function regularRequest(messages, chat) {
  const streamDiv = createStreamDiv();

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      system: 'You are Claude, a helpful AI assistant. Use markdown formatting for your responses. Be thorough and thoughtful.',
    }),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error);

  chat.messages.push({
    role: 'assistant',
    content: data.message,
    thinking: data.thinking || '',
  });

  streamDiv.remove();
  addAssistantMsg(data.message, data.thinking);
}

// Streaming Request
async function streamRequest(messages, chat) {
  state.abortController = new AbortController();
  const streamDiv = createStreamDiv();

  let fullText = '';
  let fullThinking = '';
  let currentPhase = 'waiting'; // waiting, thinking, text

  const res = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      system: 'You are Claude, a helpful AI assistant. Use markdown formatting for your responses. Be thorough and thoughtful.',
    }),
    signal: state.abortController.signal,
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw) continue;

      try {
        const data = JSON.parse(raw);

        switch (data.type) {
          case 'thinking_start':
            currentPhase = 'thinking';
            break;

          case 'thinking':
            fullThinking += data.content;
            updateStreamThinking(streamDiv, fullThinking);
            break;

          case 'text_start':
            currentPhase = 'text';
            finalizeStreamThinking(streamDiv, fullThinking);
            break;

          case 'text':
            fullText += data.content;
            updateStreamText(streamDiv, fullText);
            break;

          case 'error':
            throw new Error(data.error);

          case 'done':
          case 'message_stop':
            break;
        }
      } catch (e) {
        if (e.message && !e.message.includes('JSON')) throw e;
      }
    }
  }

  // Finalize
  if (fullThinking && currentPhase === 'thinking') {
    finalizeStreamThinking(streamDiv, fullThinking);
  }

  chat.messages.push({
    role: 'assistant',
    content: fullText,
    thinking: fullThinking,
  });
}

function stopGeneration() {
  if (state.abortController) {
    state.abortController.abort();
    state.abortController = null;
  }
  state.isGenerating = false;
  el.sendBtn.classList.remove('hidden');
  el.stopBtn.classList.add('hidden');
}

// ===== Utilities =====
function formatMd(text) {
  marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
      return hljs.highlightAuto(code).value;
    },
  });

  const renderer = new marked.Renderer();
  renderer.code = (code, lang) => {
    const language = lang || 'plaintext';
    const highlighted =
      lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : esc(code);
    return `<pre>
      <div class="code-head">
        <span>${language}</span>
        <button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i> Copy</button>
      </div>
      <code class="hljs language-${language}">${highlighted}</code>
    </pre>`;
  };

  return marked.parse(text, { renderer });
}

function esc(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

function scrollDown() {
  el.chatArea.scrollTop = el.chatArea.scrollHeight;
}

function removeWelcome() {
  const w = el.chatArea.querySelector('.welcome');
  if (w) w.remove();
}

function toggleThinking(header) {
  header.classList.toggle('collapsed');
  const content = header.nextElementSibling;
  content.classList.toggle('hidden');
}

function copyMsg(btn) {
  const body = btn.closest('.msg-body');
  const textEl = body.querySelector('.msg-text');
  const text = textEl.innerText.replace('Copy', '').trim();
  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    }, 2000);
  });
}

function copyCode(btn) {
  const pre = btn.closest('pre');
  const code = pre.querySelector('code');
  navigator.clipboard.writeText(code.textContent).then(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    }, 2000);
  });
}

function useSuggestion(text) {
  el.messageInput.value = text;
  el.sendBtn.disabled = false;
  el.charCount.textContent = text.length;
  autoResize();
  sendMessage();
}

// ===== Start =====
init();
