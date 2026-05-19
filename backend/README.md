# Nexvora Backend API

FastAPI backend for the Nexvora AI-powered web development agency platform.

## Tech Stack

- **FastAPI** — Web framework
- **SQLAlchemy** — ORM
- **PostgreSQL (Neon)** — Database
- **Google Gemini / OpenAI / Anthropic** — LLM providers
- **Resend** — Email service

## Setup

```bash
# Install dependencies
uv sync

# Copy and configure environment
cp .env.example .env  # Edit with your API keys

# Run the server
uv run uvicorn app.main:app --reload
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `RESEND_API_KEY` | Resend email API key | Yes |
| `FROM_EMAIL` | Sender email address | Yes |
| `TO_EMAIL` | Admin notification email | Yes |
| `AI_PROVIDER` | LLM provider: `gemini`, `openai`, or `anthropic` | No (default: gemini) |
| `GEMINI_API_KEY` | Google Gemini API key | If using Gemini |
| `OPENAI_API_KEY` | OpenAI API key | If using OpenAI |
| `ANTHROPIC_API_KEY` | Anthropic API key | If using Anthropic |

## API Endpoints

### Leads
- `POST /api/contact` — Submit contact form
- `POST /api/consultation` — Book consultation
- `GET /api/leads` — List all leads
- `GET /api/leads/stats` — Lead statistics
- `GET /api/leads/export` — Export leads as CSV
- `GET /api/leads/{id}` — Get single lead
- `PATCH /api/leads/{id}` — Update lead status

### AI Chat
- `POST /api/chat/stream` — Stream AI chat response (SSE)

### Analytics
- `POST /api/analytics/track` — Track event
- `GET /api/analytics/summary` — Analytics summary

### Health
- `GET /api/health` — Health check

## Deployment

### Render

```bash
# Push to GitHub, then connect to Render
# Render will use render.yaml automatically
```

### Docker

```bash
docker build -t nexvora-api .
docker run -p 8000:8000 --env-file .env nexvora-api
```

## Tests

```bash
uv run pytest app/tests/ -v
```
