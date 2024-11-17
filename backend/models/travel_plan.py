from sqlalchemy import Column, ForeignKey, Integer, String, Float, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from . import Base

class TravelPlan(Base):
    __tablename__ = "travel_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    destination = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    budget = Column(Float)
    trip_style = Column(String)
    interests = Column(JSON)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="travel_plans")
    activities = relationship("Activity", back_populates="travel_plan")
    weather_data = relationship("WeatherData", back_populates="travel_plan")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    travel_plan_id = Column(Integer, ForeignKey("travel_plans.id"))
    name = Column(String)
    description = Column(String)
    date = Column(DateTime)
    location = Column(String)
    cost = Column(Float)
    category = Column(String)

    # Relationships
    travel_plan = relationship("TravelPlan", back_populates="activities")


class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True)
    travel_plan_id = Column(Integer, ForeignKey("travel_plans.id"))
    date = Column(DateTime)
    temperature = Column(Float)
    conditions = Column(String)
    precipitation = Column(Float)
    wind_speed = Column(Float)

    # Relationships
    travel_plan = relationship("TravelPlan", back_populates="weather_data")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    preferred_currency = Column(String, default="USD")
    preferred_language = Column(String, default="en")
    notification_enabled = Column(Boolean, default=True)
    theme = Column(String, default="light")

    # Relationships
    user = relationship("User", back_populates="preferences")
