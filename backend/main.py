import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

from models import Base
from schemas import UserCreate, User, Token
from database import engine, get_db
from routers import auth_router, users_router, weather_router, places_router, travel_plans_router
from services.email_service import EmailService
from services.weather_service import WeatherService

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
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(weather_router, prefix="/api/weather", tags=["Weather"])
app.include_router(places_router, prefix="/api/places", tags=["Places"])
app.include_router(travel_plans_router, prefix="/api/travel-plans", tags=["Travel Plans"])

@app.get("/")
async def root():
    return {"message": "Welcome to Smart Travel Planner API"}

# Authentication endpoints
@app.post("/api/token", response_model=Token)
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
    # Initialize your scheduler here
    pass

setup_reminder_scheduler()
