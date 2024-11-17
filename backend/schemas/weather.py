from pydantic import BaseModel
from datetime import datetime

class WeatherDataBase(BaseModel):
    date: datetime
    temperature: float
    conditions: str
    precipitation: float
    wind_speed: float

class WeatherDataCreate(WeatherDataBase):
    travel_plan_id: int

class WeatherData(WeatherDataBase):
    id: int
    travel_plan_id: int

    class Config:
        from_attributes = True
