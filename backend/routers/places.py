from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.places_service import places_service, PlaceDetails
import auth
from database import get_db
import models
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/api/places",
    tags=["places"]
)

class PlaceSearchRequest(BaseModel):
    query: str
    location: Optional[str] = None
    type: Optional[str] = None

@router.post("/search", response_model=List[PlaceDetails])
async def search_places(
    request: PlaceSearchRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Search for places using text query and optional location/type.
    Example types: restaurant, tourist_attraction, museum, hotel
    """
    return await places_service.search_places(
        query=request.query,
        location=request.location,
        type=request.type
    )

@router.get("/details/{place_id}", response_model=PlaceDetails)
async def get_place_details(
    place_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get detailed information about a specific place."""
    return await places_service.get_place_details(place_id)

@router.get("/nearby", response_model=List[PlaceDetails])
async def get_nearby_places(
    location: str,
    type: str = Query(..., description="Place type (e.g., restaurant, tourist_attraction)"),
    radius: int = Query(5000, description="Search radius in meters", ge=1, le=50000),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Find places near a location by type.
    Example types: restaurant, tourist_attraction, museum, hotel
    """
    return await places_service.get_nearby_places(
        location=location,
        type=type,
        radius=radius
    )
