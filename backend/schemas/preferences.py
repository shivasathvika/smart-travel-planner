from pydantic import BaseModel

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
        from_attributes = True

class FavoriteBase(BaseModel):
    place_id: str
    place_name: str

class FavoriteCreate(FavoriteBase):
    pass

class Favorite(FavoriteBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
