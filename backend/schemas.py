from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class EmailSchema(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: constr(min_length=8)

class PasswordChange(BaseModel):
    current_password: str
    new_password: constr(min_length=8)

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: constr(min_length=8)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    preferred_currency: Optional[str] = None
    preferred_language: Optional[str] = None

class UserProfile(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    profile_picture: Optional[str]
    phone_number: Optional[str]
    bio: Optional[str]
    is_active: bool
    created_at: datetime
    preferred_currency: str = "USD"
    preferred_language: str = "en"

    class Config:
        orm_mode = True

class TravelPlanBase(BaseModel):
    destination: str
    start_date: datetime
    end_date: datetime
    budget: float
    trip_style: str
    interests: List[str]
    notes: Optional[str] = None

class TravelPlanCreate(TravelPlanBase):
    pass

class TravelPlan(TravelPlanBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class TripBase(BaseModel):
    destination: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    notes: Optional[str]

class TripCreate(TripBase):
    pass

class Trip(TripBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

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
        orm_mode = True

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
        orm_mode = True

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
        orm_mode = True

class FavoriteBase(BaseModel):
    place_id: str
    place_name: str

class FavoriteCreate(FavoriteBase):
    pass

class Favorite(FavoriteBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
