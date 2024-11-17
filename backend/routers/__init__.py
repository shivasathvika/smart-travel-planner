from .auth import router as auth_router
from .users import router as users_router
from .weather import router as weather_router
from .places import router as places_router
from .travel_plans import router as travel_plans_router

__all__ = ['auth_router', 'users_router', 'weather_router', 'places_router', 'travel_plans_router']
