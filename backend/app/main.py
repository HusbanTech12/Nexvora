from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import csv
import io
import os
import json
import asyncio
import hashlib
import hmac
from dotenv import load_dotenv
import resend
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from app.services.ai_service import get_ai_service

load_dotenv()

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=5, max_overflow=10)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Lead model
class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), default="")
    company = Column(String(255), default="")
    budget = Column(String(50), default="")
    message = Column(Text, default="")
    lead_type = Column(String(50), default="contact")  # contact or consultation
    status = Column(String(50), default="new")  # new, contacted, qualified, converted
    created_at = Column(DateTime, default=datetime.utcnow)

# User model (for admin)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String(255), unique=True, nullable=False)  # Clerk user ID
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), default="")
    role = Column(String(50), default="admin")  # admin, user
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

# Chat model (for AI conversations)
class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), nullable=False)
    user_message = Column(Text, nullable=False)
    bot_response = Column(Text, nullable=False)
    lead_id = Column(Integer, nullable=True)  # Link to lead if qualified
    created_at = Column(DateTime, default=datetime.utcnow)

# Analytics model (for tracking)
class Analytics(Base):
    __tablename__ = "analytics"
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False)  # page_view, cta_click, lead_created, etc.
    event_data = Column(Text, default="{}")  # JSON string for event details
    visitor_id = Column(String(255), nullable=True)  # Anonymous visitor ID
    created_at = Column(DateTime, default=datetime.utcnow)

# Settings model
class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text, default="")
    updated_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize Resend
resend.api_key = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "Nexvora <onboarding@resend.dev>")
TO_EMAIL = os.getenv("TO_EMAIL", "husbantech08@gmail.com")

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    company: Optional[str] = ""
    message: str

class ConsultationForm(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = ""
    budget: Optional[str] = ""
    message: Optional[str] = ""

# Response model
class LeadResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    company: str
    budget: str
    message: str
    lead_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

def send_contact_email(data: ContactForm):
    html_content = f"""
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {data.name}</p>
    <p><strong>Email:</strong> {data.email}</p>
    <p><strong>Phone:</strong> {data.phone or "Not provided"}</p>
    <p><strong>Company:</strong> {data.company or "Not provided"}</p>
    <p><strong>Message:</strong></p>
    <p>{data.message}</p>
    """

    params = {
        "from": FROM_EMAIL,
        "to": [TO_EMAIL],
        "subject": f"New Contact from {data.name}",
        "html": html_content,
        "reply_to": data.email,
    }

    return resend.Emails.send(params)

def send_consultation_email(data: ConsultationForm):
    html_content = f"""
    <h2>New Consultation Booking</h2>
    <p><strong>Name:</strong> {data.name}</p>
    <p><strong>Email:</strong> {data.email}</p>
    <p><strong>Company:</strong> {data.company or "Not provided"}</p>
    <p><strong>Budget:</strong> {data.budget or "Not provided"}</p>
    <p><strong>Message:</strong></p>
    <p>{data.message or "No message provided"}</p>
    """

    params = {
        "from": FROM_EMAIL,
        "to": [TO_EMAIL],
        "subject": f"Consultation Request from {data.name}",
        "html": html_content,
        "reply_to": data.email,
    }

    return resend.Emails.send(params)

@app.post("/api/contact")
async def submit_contact(data: ContactForm):
    try:
        # Save to database
        db = SessionLocal()
        lead = Lead(
            name=data.name,
            email=str(data.email),
            phone=data.phone or "",
            company=data.company or "",
            message=data.message,
            lead_type="contact"
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)
        db.close()

        # Send email
        send_contact_email(data)
        return {"success": True, "message": "Lead saved and email sent", "lead_id": lead.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/consultation")
async def submit_consultation(data: ConsultationForm):
    try:
        # Save to database
        db = SessionLocal()
        lead = Lead(
            name=data.name,
            email=str(data.email),
            company=data.company or "",
            budget=data.budget or "",
            message=data.message or "",
            lead_type="consultation"
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)
        db.close()

        # Send email
        send_consultation_email(data)
        return {"success": True, "message": "Lead saved and email sent", "lead_id": lead.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leads", response_model=List[LeadResponse])
async def get_leads(status: Optional[str] = None):
    db = SessionLocal()
    try:
        if status:
            leads = db.query(Lead).filter(Lead.status == status).order_by(Lead.created_at.desc()).all()
        else:
            leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
        return leads
    finally:
        db.close()

@app.get("/api/leads/stats")
async def get_leads_stats():
    db = SessionLocal()
    try:
        total = db.query(Lead).count()
        new_leads = db.query(Lead).filter(Lead.status == "new").count()
        contacted = db.query(Lead).filter(Lead.status == "contacted").count()
        qualified = db.query(Lead).filter(Lead.status == "qualified").count()
        converted = db.query(Lead).filter(Lead.status == "converted").count()
        consultations = db.query(Lead).filter(Lead.lead_type == "consultation").count()
        contacts = db.query(Lead).filter(Lead.lead_type == "contact").count()
        return {
            "total": total,
            "new": new_leads,
            "contacted": contacted,
            "qualified": qualified,
            "converted": converted,
            "consultations": consultations,
            "contacts": contacts
        }
    finally:
        db.close()

@app.get("/api/leads/export")
async def export_leads_csv():
    db = SessionLocal()
    try:
        leads = db.query(Lead).order_by(Lead.created_at.desc()).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Name", "Email", "Phone", "Company", "Budget", "Type", "Status", "Created At"])

        for lead in leads:
            writer.writerow([
                lead.id,
                lead.name,
                lead.email,
                lead.phone,
                lead.company,
                lead.budget,
                lead.lead_type,
                lead.status,
                lead.created_at.isoformat() if lead.created_at else ""
            ])

        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=leads.csv"}
        )
    finally:
        db.close()

@app.get("/api/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: int):
    db = SessionLocal()
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        return lead
    finally:
        db.close()

@app.patch("/api/leads/{lead_id}")
async def update_lead_status(lead_id: int, status: str):
    db = SessionLocal()
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        lead.status = status
        db.commit()
        return {"success": True, "message": "Lead status updated"}
    finally:
        db.close()

# Analytics endpoints
class AnalyticsEvent(BaseModel):
    event_type: str
    event_data: Optional[str] = "{}"
    visitor_id: Optional[str] = None

@app.post("/api/analytics/track")
async def track_event(event: AnalyticsEvent):
    db = SessionLocal()
    try:
        analytics = Analytics(
            event_type=event.event_type,
            event_data=event.event_data,
            visitor_id=event.visitor_id
        )
        db.add(analytics)
        db.commit()
        return {"success": True, "message": "Event tracked"}
    finally:
        db.close()

@app.get("/api/analytics/events")
async def get_analytics_events(days: int = 7):
    db = SessionLocal()
    try:
        from datetime import timedelta
        cutoff = datetime.utcnow() - timedelta(days=days)

        events = db.query(Analytics).filter(
            Analytics.created_at >= cutoff
        ).order_by(Analytics.created_at.desc()).all()

        return [
            {
                "id": e.id,
                "event_type": e.event_type,
                "event_data": e.event_data,
                "visitor_id": e.visitor_id,
                "created_at": e.created_at.isoformat()
            }
            for e in events
        ]
    finally:
        db.close()

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    db = SessionLocal()
    try:
        from datetime import timedelta
        today = datetime.utcnow().date()
        week_ago = datetime.utcnow() - timedelta(days=7)

        # Count events by type
        page_views = db.query(Analytics).filter(
            Analytics.event_type == "page_view"
        ).count()
        cta_clicks = db.query(Analytics).filter(
            Analytics.event_type == "cta_click"
        ).count()
        leads_generated = db.query(Lead).count()

        # Weekly comparison
        this_week_events = db.query(Analytics).filter(
            Analytics.created_at >= week_ago
        ).count()
        last_week_events = db.query(Analytics).filter(
            Analytics.created_at >= week_ago - timedelta(days=7),
            Analytics.created_at < week_ago
        ).count()

        return {
            "total_leads": leads_generated,
            "page_views": page_views,
            "cta_clicks": cta_clicks,
            "this_week_events": this_week_events,
            "last_week_events": last_week_events,
            "growth": this_week_events - last_week_events if last_week_events > 0 else 0
        }
    finally:
        db.close()

# Chat endpoints
class ChatMessage(BaseModel):
    session_id: str
    user_message: str
    bot_response: str
    lead_id: Optional[int] = None

@app.post("/api/chats")
async def save_chat(chat: ChatMessage):
    db = SessionLocal()
    try:
        new_chat = Chat(
            session_id=chat.session_id,
            user_message=chat.user_message,
            bot_response=chat.bot_response,
            lead_id=chat.lead_id
        )
        db.add(new_chat)
        db.commit()
        return {"success": True, "message": "Chat saved", "id": new_chat.id}
    finally:
        db.close()

@app.get("/api/chats/{session_id}")
async def get_chat_history(session_id: str):
    db = SessionLocal()
    try:
        chats = db.query(Chat).filter(
            Chat.session_id == session_id
        ).order_by(Chat.created_at.asc()).all()

        return [
            {
                "id": c.id,
                "user_message": c.user_message,
                "bot_response": c.bot_response,
                "lead_id": c.lead_id,
                "created_at": c.created_at.isoformat()
            }
            for c in chats
        ]
    finally:
        db.close()

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# AI Chat streaming endpoint
class ChatRequest(BaseModel):
    session_id: str
    message: str
    history: Optional[List[dict]] = []

async def generate_chat_response(session_id: str, message: str, history: list[dict]):
    ai_service = get_ai_service()
    full_response = ""

    async for chunk in ai_service.chat_stream(message, history):
        full_response += chunk
        yield f"data: {json.dumps({'chunk': chunk})}\n\n"

    # Save chat to database
    db = SessionLocal()
    try:
        chat = Chat(
            session_id=session_id,
            user_message=message,
            bot_response=full_response,
        )
        db.add(chat)
        db.commit()

        # Check for lead qualification
        lead_info = ai_service.extract_lead_info(full_response)
        if lead_info:
            # Check if lead already exists
            existing = db.query(Lead).filter(Lead.email == lead_info.get("email", "")).first()
            if not existing and lead_info.get("email"):
                new_lead = Lead(
                    name=lead_info.get("name", ""),
                    email=lead_info.get("email", ""),
                    company=lead_info.get("company", ""),
                    budget=lead_info.get("budget", ""),
                    lead_type="ai_qualified",
                    status="new",
                )
                db.add(new_lead)
                db.commit()
                chat.lead_id = new_lead.id
                db.commit()

                yield f"data: {json.dumps({'lead_qualified': True, 'lead': {'name': new_lead.name, 'email': new_lead.email}})}\n\n"
    finally:
        db.close()

    yield f"data: {json.dumps({'done': True})}\n\n"

@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    return StreamingResponse(
        generate_chat_response(request.session_id, request.message, request.history or []),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )

# Messages API
class MessageResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    company: str
    budget: str
    message: str
    lead_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

@app.get("/api/messages", response_model=List[MessageResponse])
async def get_messages(limit: int = 50, lead_type: Optional[str] = None):
    db = SessionLocal()
    try:
        query = db.query(Lead).filter(Lead.message != "")
        if lead_type:
            query = query.filter(Lead.lead_type == lead_type)
        messages = query.order_by(Lead.created_at.desc()).limit(limit).all()
        return messages
    finally:
        db.close()

@app.get("/api/messages/{message_id}", response_model=MessageResponse)
async def get_message(message_id: int):
    db = SessionLocal()
    try:
        msg = db.query(Lead).filter(Lead.id == message_id, Lead.message != "").first()
        if not msg:
            raise HTTPException(status_code=404, detail="Message not found")
        return msg
    finally:
        db.close()

@app.get("/api/messages/unread/count")
async def get_unread_count():
    db = SessionLocal()
    try:
        count = db.query(Lead).filter(
            Lead.status == "new",
            Lead.message != ""
        ).count()
        return {"unread": count}
    finally:
        db.close()

# Advanced Analytics
@app.get("/api/analytics/daily-leads")
async def get_daily_leads(days: int = 30):
    db = SessionLocal()
    try:
        from datetime import timedelta
        cutoff = datetime.utcnow() - timedelta(days=days)

        leads = db.query(Lead).filter(Lead.created_at >= cutoff).all()

        daily_data = {}
        for lead in leads:
            day = lead.created_at.strftime("%Y-%m-%d")
            if day not in daily_data:
                daily_data[day] = {"date": day, "leads": 0, "consultations": 0, "contacts": 0}
            daily_data[day]["leads"] += 1
            if lead.lead_type == "consultation":
                daily_data[day]["consultations"] += 1
            else:
                daily_data[day]["contacts"] += 1

        result = sorted(daily_data.values(), key=lambda x: x["date"])
        return result
    finally:
        db.close()

@app.get("/api/analytics/conversion")
async def get_conversion_data():
    db = SessionLocal()
    try:
        total = db.query(Lead).count()
        new = db.query(Lead).filter(Lead.status == "new").count()
        contacted = db.query(Lead).filter(Lead.status == "contacted").count()
        qualified = db.query(Lead).filter(Lead.status == "qualified").count()
        converted = db.query(Lead).filter(Lead.status == "converted").count()

        page_views = db.query(Analytics).filter(Analytics.event_type == "page_view").count()
        cta_clicks = db.query(Analytics).filter(Analytics.event_type == "cta_click").count()

        conversion_rate = (converted / total * 100) if total > 0 else 0
        lead_rate = (total / page_views * 100) if page_views > 0 else 0

        return {
            "visitors": page_views,
            "total_leads": total,
            "new": new,
            "contacted": contacted,
            "qualified": qualified,
            "converted": converted,
            "cta_clicks": cta_clicks,
            "conversion_rate": round(conversion_rate, 2),
            "lead_rate": round(lead_rate, 2),
            "funnel": [
                {"stage": "Visitors", "count": page_views},
                {"stage": "Leads", "count": total},
                {"stage": "Contacted", "count": contacted},
                {"stage": "Qualified", "count": qualified},
                {"stage": "Converted", "count": converted},
            ]
        }
    finally:
        db.close()

@app.get("/api/analytics/sources")
async def get_lead_sources():
    db = SessionLocal()
    try:
        total = db.query(Lead).count()
        consultations = db.query(Lead).filter(Lead.lead_type == "consultation").count()
        contacts = db.query(Lead).filter(Lead.lead_type == "contact").count()
        ai_qualified = db.query(Lead).filter(Lead.lead_type == "ai_qualified").count()

        sources = []
        if consultations > 0:
            sources.append({"source": "Consultation Form", "leads": consultations, "percentage": round(consultations / total * 100, 1) if total > 0 else 0})
        if contacts > 0:
            sources.append({"source": "Contact Form", "leads": contacts, "percentage": round(contacts / total * 100, 1) if total > 0 else 0})
        if ai_qualified > 0:
            sources.append({"source": "AI Assistant", "leads": ai_qualified, "percentage": round(ai_qualified / total * 100, 1) if total > 0 else 0})

        return sources
    finally:
        db.close()

@app.get("/api/analytics/recent-activity")
async def get_recent_activity(limit: int = 20):
    db = SessionLocal()
    try:
        activities = []

        recent_leads = db.query(Lead).order_by(Lead.created_at.desc()).limit(limit).all()
        for lead in recent_leads:
            activities.append({
                "type": "lead",
                "title": f"New lead: {lead.name}",
                "description": f"{lead.lead_type} lead from {lead.email}",
                "created_at": lead.created_at.isoformat()
            })

        recent_chats = db.query(Chat).order_by(Chat.created_at.desc()).limit(limit).all()
        for chat in recent_chats:
            activities.append({
                "type": "chat",
                "title": "AI Chat interaction",
                "description": chat.user_message[:100] + ("..." if len(chat.user_message) > 100 else ""),
                "created_at": chat.created_at.isoformat()
            })

        activities.sort(key=lambda x: x["created_at"], reverse=True)
        return activities[:limit]
    finally:
        db.close()

# Reporting System
class ReportRequest(BaseModel):
    report_type: str  # leads, analytics, conversion
    start_date: Optional[str] = None
    end_date: Optional[str] = None

@app.get("/api/reports/leads")
async def generate_leads_report(start_date: Optional[str] = None, end_date: Optional[str] = None):
    db = SessionLocal()
    try:
        query = db.query(Lead)
        if start_date:
            query = query.filter(Lead.created_at >= datetime.fromisoformat(start_date))
        if end_date:
            query = query.filter(Lead.created_at <= datetime.fromisoformat(end_date))

        leads = query.order_by(Lead.created_at.desc()).all()

        total = len(leads)
        by_status = {}
        by_type = {}
        by_company = {}

        for lead in leads:
            by_status[lead.status] = by_status.get(lead.status, 0) + 1
            by_type[lead.lead_type] = by_type.get(lead.lead_type, 0) + 1
            if lead.company:
                by_company[lead.company] = by_company.get(lead.company, 0) + 1

        return {
            "total": total,
            "by_status": by_status,
            "by_type": by_type,
            "by_company": dict(sorted(by_company.items(), key=lambda x: x[1], reverse=True)[:10]),
            "leads": [
                {
                    "id": l.id,
                    "name": l.name,
                    "email": l.email,
                    "company": l.company,
                    "budget": l.budget,
                    "status": l.status,
                    "lead_type": l.lead_type,
                    "created_at": l.created_at.isoformat()
                }
                for l in leads
            ]
        }
    finally:
        db.close()

@app.get("/api/reports/analytics")
async def generate_analytics_report(days: int = 30):
    db = SessionLocal()
    try:
        from datetime import timedelta
        cutoff = datetime.utcnow() - timedelta(days=days)

        total_leads = db.query(Lead).count()
        new_leads = db.query(Lead).filter(Lead.created_at >= cutoff).count()
        converted = db.query(Lead).filter(Lead.status == "converted").count()
        page_views = db.query(Analytics).count()
        recent_views = db.query(Analytics).filter(Analytics.created_at >= cutoff).count()

        conversion_rate = (converted / total_leads * 100) if total_leads > 0 else 0

        return {
            "period_days": days,
            "total_leads": total_leads,
            "new_leads_in_period": new_leads,
            "total_converted": converted,
            "total_page_views": page_views,
            "page_views_in_period": recent_views,
            "conversion_rate": round(conversion_rate, 2),
            "generated_at": datetime.utcnow().isoformat()
        }
    finally:
        db.close()

@app.get("/api/reports/export")
async def export_full_report(format: str = "json"):
    db = SessionLocal()
    try:
        leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
        stats = {
            "total": len(leads),
            "by_status": {},
            "by_type": {},
        }

        for lead in leads:
            stats["by_status"][lead.status] = stats["by_status"].get(lead.status, 0) + 1
            stats["by_type"][lead.lead_type] = stats["by_type"].get(lead.lead_type, 0) + 1

        report = {
            "generated_at": datetime.utcnow().isoformat(),
            "stats": stats,
            "leads": [
                {
                    "id": l.id,
                    "name": l.name,
                    "email": l.email,
                    "phone": l.phone,
                    "company": l.company,
                    "budget": l.budget,
                    "message": l.message,
                    "status": l.status,
                    "lead_type": l.lead_type,
                    "created_at": l.created_at.isoformat()
                }
                for l in leads
            ]
        }

        if format == "csv":
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(["ID", "Name", "Email", "Phone", "Company", "Budget", "Status", "Type", "Message", "Created At"])
            for lead in leads:
                writer.writerow([lead.id, lead.name, lead.email, lead.phone, lead.company, lead.budget, lead.status, lead.lead_type, lead.message, lead.created_at.isoformat() if lead.created_at else ""])
            output.seek(0)
            return StreamingResponse(
                iter([output.getvalue()]),
                media_type="text/csv",
                headers={"Content-Disposition": "attachment; filename=full_report.csv"}
            )

        return report
    finally:
        db.close()

# Real-time SSE for dashboard updates
async def dashboard_sse():
    db = SessionLocal()
    try:
        while True:
            total = db.query(Lead).count()
            new_leads = db.query(Lead).filter(Lead.status == "new").count()
            today = datetime.utcnow().date()
            today_leads = db.query(Lead).filter(
                Lead.created_at >= datetime.combine(today, datetime.min.time())
            ).count()

            data = {
                "total_leads": total,
                "new_leads": new_leads,
                "today_leads": today_leads,
                "timestamp": datetime.utcnow().isoformat()
            }
            yield f"data: {json.dumps(data)}\n\n"
            await asyncio.sleep(10)
    finally:
        db.close()

@app.get("/api/dashboard/live")
async def dashboard_live_stream():
    return StreamingResponse(
        dashboard_sse(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )

# Settings API
class SettingsUpdate(BaseModel):
    settings: dict

def get_setting(db, key: str, default: str = "") -> str:
    setting = db.query(Settings).filter(Settings.key == key).first()
    return setting.value if setting else default

def set_setting(db, key: str, value: str):
    setting = db.query(Settings).filter(Settings.key == key).first()
    if setting:
        setting.value = value
        setting.updated_at = datetime.utcnow()
    else:
        setting = Settings(key=key, value=value)
        db.add(setting)
    db.commit()

@app.get("/api/settings")
async def get_settings():
    db = SessionLocal()
    try:
        settings = db.query(Settings).all()
        result = {s.key: s.value for s in settings}

        defaults = {
            "business_name": "Nexvora",
            "admin_name": "",
            "admin_phone": "",
            "notify_email_enabled": "true",
            "notify_whatsapp_enabled": "false",
            "notify_daily_summary": "true",
            "resend_api_key": "",
            "from_email": "onboarding@resend.dev",
            "notification_email": "",
            "whatsapp_phone": "",
            "whatsapp_token": "",
        }

        for key, default in defaults.items():
            if key not in result:
                result[key] = default

        return result
    finally:
        db.close()

@app.post("/api/settings")
async def update_settings(data: SettingsUpdate):
    db = SessionLocal()
    try:
        for key, value in data.settings.items():
            set_setting(db, key, str(value))
        return {"success": True, "message": "Settings updated"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.delete("/api/settings/leads")
async def delete_all_leads():
    db = SessionLocal()
    try:
        db.query(Lead).delete()
        db.commit()
        return {"success": True, "message": "All leads deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

# Clerk Webhook - Sync users to database
CLERK_WEBHOOK_SECRET = os.getenv("CLERK_WEBHOOK_SECRET", "")

def verify_clerk_webhook(payload: bytes, sig_header: str) -> bool:
    if not CLERK_WEBHOOK_SECRET:
        return True  # Skip verification in dev if no secret set
    return hmac.new(
        CLERK_WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest() == sig_header

@app.post("/api/webhooks/clerk")
async def clerk_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("x-clerk-signature", "")

    if CLERK_WEBHOOK_SECRET and not verify_clerk_webhook(payload, sig_header):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    event = json.loads(payload)
    event_type = event.get("type")
    data = event.get("data", {})

    db = SessionLocal()
    try:
        if event_type == "user.created":
            existing = db.query(User).filter(User.clerk_id == data["id"]).first()
            if not existing:
                email = data.get("email_addresses", [{}])[0].get("email_address", "")
                new_user = User(
                    clerk_id=data["id"],
                    email=email,
                    name=f"{data.get('first_name', '')} {data.get('last_name', '')}".strip(),
                    role="user",
                    created_at=datetime.fromtimestamp(data["created_at"] / 1000),
                )
                db.add(new_user)
                db.commit()

        elif event_type == "user.updated":
            user = db.query(User).filter(User.clerk_id == data["id"]).first()
            if user:
                email = data.get("email_addresses", [{}])[0].get("email_address", "")
                user.email = email
                user.name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
                db.commit()

        elif event_type == "user.deleted":
            db.query(User).filter(User.clerk_id == data["id"]).delete()
            db.commit()

        return JSONResponse(content={"received": True})
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
