from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import csv
import io
import os
from dotenv import load_dotenv
import resend
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base

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
engine = create_engine(DATABASE_URL)
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

        # Create CSV
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

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
