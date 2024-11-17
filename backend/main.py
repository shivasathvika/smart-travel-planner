import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

from backend.models import Base
from backend.schemas import UserCreate, User, Token
from backend.database import engine, get_db
from backend.routers import auth, users, weather, places, travel_plans
from backend.services.email_service import EmailService
from backend.services.weather_service import WeatherService

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Travel Planner API",
    description="API for planning trips with weather forecasts and activities",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(weather.router)
app.include_router(places.router)
app.include_router(travel_plans.router)

@app.get("/")
def root():
    return {"message": "Smart Travel Planner API is running"}

# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Initialize email reminder scheduler
def setup_reminder_scheduler():
    # Add implementation for setting up the email reminder scheduler
    pass
setup_reminder_scheduler()
