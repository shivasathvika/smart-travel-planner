from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=os.getenv("MAIL_USERNAME", ""),
            MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", ""),
            MAIL_FROM=os.getenv("MAIL_FROM", "noreply@travelplanner.com"),
            MAIL_PORT=int(os.getenv("MAIL_PORT", "587")),
            MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
            MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME", "Travel Planner"),
            MAIL_TLS=True,
            MAIL_SSL=False,
            USE_CREDENTIALS=True,
            TEMPLATE_FOLDER=Path(__file__).parent / "email_templates"
        )
        self.fast_mail = FastMail(self.conf)

    async def send_welcome_email(self, email: EmailStr, username: str):
        """Send a welcome email to new users."""
        message = MessageSchema(
            subject="Welcome to Travel Planner!",
            recipients=[email],
            body=f"""
            Hi {username},

            Welcome to Travel Planner! We're excited to help you plan your next adventure.

            Best regards,
            The Travel Planner Team
            """,
            subtype="plain"
        )
        await self.fast_mail.send_message(message)

    async def send_trip_confirmation(self, email: EmailStr, trip_details: dict):
        """Send trip confirmation email."""
        message = MessageSchema(
            subject=f"Trip Confirmation - {trip_details['destination']}",
            recipients=[email],
            body=f"""
            Your trip to {trip_details['destination']} has been confirmed!

            Trip Details:
            - Start Date: {trip_details['start_date']}
            - End Date: {trip_details['end_date']}
            - Budget: ${trip_details['budget']}

            You can view your full itinerary by logging into your account.

            Best regards,
            The Travel Planner Team
            """,
            subtype="plain"
        )
        await self.fast_mail.send_message(message)

    async def send_trip_reminder(self, email: EmailStr, trip_details: dict):
        """Send trip reminder email."""
        message = MessageSchema(
            subject=f"Trip Reminder - {trip_details['destination']}",
            recipients=[email],
            body=f"""
            Your trip to {trip_details['destination']} is coming up!

            Trip Details:
            - Start Date: {trip_details['start_date']}
            - End Date: {trip_details['end_date']}

            Don't forget to:
            1. Check the weather forecast
            2. Review your itinerary
            3. Pack accordingly

            Have a great trip!
            The Travel Planner Team
            """,
            subtype="plain"
        )
        await self.fast_mail.send_message(message)

    async def send_trip_update(self, email: EmailStr, update_details: dict):
        """Send trip update notification."""
        message = MessageSchema(
            subject=f"Trip Update - {update_details['destination']}",
            recipients=[email],
            body=f"""
            Your trip to {update_details['destination']} has been updated.

            Changes:
            {update_details['changes']}

            You can view the updated itinerary by logging into your account.

            Best regards,
            The Travel Planner Team
            """,
            subtype="plain"
        )
        await self.fast_mail.send_message(message)
