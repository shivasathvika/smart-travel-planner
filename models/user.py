from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String, nullable=True)  # Made nullable for testing
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Profile fields
    profile_picture = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    preferred_currency = Column(String, default="USD")
    preferred_language = Column(String, default="en")

    # Relationships
    trips = relationship("Trip", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'is_active': self.is_active,
            'profile_picture': self.profile_picture,
            'phone_number': self.phone_number,
            'bio': self.bio,
            'preferred_currency': self.preferred_currency,
            'preferred_language': self.preferred_language,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    destination = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    weather_checked_at = Column(DateTime, nullable=True)
    weather_alerts = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="trips")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'destination': self.destination,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'weather_checked_at': self.weather_checked_at.isoformat() if self.weather_checked_at else None,
            'weather_alerts': self.weather_alerts
        }

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    destination = Column(String)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    weather_checked_at = Column(DateTime, nullable=True)
    weather_alerts = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="favorites")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'destination': self.destination,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'weather_checked_at': self.weather_checked_at.isoformat() if self.weather_checked_at else None,
            'weather_alerts': self.weather_alerts
        }
