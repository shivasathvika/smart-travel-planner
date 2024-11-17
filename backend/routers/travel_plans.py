from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from backend.database import get_db
from backend.schemas.travel_plan import (
    TravelPlan, TravelPlanCreate, TravelPlanUpdate, TravelPlanList,
    Activity, ActivityCreate,
    WeatherData, WeatherDataCreate
)
from backend.models.travel_plan import TravelPlan as TravelPlanModel
from backend.models.user import User
from backend.auth import get_current_user
from backend.crud import travel_plans
from backend.services.planner_service import TravelPlannerService
from backend.services.weather_service import WeatherService

router = APIRouter(
    prefix="/api/travel-plans",
    tags=["travel plans"]
)

@router.post("/", response_model=TravelPlan)
def create_travel_plan(
    plan: TravelPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new travel plan for the current user."""
    return travel_plans.create_travel_plan(db=db, plan=plan, user_id=current_user.id)

@router.get("/", response_model=List[TravelPlanList])
def get_user_travel_plans(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all travel plans for the current user with optional filtering."""
    return travel_plans.search_travel_plans(
        db=db,
        user_id=current_user.id,
        search_term=search,
        skip=skip,
        limit=limit
    )

@router.get("/{plan_id}", response_model=TravelPlan)
def get_travel_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific travel plan."""
    db_plan = travel_plans.get_travel_plan(db=db, plan_id=plan_id, user_id=current_user.id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="Travel plan not found")
    return db_plan

@router.put("/{plan_id}", response_model=TravelPlan)
def update_travel_plan(
    plan_id: int,
    plan_update: TravelPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a specific travel plan."""
    return travel_plans.update_travel_plan(
        db=db,
        plan_id=plan_id,
        user_id=current_user.id,
        plan_update=plan_update
    )

@router.delete("/{plan_id}")
def delete_travel_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a specific travel plan."""
    travel_plans.delete_travel_plan(db=db, plan_id=plan_id, user_id=current_user.id)
    return {"message": "Travel plan deleted successfully"}

# Activity endpoints
@router.post("/{plan_id}/activities", response_model=Activity)
def add_activity(
    plan_id: int,
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add an activity to a travel plan."""
    db_plan = travel_plans.get_travel_plan(db=db, plan_id=plan_id, user_id=current_user.id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="Travel plan not found")
    return travel_plans.create_activity(db=db, activity=activity, plan_id=plan_id)

@router.put("/{plan_id}/activities/{activity_id}", response_model=Activity)
def update_activity(
    plan_id: int,
    activity_id: int,
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an activity in a travel plan."""
    db_plan = travel_plans.get_travel_plan(db=db, plan_id=plan_id, user_id=current_user.id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="Travel plan not found")
    return travel_plans.update_activity(db=db, activity_id=activity_id, activity_data=activity)

@router.delete("/{plan_id}/activities/{activity_id}")
def delete_activity(
    plan_id: int,
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an activity from a travel plan."""
    db_plan = travel_plans.get_travel_plan(db=db, plan_id=plan_id, user_id=current_user.id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="Travel plan not found")
    travel_plans.delete_activity(db=db, activity_id=activity_id)
    return {"message": "Activity deleted successfully"}

# Weather data endpoints
@router.post("/{plan_id}/weather", response_model=WeatherData)
def add_weather_data(
    plan_id: int,
    weather_data: WeatherDataCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add weather data to a travel plan."""
    db_plan = travel_plans.get_travel_plan(db=db, plan_id=plan_id, user_id=current_user.id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="Travel plan not found")
    return travel_plans.create_weather_data(db=db, weather_data=weather_data, plan_id=plan_id)

@router.get("/{plan_id}/weather", response_model=List[WeatherData])
def get_weather_data(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get weather data for a travel plan."""
    db_plan = travel_plans.get_travel_plan(db=db, plan_id=plan_id, user_id=current_user.id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="Travel plan not found")
    return travel_plans.get_plan_weather_data(db=db, plan_id=plan_id)

@router.post("/{plan_id}/generate")
async def generate_travel_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate a detailed itinerary for an existing travel plan."""
    db_plan = travel_plans.get_travel_plan(db=db, plan_id=plan_id, user_id=current_user.id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="Travel plan not found")
    
    # Initialize services
    weather_service = WeatherService()
    planner_service = TravelPlannerService(db, weather_service)
    
    try:
        # Generate the plan
        await planner_service.generate_plan(db_plan)
        return {"message": "Travel plan generated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
