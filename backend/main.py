from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import logging
import time
import uuid
from datetime import datetime
from typing import Dict, Any

from backend.config import Settings, get_settings
from backend.database import init_db, Base
from backend.schemas.user import UserCreate, User
from backend.schemas.token import Token
from backend.middleware.request_id import request_id_middleware
from backend.middleware.rate_limiter import rate_limit_middleware
from backend.middleware.security import csrf_middleware, security_headers_middleware, request_validation_middleware
from backend.middleware.cache import cache_middleware, performance_monitoring_middleware
from backend.routers import (
    auth_router,
    users_router,
    weather_router,
    places_router,
    travel_plans_router,
    booking_router,
    recommendation_router
)
from backend.services.email_service import EmailService
from backend.services.weather_service import WeatherService
from backend.exceptions import BaseAPIException, ValidationError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Smart Travel Planner API",
    description="A comprehensive travel planning application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

# Add custom middleware
app.middleware("http")(request_id_middleware)
app.middleware("http")(rate_limit_middleware)
app.middleware("http")(csrf_middleware)
app.middleware("http")(security_headers_middleware)
app.middleware("http")(request_validation_middleware)
app.middleware("http")(cache_middleware)
app.middleware("http")(performance_monitoring_middleware)

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    try:
        # Initialize database
        init_db()
        logger.info("Database initialized successfully")

        # Initialize services
        weather_service = WeatherService()
        email_service = EmailService()
        logger.info("Services initialized successfully")

    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    try:
        logger.info("Application shutting down")
        # Add cleanup code here
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")

# Exception handlers
@app.exception_handler(BaseAPIException)
async def api_exception_handler(request: Request, exc: BaseAPIException):
    logger.error(f"API Exception: {str(exc)}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    logger.error(f"Validation Error: {str(exc)}")
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Root endpoint
@app.get("/")
async def root(settings: Settings = Depends(get_settings)):
    return {
        "message": "Welcome to Smart Travel Planner API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(weather_router, prefix="/api/v1")
app.include_router(places_router, prefix="/api/v1")
app.include_router(travel_plans_router, prefix="/api/v1")
app.include_router(booking_router, prefix="/api/v1")
app.include_router(recommendation_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=4,
        log_level="info"
    )
