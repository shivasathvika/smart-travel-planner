from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

from .user import User
from .travel_plan import TravelPlan, Activity, WeatherData, UserPreference

__all__ = [
    'Base',
    'User',
    'TravelPlan',
    'Activity',
    'WeatherData',
    'UserPreference'
]
