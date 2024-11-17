from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
from datetime import datetime

from ..database import get_db
from ..auth import get_current_active_user
from .. import models, schemas

router = APIRouter()

@router.get("/profile", response_model=schemas.UserProfile)
async def get_user_profile(current_user: models.User = Depends(get_current_active_user)):
    """Get the current user's profile"""
    return current_user

@router.put("/profile", response_model=schemas.UserProfile)
async def update_profile(
    profile_update: schemas.UserProfileUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    for field, value in profile_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/profile/picture", response_model=schemas.UserProfile)
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload a profile picture"""
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads/profile_pictures"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    new_filename = f"{current_user.id}_{datetime.now().timestamp()}{file_extension}"
    file_path = os.path.join(upload_dir, new_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Update user profile
    current_user.profile_picture = file_path
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/trips", response_model=List[schemas.Trip])
async def get_user_trips(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's trip history"""
    return db.query(models.Trip).filter(models.Trip.user_id == current_user.id).all()

@router.post("/trips", response_model=schemas.Trip)
async def create_trip(
    trip: schemas.TripCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new trip entry"""
    db_trip = models.Trip(**trip.dict(), user_id=current_user.id)
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@router.get("/favorites", response_model=List[schemas.Favorite])
async def get_favorites(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's favorite places"""
    return db.query(models.Favorite).filter(models.Favorite.user_id == current_user.id).all()

@router.post("/favorites", response_model=schemas.Favorite)
async def add_favorite(
    favorite: schemas.FavoriteCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a place to favorites"""
    db_favorite = models.Favorite(**favorite.dict(), user_id=current_user.id)
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite

@router.delete("/favorites/{favorite_id}")
async def remove_favorite(
    favorite_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove a place from favorites"""
    favorite = db.query(models.Favorite).filter(
        models.Favorite.id == favorite_id,
        models.Favorite.user_id == current_user.id
    ).first()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    
    db.delete(favorite)
    db.commit()
    return {"message": "Favorite removed successfully"}
