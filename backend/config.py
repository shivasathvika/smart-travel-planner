from functools import lru_cache
from typing import List, Optional, Set
from pydantic import BaseModel, Field, ConfigDict, field_validator, validator, ValidationInfo
from pydantic_settings import BaseSettings
import os
from pathlib import Path
import secrets
import json

class Settings(BaseSettings):
    """Application settings."""
    
    class Config:
        env_file = Path(__file__).parent.parent / ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"
        env_nested_delimiter = "__"
    
    # Application settings
    PROJECT_NAME: str = "Smart Travel Planner"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = Field(default=True, description="Debug mode")
    
    # Feature flags
    ENABLE_OPENAI: bool = Field(default=True, description="Enable OpenAI features")
    ENABLE_MAPS: bool = Field(default=True, description="Enable Google Maps features")
    ENABLE_CALENDAR: bool = Field(default=True, description="Enable Google Calendar features")
    ENABLE_GEOCODING: bool = Field(default=True, description="Enable Google Geocoding features")
    ENABLE_WEATHER: bool = Field(default=True, description="Enable weather features")
    ENABLE_AMADEUS: bool = Field(default=True, description="Enable Amadeus travel features")
    ENABLE_NOTIFICATIONS: bool = Field(default=True, description="Enable email notifications")
    
    # Security settings
    SECRET_KEY: str = Field(
        default=secrets.token_urlsafe(32),
        description="Secret key for JWT encoding"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # Database settings
    DATABASE_URL: str = Field(
        default="sqlite:///./travel_planner.db",
        description="Database connection string"
    )
    
    # Redis settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = ""
    REDIS_DB: int = 0
    
    # Email settings
    MAIL_USERNAME: str = Field(default="", description="SMTP username")
    MAIL_PASSWORD: str = Field(default="", description="SMTP password")
    MAIL_FROM: str = Field(default="", description="From email address")
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_TLS: bool = True
    MAIL_SSL: bool = False
    
    # API Keys
    GOOGLE_API_KEY: str = Field(default="", description="Google API key")
    OPENAI_API_KEY: str = Field(default="", description="OpenAI API key")
    OPENWEATHER_API_KEY: str = Field(default="", description="OpenWeather API key")
    WEATHER_API_KEY: str = Field(default="", description="WeatherAPI.com key")
    AMADEUS_CLIENT_ID: str = Field(default="", description="Amadeus API client ID")
    AMADEUS_CLIENT_SECRET: str = Field(default="", description="Amadeus API client secret")
    
    # Amadeus API settings
    AMADEUS_TEST_MODE: bool = Field(default=True, description="Use Amadeus test environment")
    
    # Service URLs
    OPENWEATHER_API_URL: str = "https://api.openweathermap.org/data/2.5"
    WEATHER_API_URL: str = "http://api.weatherapi.com/v1"
    AMADEUS_API_URL: str = "https://test.api.amadeus.com/v1"
    GOOGLE_MAPS_URL: str = "https://maps.googleapis.com/maps/api"
    GOOGLE_CALENDAR_URL: str = "https://www.googleapis.com/calendar/v3"
    
    @field_validator("SECRET_KEY")
    def validate_secret_key(cls, v: str, info: ValidationInfo) -> str:
        """Validate that secret key is set in production."""
        if not info.data.get("DEBUG", True):
            if not v or len(v) < 32:
                raise ValueError("SECRET_KEY must be at least 32 characters in production mode")
        return v
    
    @field_validator("OPENAI_API_KEY", "GOOGLE_API_KEY", "AMADEUS_CLIENT_ID", "AMADEUS_CLIENT_SECRET")
    def validate_required_api_keys(cls, v: str, info: ValidationInfo) -> str:
        """Validate that critical API keys are set."""
        if not v and info.data.get(f"ENABLE_{info.field_name.split('_')[0].upper()}", True):
            raise ValueError(f"{info.field_name} must be set when the corresponding feature is enabled")
        return v

# Create settings instance
settings = Settings(_env_file=Path(__file__).parent.parent / ".env")

# Get cached settings instance
@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings(_env_file=Path(__file__).parent.parent / ".env")
