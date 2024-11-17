import asyncio
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import httpx
from fastapi import HTTPException
import pytest

# Load environment variables
load_dotenv()

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("WEATHER_API_KEY")
        self.base_url = "http://api.openweathermap.org/data/2.5"
        
    async def get_current_weather(self, city: str):
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
            print(f"HTTP Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Weather API error: {str(e)}")
        except Exception as e:
            print(f"General Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

weather_service = WeatherService()

@pytest.mark.asyncio
async def test_weather():
    try:
        # Test current weather
        print("\nTesting current weather for London:")
        current = await weather_service.get_current_weather("London")
        print(f"Temperature: {current['temperature']}°C")
        print(f"Description: {current['description']}")
        print(f"Humidity: {current['humidity']}%")
        print(f"Wind Speed: {current['wind_speed']} m/s")
        
        # Test weather forecast
        print("\nTesting 5-day forecast for Paris:")
        start_date = datetime.now()
        end_date = start_date + timedelta(days=5)
        # forecast = await weather_service.get_weather_forecast("Paris", start_date, end_date)
        
        # for day in forecast[:5]:  # Show first 5 entries
        #     print(f"\nDate: {day['date']} {day['time']}")
        #     print(f"Temperature: {day['temperature']}°C")
        #     print(f"Description: {day['description']}")
        #     print(f"Humidity: {day['humidity']}%")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_weather())
