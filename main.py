from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import sys

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.models import Base
from backend.database import engine
from backend.routers import auth_router, users_router, weather_router, places_router, travel_plans_router

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

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(weather_router, prefix="/api/weather", tags=["Weather"])
app.include_router(places_router, prefix="/api/places", tags=["Places"])
app.include_router(travel_plans_router, prefix="/api/travel-plans", tags=["Travel Plans"])

@app.get("/")
async def root():
    return {"message": "Welcome to Smart Travel Planner API"}
