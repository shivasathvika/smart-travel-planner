from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.weather_service import weather_service
from database import get_db
import models
import auth
from typing import List, Dict
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/weather",
    tags=["weather"]
)

class WeatherRequest(BaseModel):
    city: str
    start_date: datetime
    end_date: datetime

@router.post("/forecast")
async def get_weather_forecast(request: WeatherRequest, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)) -> List[Dict]:
    """Get weather forecast for a city during travel dates."""
    try:
        forecast = await weather_service.get_weather_forecast(
            request.city,
            request.start_date,
            request.end_date
        )
        return forecast
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/current/{city}")
async def get_current_weather(city: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)) -> Dict:
    """Get current weather for a city."""
    try:
        current_weather = await weather_service.get_current_weather(city)
        return current_weather
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
