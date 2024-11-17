import requests
import os
from datetime import datetime, timedelta
from typing import List, Dict
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1"

class WeatherService:
    @staticmethod
    def get_forecast(destination: str, start_date: datetime, end_date: datetime) -> List[Dict]:
        """Get weather forecast for a destination between start and end dates"""
        try:
            # Get coordinates for the destination
            location_url = f"{WEATHER_API_BASE_URL}/search.json"
            location_params = {
                "key": WEATHER_API_KEY,
                "q": destination
            }
            location_response = requests.get(location_url, params=location_params)
            location_data = location_response.json()

            if not location_data:
                raise HTTPException(status_code=404, detail="Location not found")

            # Get the first location match
            location = location_data[0]
            lat, lon = location["lat"], location["lon"]

            # Get forecast data
            forecast_url = f"{WEATHER_API_BASE_URL}/forecast.json"
            forecast_params = {
                "key": WEATHER_API_KEY,
                "q": f"{lat},{lon}",
                "days": (end_date - start_date).days + 1
            }
            forecast_response = requests.get(forecast_url, params=forecast_params)
            forecast_data = forecast_response.json()

            # Process and format the forecast data
            daily_forecasts = []
            for day in forecast_data["forecast"]["forecastday"]:
                daily_forecasts.append({
                    "date": day["date"],
                    "max_temp_c": day["day"]["maxtemp_c"],
                    "min_temp_c": day["day"]["mintemp_c"],
                    "max_temp_f": day["day"]["maxtemp_f"],
                    "min_temp_f": day["day"]["mintemp_f"],
                    "condition": day["day"]["condition"]["text"],
                    "icon": day["day"]["condition"]["icon"],
                    "chance_of_rain": day["day"]["daily_chance_of_rain"],
                    "chance_of_snow": day["day"]["daily_chance_of_snow"],
                    "sunrise": day["astro"]["sunrise"],
                    "sunset": day["astro"]["sunset"],
                    "hourly": [{
                        "time": hour["time"],
                        "temp_c": hour["temp_c"],
                        "temp_f": hour["temp_f"],
                        "condition": hour["condition"]["text"],
                        "icon": hour["condition"]["icon"],
                        "chance_of_rain": hour["chance_of_rain"],
                        "wind_kph": hour["wind_kph"],
                        "wind_dir": hour["wind_dir"]
                    } for hour in day["hour"]]
                })

            return {
                "location": {
                    "name": location["name"],
                    "region": location["region"],
                    "country": location["country"],
                    "lat": lat,
                    "lon": lon,
                    "timezone": forecast_data["location"]["tz_id"]
                },
                "forecast": daily_forecasts
            }

        except requests.RequestException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch weather data: {str(e)}"
            )

    @staticmethod
    def get_current_weather(destination: str) -> Dict:
        """Get current weather for a destination"""
        try:
            current_url = f"{WEATHER_API_BASE_URL}/current.json"
            params = {
                "key": WEATHER_API_KEY,
                "q": destination
            }
            response = requests.get(current_url, params=params)
            data = response.json()

            return {
                "location": {
                    "name": data["location"]["name"],
                    "region": data["location"]["region"],
                    "country": data["location"]["country"],
                    "lat": data["location"]["lat"],
                    "lon": data["location"]["lon"],
                    "timezone": data["location"]["tz_id"],
                    "localtime": data["location"]["localtime"]
                },
                "current": {
                    "temp_c": data["current"]["temp_c"],
                    "temp_f": data["current"]["temp_f"],
                    "condition": data["current"]["condition"]["text"],
                    "icon": data["current"]["condition"]["icon"],
                    "wind_kph": data["current"]["wind_kph"],
                    "wind_dir": data["current"]["wind_dir"],
                    "humidity": data["current"]["humidity"],
                    "feels_like_c": data["current"]["feelslike_c"],
                    "feels_like_f": data["current"]["feelslike_f"],
                    "uv": data["current"]["uv"]
                }
            }

        except requests.RequestException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch current weather: {str(e)}"
            )

    @staticmethod
    def get_weather_alerts(destination: str) -> List[Dict]:
        """Get weather alerts for a destination"""
        try:
            alerts_url = f"{WEATHER_API_BASE_URL}/forecast.json"
            params = {
                "key": WEATHER_API_KEY,
                "q": destination,
                "alerts": "yes"
            }
            response = requests.get(alerts_url, params=params)
            data = response.json()

            if "alerts" in data and "alert" in data["alerts"]:
                return [{
                    "headline": alert.get("headline"),
                    "severity": alert.get("severity"),
                    "urgency": alert.get("urgency"),
                    "areas": alert.get("areas"),
                    "category": alert.get("category"),
                    "certainty": alert.get("certainty"),
                    "event": alert.get("event"),
                    "note": alert.get("note"),
                    "effective": alert.get("effective"),
                    "expires": alert.get("expires"),
                    "desc": alert.get("desc")
                } for alert in data["alerts"]["alert"]]
            
            return []

        except requests.RequestException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch weather alerts: {str(e)}"
            )

    @staticmethod
    def get_packing_suggestions(forecast_data: Dict) -> Dict:
        """Generate packing suggestions based on weather forecast"""
        suggestions = {
            "essential": [
                "Passport/ID",
                "Travel documents",
                "Phone and charger",
                "Money/cards"
            ],
            "clothing": [],
            "accessories": []
        }

        # Analyze temperature ranges
        max_temp = max(day["max_temp_c"] for day in forecast_data["forecast"])
        min_temp = min(day["min_temp_c"] for day in forecast_data["forecast"])
        
        # Check for rain probability
        rain_likely = any(day["chance_of_rain"] > 30 for day in forecast_data["forecast"])
        
        # Check for snow probability
        snow_likely = any(day["chance_of_snow"] > 30 for day in forecast_data["forecast"])

        # Temperature-based clothing suggestions
        if max_temp > 25:  # Hot weather
            suggestions["clothing"].extend([
                "Light, breathable clothing",
                "Short-sleeve shirts",
                "Shorts",
                "Light dresses",
                "Swimwear"
            ])
            suggestions["accessories"].extend([
                "Sunscreen",
                "Sunglasses",
                "Sun hat",
                "Water bottle"
            ])
        elif min_temp < 10:  # Cold weather
            suggestions["clothing"].extend([
                "Warm jacket",
                "Sweaters",
                "Long pants",
                "Thermal underwear",
                "Warm socks"
            ])
            suggestions["accessories"].extend([
                "Gloves",
                "Scarf",
                "Winter hat"
            ])
        else:  # Moderate weather
            suggestions["clothing"].extend([
                "Light jacket",
                "Long-sleeve shirts",
                "Pants",
                "Light sweaters"
            ])

        # Rain gear
        if rain_likely:
            suggestions["accessories"].extend([
                "Rain jacket",
                "Umbrella",
                "Waterproof shoes"
            ])

        # Snow gear
        if snow_likely:
            suggestions["clothing"].extend([
                "Snow boots",
                "Waterproof winter jacket",
                "Thick socks"
            ])

        return suggestions
