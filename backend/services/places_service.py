import httpx
from fastapi import HTTPException
import os
from typing import Dict, List, Optional
from pydantic import BaseModel
import asyncio
from httpx import Timeout
import random

class PlaceDetails(BaseModel):
    place_id: str
    name: str
    formatted_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: Optional[str] = None
    type: Optional[str] = None
    importance: Optional[float] = None
    display_name: Optional[str] = None

class PlacesService:
    def __init__(self):
        self.base_url = "https://nominatim.openstreetmap.org"
        self.timeout = Timeout(30.0, connect=10.0)
        self.client_params = {
            "timeout": self.timeout,
            "verify": True,
            "follow_redirects": True,
            "headers": {
                "User-Agent": "TravelPlannerApp/1.0"  # Required by Nominatim
            }
        }
        
    async def search_places(self, query: str, location: Optional[str] = None, type: Optional[str] = None) -> List[PlaceDetails]:
        """
        Search for places using text query and optional location/type.
        """
        try:
            params = {
                "q": query,
                "format": "json",
                "limit": 5,  # Limit results
                "addressdetails": 1,
                "extratags": 1
            }
            
            if location:
                # Add location bias to search
                location_data = await self._geocode_location(location)
                if location_data:
                    params["viewbox"] = f"{location_data['lon']-0.1},{location_data['lat']-0.1},{location_data['lon']+0.1},{location_data['lat']+0.1}"
                    params["bounded"] = 1
            
            if type:
                params["amenity"] = type
            
            async with httpx.AsyncClient(**self.client_params) as client:
                response = await client.get(
                    f"{self.base_url}/search",
                    params=params
                )
                response.raise_for_status()
                data = response.json()
                
                places = []
                for place in data:
                    places.append(PlaceDetails(
                        place_id=str(place.get("place_id", "")),  
                        name=place.get("name", place.get("display_name", "Unknown")),
                        formatted_address=place.get("display_name", ""),
                        latitude=float(place.get("lat", 0)),
                        longitude=float(place.get("lon", 0)),
                        category=place.get("category", ""),
                        type=place.get("type", ""),
                        importance=float(place.get("importance", 0)),
                        display_name=place.get("display_name", "")
                    ))
                    
                # Add delay to respect rate limits
                await asyncio.sleep(1)
                return places
                
        except httpx.TimeoutException:
            raise ValueError("Connection timeout while searching places")
        except httpx.RequestError as e:
            raise ValueError(f"Network error while searching places: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error searching places: {str(e)}")
            
    async def get_place_details(self, place_id: str) -> PlaceDetails:
        """Get detailed information about a specific place."""
        try:
            async with httpx.AsyncClient(**self.client_params) as client:
                response = await client.get(
                    f"{self.base_url}/details",
                    params={
                        "place_id": place_id,
                        "format": "json"
                    }
                )
                response.raise_for_status()
                place = response.json()
                
                # Add delay to respect rate limits
                await asyncio.sleep(1)
                
                return PlaceDetails(
                    place_id=str(place_id),  
                    name=place.get("name", place.get("display_name", "Unknown")),
                    formatted_address=place.get("display_name", ""),
                    latitude=float(place.get("lat", 0)),
                    longitude=float(place.get("lon", 0)),
                    category=place.get("category", ""),
                    type=place.get("type", ""),
                    importance=float(place.get("importance", 0)),
                    display_name=place.get("display_name", "")
                )
                
        except httpx.TimeoutException:
            raise ValueError("Connection timeout while getting place details")
        except httpx.RequestError as e:
            raise ValueError(f"Network error while getting place details: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error getting place details: {str(e)}")
            
    async def _geocode_location(self, location: str) -> Optional[Dict[str, float]]:
        """Convert location string to coordinates."""
        try:
            async with httpx.AsyncClient(**self.client_params) as client:
                response = await client.get(
                    f"{self.base_url}/search",
                    params={
                        "q": location,
                        "format": "json",
                        "limit": 1
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                if data:
                    return {
                        "lat": float(data[0]["lat"]),
                        "lon": float(data[0]["lon"])
                    }
                return None
                
        except (httpx.TimeoutException, httpx.RequestError):
            return None

    async def get_nearby_places(self, location: str, type: str, radius: int = 5000) -> List[PlaceDetails]:
        """
        Find places near a location by type.
        radius in meters (default 5km)
        """
        try:
            coords = await self._geocode_location(location)
            if not coords:
                raise ValueError("Could not geocode location")
                
            # Convert radius from meters to degrees (approximate)
            radius_deg = radius / 111000  # 1 degree ≈ 111km
                
            params = {
                "format": "json",
                "limit": 5,
                "amenity": type,
                "viewbox": f"{coords['lon']-radius_deg},{coords['lat']-radius_deg},{coords['lon']+radius_deg},{coords['lat']+radius_deg}",
                "bounded": 1
            }
            
            async with httpx.AsyncClient(**self.client_params) as client:
                response = await client.get(
                    f"{self.base_url}/search",
                    params=params
                )
                response.raise_for_status()
                data = response.json()
                
                places = []
                for place in data:
                    places.append(PlaceDetails(
                        place_id=str(place.get("place_id", "")),  
                        name=place.get("name", place.get("display_name", "Unknown")),
                        formatted_address=place.get("display_name", ""),
                        latitude=float(place.get("lat", 0)),
                        longitude=float(place.get("lon", 0)),
                        category=place.get("category", ""),
                        type=place.get("type", ""),
                        importance=float(place.get("importance", 0)),
                        display_name=place.get("display_name", "")
                    ))
                    
                # Add delay to respect rate limits
                await asyncio.sleep(1)
                return places
                
        except httpx.TimeoutException:
            raise ValueError("Connection timeout while searching nearby places")
        except httpx.RequestError as e:
            raise ValueError(f"Network error while searching nearby places: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error searching nearby places: {str(e)}")

# Create singleton instance
places_service = PlacesService()
