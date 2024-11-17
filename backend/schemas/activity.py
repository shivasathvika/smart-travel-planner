from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityBase(BaseModel):
    name: str
    description: Optional[str] = None
    date: datetime
    location: str
    cost: float
    category: str

class ActivityCreate(ActivityBase):
    travel_plan_id: int

class Activity(ActivityBase):
    id: int
    travel_plan_id: int

    class Config:
        from_attributes = True
