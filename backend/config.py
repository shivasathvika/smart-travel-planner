from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./travel_planner.db")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/travel_planner")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-replace-this-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    
    # External APIs
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
    PLACES_API_KEY: str = os.getenv("PLACES_API_KEY", "")
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    WORKERS: int = int(os.getenv("WORKERS", "4"))
    RELOAD: bool = os.getenv("RELOAD", "false").lower() == "true"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080").split(",")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = os.getenv("LOG_FILE", "logs/app.log")
    
    # Email
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "")
    
    # Feature Flags
    ENABLE_WEATHER: bool = os.getenv("ENABLE_WEATHER", "true").lower() == "true"
    ENABLE_PLACES: bool = os.getenv("ENABLE_PLACES", "true").lower() == "true"
    ENABLE_NOTIFICATIONS: bool = os.getenv("ENABLE_NOTIFICATIONS", "false").lower() == "true"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
