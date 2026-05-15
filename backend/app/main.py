from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
from dotenv import load_dotenv
import resend

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
        send_contact_email(data)
        return {"success": True, "message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/consultation")
async def submit_consultation(data: ConsultationForm):
    try:
        send_consultation_email(data)
        return {"success": True, "message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
