import httpx
from fastapi import HTTPException
from datetime import datetime, timedelta
import os
from typing import Dict, List, Optional

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("WEATHER_API_KEY")
        self.base_url = "http://api.openweathermap.org/data/2.5"
        
    async def get_weather_forecast(self, city: str, start_date: datetime, end_date: datetime) -> List[Dict]:
        """Get weather forecast for a city during the travel dates."""
        if not self.api_key:
            raise HTTPException(status_code=500, detail="Weather API key not configured")
            
        try:
            # Get coordinates for the city
            async with httpx.AsyncClient() as client:
                geo_response = await client.get(
                    f"http://api.openweathermap.org/geo/1.0/direct",
                    params={
                        "q": city,
                        "limit": 1,
                        "appid": self.api_key
                    }
                )
                geo_response.raise_for_status()
                locations = geo_response.json()
                
                if not locations:
                    raise HTTPException(status_code=404, detail=f"City not found: {city}")
                
                lat, lon = locations[0]["lat"], locations[0]["lon"]
                
                # Get 5-day forecast
                forecast_response = await client.get(
                    f"{self.base_url}/forecast",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "appid": self.api_key,
                        "units": "metric"  # Use Celsius
                    }
                )
                forecast_response.raise_for_status()
                forecast_data = forecast_response.json()
                
                # Filter and format weather data
                weather_forecast = []
                for item in forecast_data["list"]:
                    forecast_date = datetime.fromtimestamp(item["dt"])
                    if start_date <= forecast_date <= end_date:
                        weather_forecast.append({
                            "date": forecast_date.strftime("%Y-%m-%d"),
                            "time": forecast_date.strftime("%H:%M"),
                            "temperature": round(item["main"]["temp"], 1),
                            "feels_like": round(item["main"]["feels_like"], 1),
                            "description": item["weather"][0]["description"],
                            "humidity": item["main"]["humidity"],
                            "wind_speed": item["wind"]["speed"],
                            "icon": item["weather"][0]["icon"]
                        })
                
                return weather_forecast
                
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"Weather API error: {str(e)}")
            
    async def get_current_weather(self, city: str) -> Dict:
        """Get current weather for a city."""
        if not self.api_key:
            raise HTTPException(status_code=500, detail="Weather API key not configured")
            
        try:
            async with httpx.AsyncClient() as client:
                # Get coordinates
                geo_response = await client.get(
                    f"http://api.openweathermap.org/geo/1.0/direct",
                    params={
                        "q": city,
                        "limit": 1,
                        "appid": self.api_key
                    }
                )
                geo_response.raise_for_status()
                locations = geo_response.json()
                
                if not locations:
                    raise HTTPException(status_code=404, detail=f"City not found: {city}")
                
                lat, lon = locations[0]["lat"], locations[0]["lon"]
                
                # Get current weather
                weather_response = await client.get(
                    f"{self.base_url}/weather",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "appid": self.api_key,
                        "units": "metric"
                    }
                )
                weather_response.raise_for_status()
                weather_data = weather_response.json()
                
                return {
                    "temperature": round(weather_data["main"]["temp"], 1),
                    "feels_like": round(weather_data["main"]["feels_like"], 1),
                    "description": weather_data["weather"][0]["description"],
                    "humidity": weather_data["main"]["humidity"],
                    "wind_speed": weather_data["wind"]["speed"],
                    "icon": weather_data["weather"][0]["icon"]
                }
                
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"Weather API error: {str(e)}")

# Create singleton instance
weather_service = WeatherService()
