# AI Assistant Design — Phase 3

## Project Overview

Build an AI-powered chat assistant for the LeadGenAI agency platform that provides real-time conversational responses, qualifies leads, explains services, and handles appointment booking.

**Goal**: Convert visitors into qualified leads through intelligent AI interaction.

---

## Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│  Frontend   │ ◄───────────────► │   Backend   │
│  Chat UI    │    (ws://)         │  FastAPI    │
└─────────────┘                    └──────┬──────┘
                                         │
                                  ┌──────▼──────┐
                                  │  LLM Layer  │
                                  │ OpenRouter  │
                                  │ (free)      │
                                  └─────────────┘
```

---

## 1. Backend Components

### 1.1 WebSocket Manager

- **Location**: `backend/app/websocket_manager.py`
- **Responsibilities**:
  - Handle WebSocket connections
  - Manage concurrent client connections
  - Route messages to appropriate handlers
  - Broadcast updates to subscribed clients

### 1.2 Session Manager

- **Location**: `backend/app/session_manager.py`
- **Responsibilities**:
  - Track conversation context per session
  - Store message history (last 20 messages)
  - Manage session lifecycle (create, resume, expire)
  - Generate unique session IDs

### 1.3 LLM Handler

- **Location**: `backend/app/llm_handler.py`
- **Responsibilities**:
  - Interface with OpenRouter API
  - Handle streaming responses (SSE-like via WebSocket)
  - Manage system prompts for different behaviors
  - Handle rate limiting and retries

### 1.4 Lead Qualifier

- **Location**: `backend/app/lead_qualifier.py`
- **Responsibilities**:
  - Detect lead qualification signals in conversation
  - Extract contact information from chat
  - Trigger lead capture when threshold met
  - Track qualification score per conversation

---

## 2. API Endpoints

### WebSocket

```
WS /ws/chat/{session_id}
```

**Client sends**:
```json
{
  "type": "message",
  "content": "I need a website for my business"
}
```

**Server streams**:
```json
{
  "type": "chunk",
  "content": "I"
}
{
  "type": "chunk",
  "content": "'d"
}
...
{
  "type": "done"
}
```

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/session` | Create new chat session |
| GET | `/api/chat/history/{session_id}` | Get conversation history |
| POST | `/api/chat/qualify-lead` | Manually trigger lead capture |

---

## 3. Frontend Updates

### 3.1 WebSocket Integration

- Connect to `ws://localhost:8000/ws/chat/{session_id}`
- Handle reconnection on disconnect
- Store session ID in localStorage for persistence

### 3.2 Streaming Display

- Append incoming chunks to current message
- Show typing indicator when waiting for response
- Handle message completion properly

### 3.3 Connection States

- `connecting` — Attempting to connect
- `connected` — Active connection
- `disconnected` — Lost connection (auto-reconnect)
- `error` — Failed to connect

---

## 4. System Prompts

### Default Assistant

```
You are Nexvora, an AI consultant for a premium fullstack development agency.
Your role is to help visitors understand our services, answer questions,
and guide them toward booking a consultation.

Services we offer:
- Modern business websites ($499-$999)
- Fullstack web apps with AI ($1,500-$3,000)
- Premium solutions with advanced AI ($3,000-$8,000+)

Keep responses concise, professional, and conversion-focused.
Ask qualifying questions to understand their needs.
```

### Lead Qualification Trigger

When user shows interest (mentions budget, timeline, project type), prompt:

```
Would you like to schedule a free consultation? I can connect you with our team to discuss your project in detail.
```

---

## 5. Lead Qualification Logic

### Signals that trigger qualification:

- User mentions budget range
- User asks about timeline
- User describes project requirements
- User asks for pricing
- User expresses urgency

### Qualification Score:

| Signal | Points |
|--------|--------|
| Budget mentioned | +20 |
| Timeline mentioned | +15 |
| Project type described | +20 |
| Pricing asked | +15 |
| Consultation requested | +30 |

**Threshold**: 40 points → Trigger lead capture prompt

---

## 6. Error Handling

| Scenario | Handling |
|----------|----------|
| LLM API failure | Show error message, allow retry |
| WebSocket disconnect | Auto-reconnect with backoff (1s, 2s, 4s, max 30s) |
| Rate limiting | Queue message, show "please wait" |
| Invalid session | Create new session, notify user |

---

## 7. Data Models

### ChatSession
```python
class ChatSession:
    id: str
    visitor_id: str
    created_at: datetime
    last_activity: datetime
    message_count: int
    qualification_score: int
```

### ChatMessage
```python
class ChatMessage:
    id: int
    session_id: str
    role: str  # "user" | "assistant"
    content: str
    created_at: datetime
```

---

## 8. Environment Variables

```env
# OpenRouter
OPENROUTER_API_KEY=your_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Optional model override
OPENROUTER_MODEL=openrouter/free
```

---

## 9. Implementation Priority

1. Backend WebSocket setup
2. OpenRouter LLM integration
3. Session management
4. Frontend WebSocket connection
5. Streaming response display
6. Lead qualification logic
7. Error handling & reconnection

---

## 10. Testing

- Test WebSocket connection/disconnection
- Test streaming response display
- Test lead qualification triggers
- Test error handling scenarios
- Test session persistence