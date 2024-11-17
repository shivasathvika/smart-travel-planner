from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import Dict, List
from sqlalchemy.orm import Session

from database import get_db
from services.weather_service import WeatherService
from models import Trip, User
from auth import get_current_user

router = APIRouter(prefix="/api/weather", tags=["weather"])

@router.get("/forecast/{trip_id}")
async def get_trip_forecast(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict:
    """Get weather forecast for a specific trip"""
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id
    ).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    forecast = WeatherService.get_forecast(
        trip.destination,
        trip.start_date,
        trip.end_date
    )
    
    # Add packing suggestions based on forecast
    packing_suggestions = WeatherService.get_packing_suggestions(forecast)
    forecast["packing_suggestions"] = packing_suggestions

    return forecast

@router.get("/current/{destination}")
async def get_current_weather(
    destination: str,
    _: User = Depends(get_current_user)
) -> Dict:
    """Get current weather for a destination"""
    return WeatherService.get_current_weather(destination)

@router.get("/alerts/{destination}")
async def get_destination_alerts(
    destination: str,
    _: User = Depends(get_current_user)
) -> List[Dict]:
    """Get weather alerts for a destination"""
    return WeatherService.get_weather_alerts(destination)
