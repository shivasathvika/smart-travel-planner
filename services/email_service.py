import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from typing import List
from models import Trip, User
from database import get_db

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str):
        """Send an email using SMTP"""
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = FROM_EMAIL
        message["To"] = to_email

        html_part = MIMEText(html_content, "html")
        message.attach(html_part)

        try:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(message)
                return True
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            return False

    @staticmethod
    def send_trip_reminder(trip: Trip, user: User):
        """Send a trip reminder email"""
        subject = f"Upcoming Trip to {trip.destination}"
        html_content = f"""
        <html>
            <body>
                <h2>Trip Reminder</h2>
                <p>Hello {user.full_name},</p>
                <p>This is a reminder about your upcoming trip:</p>
                <div style="margin: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
                    <h3>Trip Details:</h3>
                    <ul>
                        <li><strong>Destination:</strong> {trip.destination}</li>
                        <li><strong>Start Date:</strong> {trip.start_date.strftime('%B %d, %Y')}</li>
                        <li><strong>End Date:</strong> {trip.end_date.strftime('%B %d, %Y')}</li>
                    </ul>
                    {f'<p><strong>Notes:</strong> {trip.notes}</p>' if trip.notes else ''}
                </div>
                <p>Don't forget to check the weather forecast and pack accordingly!</p>
                <p>Have a great trip!</p>
                <p>Best regards,<br>Travel Planner Team</p>
            </body>
        </html>
        """
        return EmailService.send_email(user.email, subject, html_content)

    @staticmethod
    def send_welcome_email(user: User):
        """Send a welcome email to new users"""
        subject = "Welcome to Travel Planner!"
        html_content = f"""
        <html>
            <body>
                <h2>Welcome to Travel Planner!</h2>
                <p>Hello {user.full_name},</p>
                <p>Thank you for joining Travel Planner. We're excited to help you plan your next adventure!</p>
                <div style="margin: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
                    <h3>Getting Started:</h3>
                    <ul>
                        <li>Complete your profile</li>
                        <li>Plan your first trip</li>
                        <li>Explore popular destinations</li>
                        <li>Save your favorite places</li>
                    </ul>
                </div>
                <p>If you have any questions, feel free to contact our support team.</p>
                <p>Happy traveling!</p>
                <p>Best regards,<br>Travel Planner Team</p>
            </body>
        </html>
        """
        return EmailService.send_email(user.email, subject, html_content)

    @staticmethod
    def check_and_send_reminders():
        """Check for upcoming trips and send reminders"""
        db = next(get_db())
        tomorrow = datetime.now() + timedelta(days=1)
        week_from_now = datetime.now() + timedelta(days=7)

        # Get trips starting tomorrow or in a week
        upcoming_trips = db.query(Trip).join(User).filter(
            (Trip.start_date.between(
                tomorrow.replace(hour=0, minute=0, second=0),
                tomorrow.replace(hour=23, minute=59, second=59)
            )) |
            (Trip.start_date.between(
                week_from_now.replace(hour=0, minute=0, second=0),
                week_from_now.replace(hour=23, minute=59, second=59)
            ))
        ).all()

        for trip in upcoming_trips:
            EmailService.send_trip_reminder(trip, trip.user)

def setup_reminder_scheduler():
    """Set up scheduled task for sending reminders"""
    from apscheduler.schedulers.background import BackgroundScheduler
    
    scheduler = BackgroundScheduler()
    # Run every day at 9:00 AM
    scheduler.add_job(EmailService.check_and_send_reminders, 'cron', hour=9)
    scheduler.start()
