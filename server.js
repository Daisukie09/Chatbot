require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const BASE_URL = process.env.ANTHROPIC_BASE_URL;
const AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN;
const MODEL = process.env.ANTHROPIC_MODEL;

// ===== Regular Chat Endpoint =====
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;

    const payload = {
      model: MODEL,
      max_tokens: 16384,
      messages: messages,
      stream: false,
    };

    if (system) {
      payload.system = system;
    }

    console.log(`[Chat] Sending request to ${MODEL}...`);

    const response = await fetch(`${BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AUTH_TOKEN,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Chat] API Error ${response.status}:`, errorText);
      return res.status(response.status).json({
        success: false,
        error: `API Error ${response.status}: ${errorText}`,
      });
    }

    const data = await response.json();
    console.log(`[Chat] Response received. Stop reason: ${data.stop_reason}`);

    // Extract text content and thinking blocks
    let textContent = '';
    let thinkingContent = '';

    if (data.content && Array.isArray(data.content)) {
      for (const block of data.content) {
        if (block.type === 'thinking') {
          thinkingContent += block.thinking;
        } else if (block.type === 'text') {
          textContent += block.text;
        }
      }
    }

    res.json({
      success: true,
      message: textContent,
      thinking: thinkingContent,
      usage: data.usage,
      model: data.model,
      stop_reason: data.stop_reason,
    });
  } catch (error) {
    console.error('[Chat] Server Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ===== Streaming Chat Endpoint =====
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { messages, system } = req.body;

    const payload = {
      model: MODEL,
      max_tokens: 16384,
      messages: messages,
      stream: true,
    };

    if (system) {
      payload.system = system;
    }

    console.log(`[Stream] Sending request to ${MODEL}...`);

    const response = await fetch(`${BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AUTH_TOKEN,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Stream] API Error ${response.status}:`, errorText);
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`data: ${JSON.stringify({ type: 'error', error: `API Error ${response.status}: ${errorText}` })}\n\n`);
      res.end();
      return;
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const body = response.body;
    let buffer = '';

    body.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            handleStreamEvent(parsed, res);
          } catch (e) {
            // Skip unparseable chunks
          }
        }
      }
    });

    body.on('end', () => {
      console.log('[Stream] Stream ended');
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    });

    body.on('error', (err) => {
      console.error('[Stream] Stream error:', err);
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    });

    // Handle client disconnect
    req.on('close', () => {
      console.log('[Stream] Client disconnected');
      body.destroy();
    });
  } catch (error) {
    console.error('[Stream] Server Error:', error);
    res.setHeader('Content-Type', 'text/event-stream');
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  }
});

function handleStreamEvent(event, res) {
  switch (event.type) {
    case 'message_start':
      res.write(`data: ${JSON.stringify({ type: 'message_start', model: event.message?.model })}\n\n`);
      break;

    case 'content_block_start':
      if (event.content_block?.type === 'thinking') {
        res.write(`data: ${JSON.stringify({ type: 'thinking_start' })}\n\n`);
      } else if (event.content_block?.type === 'text') {
        res.write(`data: ${JSON.stringify({ type: 'text_start' })}\n\n`);
      }
      break;

    case 'content_block_delta':
      if (event.delta?.type === 'thinking_delta') {
        res.write(`data: ${JSON.stringify({ type: 'thinking', content: event.delta.thinking })}\n\n`);
      } else if (event.delta?.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ type: 'text', content: event.delta.text })}\n\n`);
      }
      break;

    case 'content_block_stop':
      res.write(`data: ${JSON.stringify({ type: 'block_stop' })}\n\n`);
      break;

    case 'message_delta':
      res.write(`data: ${JSON.stringify({ type: 'message_delta', stop_reason: event.delta?.stop_reason, usage: event.usage })}\n\n`);
      break;

    case 'message_stop':
      res.write(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`);
      break;

    case 'ping':
      break;

    default:
      break;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    model: MODEL,
    baseUrl: BASE_URL,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║       Claude Chat Server Running         ║
║                                          ║
║  URL:   http://localhost:${PORT}             ║
║  Model: ${MODEL}  ║
╚══════════════════════════════════════════╝
  `);
});
