/* ===== Variables ===== */
:root {
  --sidebar-w: 280px;
  --bg-primary: #1a1a2e;
  --bg-secondary: #16162a;
  --bg-tertiary: #0f0f23;
  --bg-input: #222244;
  --bg-hover: #252547;
  --bg-active: #2a2a55;
  --border: #2d2d5e;
  --text-1: #e8e8f0;
  --text-2: #a0a0c0;
  --text-3: #6a6a90;
  --accent: #8b5cf6;
  --accent-hover: #7c3aed;
  --accent-glow: rgba(139, 92, 246, 0.15);
  --thinking-bg: #1e1b3a;
  --thinking-border: #4c3a8b;
  --user-bg: #252547;
  --code-bg: #0d0d1a;
  --danger: #ef4444;
  --success: #22c55e;
  --radius: 12px;
  --radius-sm: 8px;
  --transition: 0.2s ease;
}

/* ===== Reset ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background: var(--bg-primary);
  color: var(--text-1);
  height: 100vh;
  overflow: hidden;
}

/* ===== Layout ===== */
.app {
  display: flex;
  height: 100vh;
}

/* ===== Sidebar ===== */
.sidebar {
  width: var(--sidebar-w);
  background: var(--bg-tertiary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  z-index: 200;
}

.sidebar-top {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.new-chat-btn {
  width: 100%;
  padding: 11px 16px;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background var(--transition);
}

.new-chat-btn:hover {
  background: var(--accent-hover);
}

/* Chat History */
.sidebar-chats {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.sidebar-chats::-webkit-scrollbar { width: 4px; }
.sidebar-chats::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.chat-item {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
  transition: all var(--transition);
}

.chat-item:hover {
  background: var(--bg-hover);
  color: var(--text-1);
}

.chat-item.active {
  background: var(--bg-active);
  color: var(--text-1);
}

.chat-item-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-item-delete {
  display: none;
  background: none;
  border: none;
  color: var(--text-3);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.chat-item:hover .chat-item-delete { display: block; }
.chat-item-delete:hover { color: var(--danger); }

/* Sidebar Bottom */
.sidebar-bottom {
  padding: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.model-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--accent-glow);
  border: 1px solid var(--thinking-border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: #a78bfa;
  font-weight: 600;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-2);
}

.setting-row span {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Toggle */
.toggle {
  position: relative;
  width: 40px;
  height: 22px;
}

.toggle input { display: none; }

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #444;
  border-radius: 22px;
  transition: 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle-slider {
  background: var(--accent);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(18px);
}

.danger-btn {
  padding: 9px;
  background: none;
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--danger);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all var(--transition);
}

.danger-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* ===== Main Area ===== */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  gap: 12px;
  background: var(--bg-secondary);
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  font-size: 18px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all var(--transition);
}

.icon-btn:hover {
  background: var(--bg-hover);
  color: var(--text-1);
}

.header h1 {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-2);
  padding: 4px 12px;
  background: var(--bg-hover);
  border-radius: 20px;
}

.status-dot {
  width: 7px;
  height: 7px;
  background: var(--success);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ===== Chat Area ===== */
.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.chat-area::-webkit-scrollbar { width: 6px; }
.chat-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* Welcome */
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  text-align: center;
}

.welcome-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 20px;
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.3);
}

.welcome h2 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}

.welcome-sub {
  color: var(--text-2);
  font-size: 14px;
  margin-bottom: 32px;
}

.suggestions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-width: 640px;
  width: 100%;
}

.suggestion {
  padding: 16px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  color: var(--text-2);
  font-size: 13px;
  transition: all var(--transition);
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.suggestion i {
  color: var(--accent);
  margin-top: 2px;
}

.suggestion:hover {
  background: var(--bg-hover);
  border-color: var(--accent);
  color: var(--text-1);
}

/* ===== Messages ===== */
.message {
  padding: 20px 0;
  animation: msgIn 0.3s ease;
}

@keyframes msgIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.msg-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 14px;
}

.msg-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
  margin-top: 2px;
}

.message.user .msg-avatar {
  background: #3b82f6;
  color: white;
}

.message.assistant .msg-avatar {
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  color: white;
}

.msg-body {
  flex: 1;
  min-width: 0;
}

.msg-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  color: var(--text-2);
}

.msg-text {
  line-height: 1.75;
  font-size: 15px;
}

.msg-text p { margin-bottom: 12px; }
.msg-text p:last-child { margin-bottom: 0; }

/* Thinking Block */
.thinking-block {
  margin-bottom: 16px;
  border: 1px solid var(--thinking-border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--thinking-bg);
}

.thinking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 13px;
  color: #a78bfa;
  font-weight: 600;
  transition: background var(--transition);
}

.thinking-header:hover {
  background: rgba(139, 92, 246, 0.08);
}

.thinking-header i {
  transition: transform 0.3s;
}

.thinking-header.collapsed i {
  transform: rotate(-90deg);
}

.thinking-content {
  padding: 12px 14px;
  border-top: 1px solid var(--thinking-border);
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.thinking-content.hidden {
  display: none;
}

.thinking-content::-webkit-scrollbar { width: 4px; }
.thinking-content::-webkit-scrollbar-thumb { background: var(--thinking-border); border-radius: 2px; }

/* Thinking animation */
.thinking-dots {
  display: inline-flex;
  gap: 3px;
  margin-left: 6px;
}

.thinking-dots span {
  width: 5px;
  height: 5px;
  background: #a78bfa;
  border-radius: 50%;
  animation: tdot 1.4s infinite;
}

.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes tdot {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}

/* Code blocks */
.msg-text pre {
  background: var(--code-bg);
  border-radius: var(--radius-sm);
  margin: 12px 0;
  overflow: hidden;
  border: 1px solid var(--border);
}

.code-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: #1a1a33;
  font-size: 12px;
  color: var(--text-3);
  border-bottom: 1px solid var(--border);
}

.copy-btn {
  background: none;
  border: none;
  color: var(--text-3);
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  transition: all var(--transition);
}

.copy-btn:hover {
  color: var(--text-1);
  background: rgba(255,255,255,0.05);
}

.msg-text pre code {
  display: block;
  padding: 14px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.msg-text code {
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Fira Code', 'Consolas', monospace;
  border: 1px solid var(--border);
}

/* Message actions */
.msg-actions {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity var(--transition);
}

.message:hover .msg-actions {
  opacity: 1;
}

.msg-action {
  background: none;
  border: 1px solid transparent;
  color: var(--text-3);
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all var(--transition);
}

.msg-action:hover {
  color: var(--text-1);
  border-color: var(--border);
  background: var(--bg-hover);
}

/* Typing indicator */
.typing {
  display: flex;
  gap: 5px;
  padding: 8px 0;
}

.typing span {
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  animation: bounce 1.4s infinite;
}

.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}

/* Tables */
.msg-text table {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
  font-size: 14px;
}

.msg-text th, .msg-text td {
  border: 1px solid var(--border);
  padding: 8px 12px;
  text-align: left;
}

.msg-text th {
  background: var(--bg-input);
  font-weight: 600;
}

.msg-text ul, .msg-text ol {
  margin: 8px 0;
  padding-left: 24px;
}

.msg-text li { margin-bottom: 4px; }
.msg-text blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 14px;
  margin: 12px 0;
  color: var(--text-2);
}

/* ===== Input ===== */
.input-container {
  padding: 12px 24px 16px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.input-box {
  display: flex;
  align-items: flex-end;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 10px 14px;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.input-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.input-box textarea {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-1);
  font-size: 15px;
  font-family: inherit;
  resize: none;
  max-height: 200px;
  padding: 4px 8px;
  line-height: 1.5;
}

.input-box textarea::placeholder {
  color: var(--text-3);
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.char-count {
  font-size: 11px;
  color: var(--text-3);
}

.send-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all var(--transition);
}

.send-btn:disabled {
  background: #444;
  cursor: not-allowed;
  color: #777;
}

.send-btn:not(:disabled):hover {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.stop-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: none;
  background: var(--danger);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all var(--transition);
  animation: fadeIn 0.2s ease;
}

.stop-btn:hover {
  background: #dc2626;
}

.hidden { display: none !important; }

.footer-note {
  text-align: center;
  font-size: 11px;
  color: var(--text-3);
  margin-top: 8px;
}

/* Sidebar overlay */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 150;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100%;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar.open ~ .sidebar-overlay {
    display: block;
  }

  .suggestions {
    grid-template-columns: 1fr;
  }

  .msg-inner {
    padding: 0 16px;
  }

  .input-container {
    padding: 12px 16px 16px;
  }

  .header-badge {
    display: none;
  }
}
