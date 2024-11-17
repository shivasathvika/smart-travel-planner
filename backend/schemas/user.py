from pydantic import BaseModel, EmailStr, constr
from typing import Optional
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

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

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
        from_attributes = True
