from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class TravelPreferences(BaseModel):
    budget_level: str = Field(..., description="budget, moderate, luxury")
    pace: str = Field(..., description="relaxed, moderate, intense")
    interests: List[str] = Field(default_factory=list, description="e.g., history, food, nature")
    accessibility_needs: Optional[List[str]] = None
    preferred_transportation: List[str] = Field(default_factory=list)
    meal_preferences: List[str] = Field(default_factory=list)
    accommodation_type: List[str] = Field(default_factory=list)

class ActivityBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: str
    date: datetime
    cost: float = 0.0
    category: str

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int
    travel_plan_id: int

    class Config:
        from_attributes = True

class WeatherDataBase(BaseModel):
    date: datetime
    temperature: float
    conditions: str
    precipitation: float
    wind_speed: float

class WeatherDataCreate(WeatherDataBase):
    pass

class WeatherData(WeatherDataBase):
    id: int
    travel_plan_id: int

    class Config:
        from_attributes = True

class UserPreferenceBase(BaseModel):
    preferred_currency: str = "USD"
    preferred_language: str = "en"
    notification_enabled: bool = True
    theme: str = "light"

class UserPreferenceCreate(UserPreferenceBase):
    pass

class UserPreference(UserPreferenceBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class TravelPlanBase(BaseModel):
    destination: str
    start_date: datetime
    end_date: datetime
    budget: float = 0.0
    trip_style: str
    interests: List[str] = Field(default_factory=list)
    notes: Optional[str] = None

class TravelPlanCreate(TravelPlanBase):
    pass

class TravelPlanUpdate(BaseModel):
    destination: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    trip_style: Optional[str] = None
    interests: Optional[List[str]] = None
    notes: Optional[str] = None

class TravelPlan(TravelPlanBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    activities: List[Activity] = []
    weather_data: List[WeatherData] = []

    class Config:
        from_attributes = True

class TravelPlanList(BaseModel):
    id: int
    destination: str
    start_date: datetime
    end_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True
