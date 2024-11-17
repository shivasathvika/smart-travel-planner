from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import asyncio
from backend.models.travel_plan import TravelPlan, Activity
from backend.schemas.travel_plan import TravelPreferences
from backend.services.weather_service import WeatherService

class TravelPlannerService:
    def __init__(self, db: Session, weather_service: WeatherService):
        self.db = db
        self.weather_service = weather_service

    async def generate_plan(self, travel_plan: TravelPlan) -> None:
        """Generate activities for a travel plan based on preferences and constraints."""
        
        # Calculate trip duration
        trip_days = (travel_plan.end_date - travel_plan.start_date).days + 1
        daily_budget = travel_plan.budget / trip_days if travel_plan.budget > 0 else 0

        # Get weather forecast for the destination
        weather_data = await self.weather_service.get_forecast(
            travel_plan.destination,
            travel_plan.start_date,
            travel_plan.end_date
        )

        # Store weather data
        for date, weather in weather_data.items():
            self.db.add(WeatherData(
                travel_plan_id=travel_plan.id,
                date=date,
                temperature=weather.get('temperature', 0),
                conditions=weather.get('conditions', 'unknown'),
                precipitation=weather.get('precipitation', 0),
                wind_speed=weather.get('wind_speed', 0)
            ))

        # Generate activities based on preferences and weather
        for day in range(trip_days):
            current_date = travel_plan.start_date + timedelta(days=day)
            daily_weather = weather_data.get(current_date.date(), {})

            # Morning activity
            self.db.add(Activity(
                travel_plan_id=travel_plan.id,
                name=f"Morning Activity - Day {day + 1}",
                description="Generated morning activity",
                location=travel_plan.destination,
                date=current_date,
                start_time=current_date.replace(hour=9),
                end_time=current_date.replace(hour=12),
                cost=daily_budget * 0.3,
                category="morning"
            ))

            # Afternoon activity
            self.db.add(Activity(
                travel_plan_id=travel_plan.id,
                name=f"Afternoon Activity - Day {day + 1}",
                description="Generated afternoon activity",
                location=travel_plan.destination,
                date=current_date,
                start_time=current_date.replace(hour=14),
                end_time=current_date.replace(hour=17),
                cost=daily_budget * 0.4,
                category="afternoon"
            ))

            # Evening activity
            self.db.add(Activity(
                travel_plan_id=travel_plan.id,
                name=f"Evening Activity - Day {day + 1}",
                description="Generated evening activity",
                location=travel_plan.destination,
                date=current_date,
                start_time=current_date.replace(hour=19),
                end_time=current_date.replace(hour=22),
                cost=daily_budget * 0.3,
                category="evening"
            ))

        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e
