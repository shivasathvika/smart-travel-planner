from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from backend.models.travel_plan import TravelPlan, Activity, WeatherData
from backend.schemas.travel_plan import TravelPlanCreate, TravelPlanUpdate, ActivityCreate, WeatherDataCreate

def get_travel_plan(db: Session, plan_id: int, user_id: int) -> Optional[TravelPlan]:
    return db.query(TravelPlan).filter(
        TravelPlan.id == plan_id,
        TravelPlan.user_id == user_id
    ).first()

def get_user_travel_plans(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 10,
) -> List[TravelPlan]:
    return db.query(TravelPlan).filter(
        TravelPlan.user_id == user_id
    ).offset(skip).limit(limit).all()

def create_travel_plan(db: Session, plan: TravelPlanCreate, user_id: int) -> TravelPlan:
    db_plan = TravelPlan(
        **plan.model_dump(),
        user_id=user_id
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

def update_travel_plan(
    db: Session,
    plan_id: int,
    user_id: int,
    plan_update: TravelPlanUpdate
) -> TravelPlan:
    db_plan = get_travel_plan(db, plan_id, user_id)
    if not db_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Travel plan not found"
        )
    
    update_data = plan_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_plan, field, value)
    
    db.commit()
    db.refresh(db_plan)
    return db_plan

def delete_travel_plan(db: Session, plan_id: int, user_id: int) -> None:
    db_plan = get_travel_plan(db, plan_id, user_id)
    if not db_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Travel plan not found"
        )
    db.delete(db_plan)
    db.commit()

# Activity CRUD operations
def create_activity(db: Session, activity: ActivityCreate, plan_id: int) -> Activity:
    db_activity = Activity(**activity.model_dump(), travel_plan_id=plan_id)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def update_activity(db: Session, activity_id: int, activity_data: ActivityCreate) -> Activity:
    db_activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not db_activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    for field, value in activity_data.model_dump().items():
        setattr(db_activity, field, value)
    
    db.commit()
    db.refresh(db_activity)
    return db_activity

def delete_activity(db: Session, activity_id: int) -> None:
    db_activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not db_activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    db.delete(db_activity)
    db.commit()

# Weather data operations
def create_weather_data(db: Session, weather_data: WeatherDataCreate, plan_id: int) -> WeatherData:
    db_weather = WeatherData(**weather_data.model_dump(), travel_plan_id=plan_id)
    db.add(db_weather)
    db.commit()
    db.refresh(db_weather)
    return db_weather

def get_plan_weather_data(db: Session, plan_id: int) -> List[WeatherData]:
    return db.query(WeatherData).filter(WeatherData.travel_plan_id == plan_id).all()

# Search operations
def search_travel_plans(
    db: Session,
    user_id: int,
    search_term: str,
    skip: int = 0,
    limit: int = 10
) -> List[TravelPlan]:
    query = db.query(TravelPlan).filter(TravelPlan.user_id == user_id)
    
    if search_term:
        query = query.filter(
            TravelPlan.destination.ilike(f"%{search_term}%")
        )
    
    return query.offset(skip).limit(limit).all()
