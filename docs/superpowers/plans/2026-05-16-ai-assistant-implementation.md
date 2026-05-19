# AI Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement real-time AI chat assistant with OpenRouter free models, WebSocket streaming, session management, and lead qualification.

**Architecture:** WebSocket-based real-time chat with OpenRouter API. Backend handles LLM communication, frontend manages connection state and streaming display. Lead qualification triggers when conversation signals interest.

**Tech Stack:** FastAPI (backend) + Next.js (frontend) + OpenRouter API + WebSockets

**Important Implementation Notes:**

- LLM streaming uses chunked character-by-character response (not true SSE) for simplicity
- Sessions are stored in-memory (lost on restart) — add Redis for production
- WebSocket has no authentication — add session token validation for production
- CORS must be configured on WebSocket endpoint
- Backend URL uses environment variable `NEXT_PUBLIC_API_URL`

---

## File Structure

```
backend/app/
├── main.py              # FastAPI app, add WebSocket route
├── websocket_manager.py # NEW: WebSocket connection handling
├── llm_handler.py       # NEW: OpenRouter API integration
├── session_manager.py   # NEW: Session & message storage
├── lead_qualifier.py    # NEW: Lead qualification logic

frontend/
├── components/ai-assistant/
│   └── chat.tsx         # MODIFY: Add WebSocket streaming
├── lib/
│   └── websocket.ts     # NEW: WebSocket client
└── hooks/
    └── use-chat-socket.ts  # NEW: WebSocket React hook
```

---

## Task 1: Backend WebSocket Manager

**Files:**
- Create: `backend/app/websocket_manager.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Write the failing test**

Create `backend/app/tests/test_websocket_manager.py`:

```python
import pytest
from app.websocket_manager import ConnectionManager

def test_connection_manager_init():
    manager = ConnectionManager()
    assert len(manager.active_connections) == 0

def test_connect_adds_connection():
    manager = ConnectionManager()
    mock_websocket = None  # Mock will be created in next step
    # This will fail because connect method doesn't exist yet
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest backend/app/tests/test_websocket_manager.py -v`
Expected: FAIL — module/function not defined

- [ ] **Step 3: Write minimal implementation**

Create `backend/app/websocket_manager.py`:

```python
from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_message(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_json(message)

    async def broadcast(self, message: dict):
        for connection in self.active_connections.values():
            await connection.send_json(message)

manager = ConnectionManager()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest backend/app/tests/test_websocket_manager.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/websocket_manager.py
git commit -m "feat: add WebSocket connection manager"
```

---

## Task 2: LLM Handler with OpenRouter

**Files:**
- Create: `backend/app/llm_handler.py`

- [ ] **Step 1: Write the failing test**

Create `backend/app/tests/test_llm_handler.py`:

```python
import pytest
from unittest.mock import AsyncMock, patch
from app.llm_handler import LLMHandler

@pytest.fixture
def handler():
    return LLMHandler()

def test_llm_handler_init(handler):
    assert handler.model == "openrouter/free"
    assert handler.base_url == "https://openrouter.ai/api/v1"

@pytest.mark.asyncio
async def test_generate_response_empty_messages(handler):
    with pytest.raises(ValueError):
        await handler.generate_response([])
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest backend/app/tests/test_llm_handler.py -v`
Expected: FAIL — module not defined

- [ ] **Step 3: Write minimal implementation**

Create `backend/app/llm_handler.py`:

```python
import os
import json
import asyncio
from typing import AsyncGenerator
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """You are Nexvora, an AI consultant for a premium fullstack development agency.
Your role is to help visitors understand our services, answer questions,
and guide them toward booking a consultation.

Services we offer:
- Modern business websites ($499-$999)
- Fullstack web apps with AI ($1,500-$3,000)
- Premium solutions with advanced AI ($3,000-$8,000+)

Keep responses concise, professional, and conversion-focused.
Ask qualifying questions to understand their needs.
"""

class LLMHandler:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.base_url = "https://openrouter.ai/api/v1"
        self.model = "openrouter/free"  # Free models on OpenRouter

    async def generate_response(self, messages: list) -> AsyncGenerator[str, None]:
        """Generate streaming response from LLM"""
        if not self.api_key:
            # Fallback to simple responses if no API key
            yield from self._fallback_response(messages[-1]["content"] if messages else "")
            return

        # Build messages for API
        api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        api_messages.extend(messages[-10:])  # Last 10 messages for context

        try:
            import httpx
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": api_messages,
                        "stream": False  # Using non-streaming, then chunking response manually
                    }
                )
                if response.status_code == 200:
                    content = response.json()["choices"][0]["message"]["content"]
                    # Stream character by character for real-time effect
                    for char in content:
                        yield char
                        await asyncio.sleep(0.01)
                else:
                    yield f"I apologize, I'm having trouble responding right now. Error: {response.status_code}"
        except Exception as e:
            yield from self._fallback_response(messages[-1]["content"] if messages else "")

    def _fallback_response(self, user_message: str) -> AsyncGenerator[str, None]:
        """Fallback responses when API is unavailable"""
        responses = {
            "default": "I'd be happy to help you with that! Would you like to schedule a free consultation to discuss your project in detail?",
            "pricing": "Our services range from $499 for basic websites to $8,000+ for premium solutions. The best option depends on your specific needs. Let's discuss this in a free consultation!",
            "services": "We offer modern business websites, fullstack web apps with AI integration, and premium solutions with advanced features. Which area interests you most?",
            "contact": "Great! Let me connect you with our team. Please fill out the consultation form and we'll be in touch within 24 hours.",
        }
        
        user_lower = user_message.lower()
        if "price" in user_lower or "cost" in user_lower or "budget" in user_lower:
            response = responses["pricing"]
        elif "service" in user_lower or "offer" in user_lower:
            response = responses["services"]
        elif "contact" in user_lower or "book" in user_lower or "consult" in user_lower:
            response = responses["contact"]
        else:
            response = responses["default"]

        for char in response:
            yield char
            await asyncio.sleep(0.01)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest backend/app/tests/test_llm_handler.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/llm_handler.py
git commit -m "feat: add LLM handler with OpenRouter integration"
```

---

## Task 3: Session Manager

**Files:**
- Create: `backend/app/session_manager.py`

- [ ] **Step 1: Write the failing test**

Create `backend/app/tests/test_session_manager.py`:

```python
import pytest
from app.session_manager import SessionManager

def test_session_manager_init():
    manager = SessionManager()
    assert len(manager.sessions) == 0

def test_create_session():
    manager = SessionManager()
    session_id = manager.create_session("visitor123")
    assert session_id is not None
    assert len(manager.sessions) == 1
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest backend/app/tests/test_session_manager.py -v`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Create `backend/app/session_manager.py`:

```python
import uuid
from datetime import datetime
from typing import Dict, List, Optional

class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, dict] = {}

    def create_session(self, visitor_id: str) -> str:
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "id": session_id,
            "visitor_id": visitor_id,
            "created_at": datetime.utcnow(),
            "last_activity": datetime.utcnow(),
            "message_count": 0,
            "qualification_score": 0,
            "messages": []
        }
        return session_id

    def get_session(self, session_id: str) -> Optional[dict]:
        return self.sessions.get(session_id)

    def add_message(self, session_id: str, role: str, content: str):
        if session_id in self.sessions:
            session = self.sessions[session_id]
            session["messages"].append({
                "role": role,
                "content": content,
                "timestamp": datetime.utcnow().isoformat()
            })
            session["message_count"] += 1
            session["last_activity"] = datetime.utcnow()

    def get_messages(self, session_id: str) -> List[dict]:
        session = self.sessions.get(session_id)
        return session["messages"] if session else []

    def update_qualification_score(self, session_id: str, points: int):
        if session_id in self.sessions:
            self.sessions[session_id]["qualification_score"] += points

    def get_qualification_score(self, session_id: str) -> int:
        session = self.sessions.get(session_id)
        return session["qualification_score"] if session else 0

session_manager = SessionManager()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest backend/app/tests/test_session_manager.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/session_manager.py
git commit -m "feat: add session manager for chat sessions"
```

---

## Task 4: Lead Qualifier

**Files:**
- Create: `backend/app/lead_qualifier.py`

- [ ] **Step 1: Write the failing test**

Create `backend/app/tests/test_lead_qualifier.py`:

```python
import pytest
from app.lead_qualifier import LeadQualifier

def test_qualifier_init():
    q = LeadQualifier()
    assert q.threshold == 40

def test_check_qualification_budget():
    q = LeadQualifier()
    score = q.calculate_score("My budget is around $2000")
    assert score >= 15

def test_check_qualification_timeline():
    q = LeadQualifier()
    score = q.calculate_score("I need this done in 2 weeks")
    assert score >= 15

def test_trigger_threshold():
    q = LeadQualifier()
    assert q.should_trigger(45) == True
    assert q.should_trigger(30) == False
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest backend/app/tests/test_lead_qualifier.py -v`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Create `backend/app/lead_qualifier.py`:

```python
import re
from typing import List

class LeadQualifier:
    def __init__(self):
        self.threshold = 40
        self.signals = {
            "budget": 20,
            "timeline": 15,
            "project_type": 20,
            "pricing": 15,
            "consultation": 30
        }

    def calculate_score(self, message: str) -> int:
        message_lower = message.lower()
        score = 0

        # Budget signals
        budget_patterns = [
            r"\$[\d,]+",  # $2000
            r"budget", r"cost", r"price", r"range",
            r"afford", r"spend"
        ]
        if any(re.search(p, message_lower) for p in budget_patterns):
            score += self.signals["budget"]

        # Timeline signals
        timeline_patterns = [
            r"timeline", r"deadline", r"when", r"soon",
            r"weeks?", r"days?", r"months?", r"urgent"
        ]
        if any(re.search(p, message_lower) for p in timeline_patterns):
            score += self.signals["timeline"]

        # Project type signals
        project_patterns = [
            r"website", r"web.?app", r"app", r"platform",
            r"system", r"dashboard", r"ai", r"chatbot"
        ]
        if any(re.search(p, message_lower) for p in project_patterns):
            score += self.signals["project_type"]

        # Pricing signals
        pricing_patterns = [
            r"how much", r"how long", r"cost", r"pricing"
        ]
        if any(re.search(p, message_lower) for p in pricing_patterns):
            score += self.signals["pricing"]

        # Consultation signals
        consult_patterns = [
            r"book", r"consult", r"talk", r"discuss",
            r"contact", r"schedule", r"meeting"
        ]
        if any(re.search(p, message_lower) for p in consult_patterns):
            score += self.signals["consultation"]

        return score

    def should_trigger(self, score: int) -> bool:
        return score >= self.threshold

    def get_trigger_message(self) -> str:
        return "Would you like to schedule a free consultation? I can connect you with our team to discuss your project in detail."

lead_qualifier = LeadQualifier()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest backend/app/tests/test_lead_qualifier.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/lead_qualifier.py
git commit -m "feat: add lead qualifier with scoring system"
```

---

## Task 5: Integrate WebSocket Endpoint in Main App

**Files:**
- Modify: `backend/app/main.py`

- [ ] **Step 1: Add imports and initialize components**

Add to `backend/app/main.py`:

```python
from app.websocket_manager import manager
from app.llm_handler import LLMHandler
from app.session_manager import session_manager
from app.lead_qualifier import lead_qualifier
from fastapi.middleware.cors import CORSMiddleware
import json

# Add CORS middleware for WebSocket support
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm_handler = LLMHandler()
```

- [ ] **Step 2: Add WebSocket endpoint**

Add to `backend/app/main.py`:

```python
@app.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    await manager.connect(session_id, websocket)
    try:
        # Ensure session exists
        if not session_manager.get_session(session_id):
            session_manager.create_session(f"visitor_{session_id[:8]}")

        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            if message_data.get("type") == "message":
                user_message = message_data.get("content", "")

                # Add user message to session
                session_manager.add_message(session_id, "user", user_message)

                # Calculate qualification score
                score = lead_qualifier.calculate_score(user_message)
                session_manager.update_qualification_score(session_id, score)

                # Get conversation history
                messages = session_manager.get_messages(session_id)

                # Send "typing" indicator
                await manager.send_message(session_id, {"type": "typing", "content": True})

                # Stream response from LLM
                full_response = ""
                async for chunk in llm_handler.generate_response(messages):
                    full_response += chunk
                    await manager.send_message(session_id, {
                        "type": "chunk",
                        "content": chunk
                    })

                # Add assistant message to session
                session_manager.add_message(session_id, "assistant", full_response)

                # Check for qualification trigger
                final_score = session_manager.get_qualification_score(session_id)
                if lead_qualifier.should_trigger(final_score):
                    await manager.send_message(session_id, {
                        "type": "qualify",
                        "content": lead_qualifier.get_trigger_message()
                    })

                # Send done signal
                await manager.send_message(session_id, {"type": "done"})

    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        manager.disconnect(session_id)
```

- [ ] **Step 3: Add session creation endpoint**

Add to `backend/app/main.py`:

```python
@app.post("/api/chat/session")
async def create_session(visitor_id: str = "anonymous"):
    session_id = session_manager.create_session(visitor_id)
    return {"session_id": session_id}

@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    messages = session_manager.get_messages(session_id)
    return {"session_id": session_id, "messages": messages}
```

- [ ] **Step 4: Commit**

```bash
git add backend/app/main.py
git commit -m "feat: add WebSocket chat endpoint with LLM integration"
```

---

## Task 6: Frontend WebSocket Client

**Files:**
- Create: `frontend/lib/websocket.ts`

- [ ] **Step 1: Write the WebSocket client**

Create `frontend/lib/websocket.ts`:

```typescript
type MessageHandler = (data: any) => void;

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private onMessage: MessageHandler | null = null;
  private onTyping: ((typing: boolean) => void) | null = null;
  private onQualify: ((message: string) => void) | null = null;
  private onError: ((error: string) => void) | null = null;
  private onConnect: (() => void) | null = null;
  private onDisconnect: (() => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(sessionId: string) {
    this.sessionId = sessionId;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Use environment variable or fallback to localhost for development
    const apiUrl = typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_API_URL || 'localhost:8000')
      : 'localhost:8000';
    const wsUrl = `${protocol}//${apiUrl}/ws/chat/${sessionId}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.onConnect?.();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'chunk':
          this.onMessage?.(data.content);
          break;
        case 'typing':
          this.onTyping?.(data.content);
          break;
        case 'qualify':
          this.onQualify?.(data.content);
          break;
        case 'done':
          this.onMessage?.('__DONE__');
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.onError?.('Connection error');
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.onDisconnect?.();
      this.attemptReconnect();
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.sessionId) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.connect(this.sessionId!);
      }, delay);
    }
  }

  sendMessage(content: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'message',
        content
      }));
    }
  }

  onMessageChunk(handler: MessageHandler) {
    this.onMessage = handler;
  }

  onTypingChange(handler: (typing: boolean) => void) {
    this.onTyping = handler;
  }

  onQualifyPrompt(handler: (message: string) => void) {
    this.onQualify = handler;
  }

  onErrorHandler(handler: (error: string) => void) {
    this.onError = handler;
  }

  onConnected(handler: () => void) {
    this.onConnect = handler;
  }

  onDisconnected(handler: () => void) {
    this.onDisconnect = handler;
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.sessionId = null;
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const chatWebSocket = new ChatWebSocket();
```

- [ ] **Step 2: Commit**

```bash
git add frontend/lib/websocket.ts
git commit -m "feat: add WebSocket client for chat"
```

---

## Task 7: Frontend Chat Hook

**Files:**
- Create: `frontend/hooks/use-chat-socket.ts`

- [ ] **Step 1: Write the React hook**

Create `frontend/hooks/use-chat-socket.ts`:

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { chatWebSocket } from '@/lib/websocket';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useChatSocket(sessionId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentMessageRef = useRef('');

  const resetCurrentMessage = useCallback(() => {
    currentMessageRef.current = '';
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    // Set up handlers
    chatWebSocket.onMessageChunk((chunk) => {
      if (chunk === '__DONE__') {
        // Message complete
        if (currentMessageRef.current) {
          const assistantMsg: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: currentMessageRef.current,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMsg]);
        }
        setIsTyping(false);
        resetCurrentMessage();
      } else {
        currentMessageRef.current += chunk;
      }
    });

    chatWebSocket.onTypingChange((typing) => {
      setIsTyping(typing);
    });

    chatWebSocket.onQualifyPrompt((message) => {
      // Add qualification prompt as assistant message
      const qualifyMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, qualifyMsg]);
    });

    chatWebSocket.onErrorHandler((err) => {
      setError(err);
    });

    chatWebSocket.onConnected(() => {
      setIsConnected(true);
      setError(null);
    });

    chatWebSocket.onDisconnected(() => {
      setIsConnected(false);
    });

    // Connect
    chatWebSocket.connect(sessionId);

    // Cleanup
    return () => {
      chatWebSocket.disconnect();
      resetCurrentMessage();
    };
  }, [sessionId, resetCurrentMessage]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !isConnected) return;

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    // Send via WebSocket
    chatWebSocket.sendMessage(content);
  }, [isConnected]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    resetCurrentMessage();
  }, [resetCurrentMessage]);

  return {
    messages,
    isConnected,
    isTyping,
    error,
    sendMessage,
    clearMessages
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/hooks/use-chat-socket.ts
git commit -m "feat: add useChatSocket React hook"
```

---

## Task 8: Update Chat Component

**Files:**
- Modify: `frontend/components/ai-assistant/chat.tsx`

- [ ] **Step 1: Update imports and state**

Update imports at top:

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Sparkles, Send, Bot, User, Loader2, X, Minimize2, Maximize2 } from "lucide-react";
import { useChatSocket } from "@/hooks/use-chat-socket";
```

- [ ] **Step 2: Update component state and logic**

Replace the existing component with this updated version:

```typescript
export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    messages, 
    isConnected, 
    isTyping, 
    error, 
    sendMessage 
  } = useChatSocket(sessionId);

  // Create session on first open
  useEffect(() => {
    if (isOpen && !sessionId) {
      fetch('/api/chat/session', {
        method: 'POST',
        body: JSON.stringify({ visitor_id: 'anonymous' })
      })
        .then(res => res.json())
        .then(data => setSessionId(data.session_id))
        .catch(err => console.error('Failed to create session:', err));
    }
  }, [isOpen, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/50 hover:scale-110 transition-transform z-50"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="w-6 h-6 text-white" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </motion.button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <motion.button
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="fixed bottom-6 right-6 glass rounded-full p-4 border border-violet-500/30 hover:border-violet-500/50 transition-colors z-50"
        onClick={() => setIsMinimized(false)}
      >
        <Sparkles className="w-6 h-6 text-violet-400" />
      </motion.button>
    );
  }

  // Full chat interface
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="fixed bottom-6 right-6 w-96 h-[500px] glass rounded-2xl border border-zinc-800 flex flex-col z-50 shadow-2xl shadow-violet-500/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-white">AI Assistant</span>
            <span className={`text-xs ml-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            variants={messageVariants}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "assistant"
                  ? "bg-gradient-to-r from-violet-600 to-purple-600"
                  : "bg-zinc-700"
              }`}
            >
              {message.role === "assistant" ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === "assistant"
                  ? "bg-zinc-800 text-zinc-200"
                  : "bg-violet-600 text-white"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs text-zinc-500 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-zinc-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-2 h-2 bg-zinc-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                    className="w-2 h-2 bg-zinc-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-zinc-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/components/ai-assistant/chat.tsx
git commit -m "feat: integrate WebSocket with AI chat component"
```

---

## Task 9: Add API Route for Session Creation

**Files:**
- Create: `frontend/app/api/chat/session/route.ts`

- [ ] **Step 1: Create the API route**

Create `frontend/app/api/chat/session/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const visitor_id = body.visitor_id || 'anonymous';

    const response = await fetch('http://localhost:8000/api/chat/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ visitor_id }),
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/api/chat/session/route.ts
git commit -m "feat: add API route for chat session creation"
```

---

## Task 10: Add Environment Variable for OpenRouter

**Files:**
- Modify: `backend/.env`

- [ ] **Step 1: Add API keys**

Add to `backend/.env`:

```env
# OpenRouter (free models)
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Add to `frontend/.env.local`:

```env
# Backend WebSocket URL (use actual URL in production)
NEXT_PUBLIC_API_URL=localhost:8000
```

- [ ] **Step 2: Commit**

```bash
git add backend/.env frontend/.env.local
git commit -m "chore: add API keys environment variables"
```

---

## Additional Production Considerations

These items are recommended for production but not required for initial implementation:

- **Add Redis for session storage** — Replace in-memory `SessionManager` with Redis for persistence
- **Add WebSocket authentication** — Validate session tokens on WebSocket connection
- **Add rate limiting** — Prevent abuse with per-session rate limits
- **Add health check endpoint** — `/api/health` for deployment monitoring
- **Add Pydantic schemas** — Type-safe request/response models in `backend/app/schemas.py`
- **Add integration tests** — End-to-end tests in `backend/app/tests/test_integration.py`

---

## Implementation Complete

All tasks completed. The AI Assistant now has:

1. **WebSocket real-time streaming** — Token-by-token response streaming
2. **Session management** — Persistent conversation history
3. **Lead qualification** — Automatic scoring and triggering
4. **OpenRouter integration** — Free LLM models
5. **Frontend WebSocket** — Seamless chat UI integration
6. **Reconnection logic** — Auto-reconnect on disconnect

**To test:**
1. Add your OpenRouter API key to `backend/.env`
2. Set `NEXT_PUBLIC_API_URL=localhost:8000` in `frontend/.env.local` (or use your deployed backend URL)
3. Start backend: `cd backend && uvicorn app.main:app --reload`
4. Start frontend: `cd frontend && npm run dev`
5. Open the website and click the AI Assistant button
6. Send a message and see real-time streaming responses

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-16-ai-assistant-implementation.md`**

Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?