from typing import List, Dict, Optional
import httpx
import asyncio
from backend.schemas.places import PlaceDetails

class PlacesService:
    def __init__(self):
        self.base_url = "https://maps.googleapis.com/maps/api"
        self.api_key = os.environ.get("GOOGLE_MAPS_API_KEY")  # Get API key from environment variable
        self.client_params = {
            "timeout": 10.0,
            "headers": {
                "User-Agent": "Smart Travel Planner/1.0"
            }
        }

    async def search_places(self, query: str, location: Optional[str] = None) -> List[PlaceDetails]:
        """
        Search for places using Geocoding API.
        """
        try:
            params = {
                "address": query,
                "key": self.api_key
            }
            
            if location:
                # Add location bias to search
                location_data = await self._geocode_location(location)
                if location_data:
                    params["location"] = f"{location_data['lat']},{location_data['lon']}"
                    params["radius"] = "5000"
            
            async with httpx.AsyncClient(**self.client_params) as client:
                response = await client.get(
                    f"{self.base_url}/geocode/json",
                    params=params
                )
                response.raise_for_status()
                data = response.json()
                
                places = []
                for result in data.get("results", []):
                    places.append(PlaceDetails(
                        place_id=result.get("place_id", ""),
                        name=result.get("formatted_address", "Unknown"),
                        formatted_address=result.get("formatted_address", ""),
                        latitude=result["geometry"]["location"]["lat"],
                        longitude=result["geometry"]["location"]["lng"],
                        category="location",
                        type="address",
                        importance=0,
                        display_name=result.get("formatted_address", "")
                    ))
                    
                await asyncio.sleep(1)  # Rate limiting
                return places
                
        except httpx.TimeoutException:
            raise ValueError("Connection timeout while searching places")
        except httpx.RequestError as e:
            raise ValueError(f"Network error while searching places: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error searching places: {str(e)}")

    async def _geocode_location(self, location: str) -> Optional[Dict[str, float]]:
        """Convert location string to coordinates using Geocoding API."""
        try:
            async with httpx.AsyncClient(**self.client_params) as client:
                response = await client.get(
                    f"{self.base_url}/geocode/json",
                    params={
                        "address": location,
                        "key": self.api_key
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                if data.get("results"):
                    location = data["results"][0]["geometry"]["location"]
                    return {
                        "lat": location["lat"],
                        "lon": location["lng"]
                    }
                return None
                
        except (httpx.TimeoutException, httpx.RequestError):
            return None

    async def get_nearby_places(self, location: str, radius: int = 5000) -> List[PlaceDetails]:
        """
        Find places near a location using Maps API.
        radius in meters (default 5km)
        """
        try:
            coords = await self._geocode_location(location)
            if not coords:
                raise ValueError("Could not geocode location")
                
            params = {
                "location": f"{coords['lat']},{coords['lon']}",
                "radius": str(radius),
                "key": self.api_key
            }
            
            async with httpx.AsyncClient(**self.client_params) as client:
                response = await client.get(
                    f"{self.base_url}/maps/api/place/nearbysearch/json",
                    params=params
                )
                response.raise_for_status()
                data = response.json()
                
                places = []
                for result in data.get("results", []):
                    places.append(PlaceDetails(
                        place_id=result.get("place_id", ""),
                        name=result.get("name", "Unknown"),
                        formatted_address=result.get("vicinity", ""),
                        latitude=result["geometry"]["location"]["lat"],
                        longitude=result["geometry"]["location"]["lng"],
                        category=result.get("types", [""])[0],
                        type="location",
                        importance=0,
                        display_name=result.get("name", "")
                    ))
                    
                await asyncio.sleep(1)  # Rate limiting
                return places
                
        except httpx.TimeoutException:
            raise ValueError("Connection timeout while searching nearby places")
        except httpx.RequestError as e:
            raise ValueError(f"Network error while searching nearby places: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error searching nearby places: {str(e)}")

places_service = PlacesService()
