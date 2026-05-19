import os
import json
import asyncio
from typing import AsyncGenerator, Optional

SYSTEM_PROMPT = """You are Nexvora AI Assistant, a helpful and knowledgeable assistant for Nexvora - a premium AI-powered fullstack development agency.

ABOUT NEXVORA:
- We build AI-powered websites that convert visitors into customers
- We specialize in modern fullstack web systems, SaaS platforms, admin dashboards, and AI-integrated web systems
- We serve US, Dubai, and Saudi businesses, startups, agencies, e-commerce brands, and growing businesses
- Our packages range from $499 (Starter) to $8,000+ (Premium)

YOUR ROLE:
1. Answer questions about our services professionally
2. Help visitors understand which package suits their needs
3. Guide visitors toward booking a free consultation
4. Qualify leads by gathering business information naturally

LEAD QUALIFICATION - When chatting, try to naturally gather:
- Name
- Email
- Company name
- Budget range
- Project type/needs

PACKAGE DETAILS:
- Starter ($499-$999): Responsive website, premium UI/UX, contact forms, deployment, WhatsApp integration
- Growth ($1,500-$3,000): Fullstack web app, admin dashboard, AI integration, lead generation, analytics
- Premium ($3,000-$8,000+): Advanced AI systems, custom dashboards, scalable architecture, premium support

RESPONSE GUIDELINES:
- Be friendly, professional, and helpful
- Keep responses concise (2-4 sentences)
- Use markdown formatting for lists and emphasis
- Always encourage consultation booking when appropriate
- If asked about pricing, give the range and suggest a consultation
- If asked about timeline, say typically 2-6 weeks depending on scope
- Never make up specific client names or exact project details
- If you don't know something, suggest booking a consultation

When a user shares their contact details or shows strong interest, respond with a JSON block at the end:
```json
{"lead_qualified": true, "name": "...", "email": "...", "company": "...", "budget": "..."}
```

Only include the JSON block when you have at least name and email."""

FALLBACK_RESPONSES = {
    "default": "I'd be happy to help! Our team specializes in building AI-powered websites that convert visitors into customers. Would you like to book a free consultation to discuss your project?",
    "pricing": "Our packages range from $499 for a responsive business website to $8,000+ for premium solutions with advanced AI systems. The best option depends on your specific needs. Let's discuss this in a free consultation!",
    "services": "We offer modern business websites, fullstack web apps with AI integration, admin dashboards, and lead generation systems. Which area interests you most?",
    "consultation": "Great! You can book a free consultation by clicking the 'Book Free Consultation' button on our website, or I can help you get started right here. What type of project are you looking to build?",
    "timeline": "Most projects take 2-6 weeks depending on scope and complexity. A simple business website might be ready in 2 weeks, while a fullstack app with AI integration could take 4-6 weeks.",
}


def _get_fallback_response(user_message: str) -> str:
    msg = user_message.lower()
    if any(w in msg for w in ["price", "cost", "budget", "how much", "afford"]):
        return FALLBACK_RESPONSES["pricing"]
    if any(w in msg for w in ["service", "offer", "what do you", "what can you"]):
        return FALLBACK_RESPONSES["services"]
    if any(w in msg for w in ["book", "consult", "contact", "schedule", "meeting", "talk"]):
        return FALLBACK_RESPONSES["consultation"]
    if any(w in msg for w in ["timeline", "how long", "weeks", "days", "time"]):
        return FALLBACK_RESPONSES["timeline"]
    return FALLBACK_RESPONSES["default"]


class AIService:
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "groq").lower()
        self._gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self._gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        self._groq_api_key = os.getenv("GROQ_API_KEY", "")
        self._groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self._openai_client = None
        self._anthropic_client = None
        self._groq_client = None
        self._openai_model = ""
        self._anthropic_model = ""
        self._gemini_available = bool(self._gemini_api_key)
        self._groq_available = bool(self._groq_api_key)
        self._init_clients()

    def _init_clients(self):
        if self.provider == "groq" and self._groq_available:
            try:
                from openai import AsyncOpenAI
                self._groq_client = AsyncOpenAI(
                    api_key=self._groq_api_key,
                    base_url="https://api.groq.com/openai/v1"
                )
            except ImportError:
                self._groq_available = False
        elif self.provider == "openai":
            try:
                from openai import AsyncOpenAI
                self._openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
                self._openai_model = os.getenv("OPENAI_MODEL", "gpt-4o")
            except ImportError:
                self._openai_client = None
        elif self.provider == "anthropic":
            try:
                from anthropic import AsyncAnthropic
                self._anthropic_client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))
                self._anthropic_model = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
            except ImportError:
                self._anthropic_client = None

    async def chat_stream(
        self,
        message: str,
        history: list[dict] | None = None,
    ) -> AsyncGenerator[str, None]:
        if self.provider == "groq" and self._groq_available:
            async for chunk in self._chat_groq_stream(message, history):
                yield chunk
        elif self.provider == "gemini" and self._gemini_available:
            async for chunk in self._chat_gemini_stream(message, history):
                yield chunk
        elif self.provider == "openai" and self._openai_client:
            async for chunk in self._chat_openai_stream(message, history):
                yield chunk
        elif self.provider == "anthropic" and self._anthropic_client:
            async for chunk in self._chat_anthropic_stream(message, history):
                yield chunk
        else:
            response = _get_fallback_response(message)
            for char in response:
                yield char
                await asyncio.sleep(0.01)

    async def _chat_groq_stream(
        self,
        message: str,
        history: list[dict] | None = None,
    ) -> AsyncGenerator[str, None]:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if history:
            for msg in history[-10:]:
                messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": message})

        try:
            stream = await self._groq_client.chat.completions.create(
                model=self._groq_model,
                messages=messages,
                stream=True,
                max_tokens=1024,
                temperature=0.7,
            )

            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            print(f"Groq API error: {e}")
            fallback = _get_fallback_response(message)
            for char in fallback:
                yield char
                await asyncio.sleep(0.01)

    async def _chat_gemini_stream(
        self,
        message: str,
        history: list[dict] | None = None,
    ) -> AsyncGenerator[str, None]:
        import httpx

        system_instruction = {
            "role": "user",
            "parts": [{"text": SYSTEM_PROMPT}]
        }

        contents = [system_instruction]

        if history:
            for msg in history[-10:]:
                role = "user" if msg["role"] == "user" else "model"
                contents.append({"role": role, "parts": [{"text": msg["content"]}]})

        contents.append({"role": "user", "parts": [{"text": message}]})

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self._gemini_model}:streamGenerateContent?key={self._gemini_api_key}"

        payload = {
            "contents": contents,
            "generationConfig": {
                "maxOutputTokens": 1024,
                "temperature": 0.7,
            }
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", url, json=payload) as response:
                if response.status_code != 200:
                    error_body = await response.aread()
                    print(f"Gemini API error: {response.status_code} {error_body.decode()}")
                    fallback = _get_fallback_response(message)
                    for char in fallback:
                        yield char
                        await asyncio.sleep(0.01)
                    return

                buffer = ""
                async for chunk in response.aiter_text():
                    buffer += chunk
                    while "\n" in buffer:
                        line, buffer = buffer.split("\n", 1)
                        line = line.strip()
                        if line.startswith("["):
                            line = line.lstrip("[")
                        if line.endswith("]"):
                            line = line.rstrip("]")
                        if line.startswith("},"):
                            line = line.rstrip(",")
                        if line.startswith("{") and "text" in line:
                            try:
                                data = json.loads(line)
                                candidates = data.get("candidates", [])
                                if candidates:
                                    content = candidates[0].get("content", {})
                                    parts = content.get("parts", [])
                                    for part in parts:
                                        if "text" in part:
                                            yield part["text"]
                            except json.JSONDecodeError:
                                pass

    async def _chat_openai_stream(
        self,
        message: str,
        history: list[dict] | None = None,
    ) -> AsyncGenerator[str, None]:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if history:
            for msg in history:
                messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": message})

        stream = await self._openai_client.chat.completions.create(
            model=self._openai_model,
            messages=messages,
            stream=True,
            max_tokens=1024,
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def _chat_anthropic_stream(
        self,
        message: str,
        history: list[dict] | None = None,
    ) -> AsyncGenerator[str, None]:
        messages = []
        if history:
            for msg in history:
                role = "user" if msg["role"] == "user" else "assistant"
                messages.append({"role": role, "content": msg["content"]})

        messages.append({"role": "user", "content": message})

        result = await self._anthropic_client.messages.create(
            model=self._anthropic_model,
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages,
        )

        for content_block in result.content:
            if content_block.type == "text":
                yield content_block.text

    def extract_lead_info(self, response_text: str) -> Optional[dict]:
        try:
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
                data = json.loads(json_str)
                if data.get("lead_qualified"):
                    return data
        except (json.JSONDecodeError, IndexError):
            pass
        return None


_ai_service: Optional[AIService] = None


def get_ai_service() -> AIService:
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
