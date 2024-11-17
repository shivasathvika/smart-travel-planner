import unittest
from fastapi.testclient import TestClient
import sys
import os
from datetime import datetime, timedelta
import jwt

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from backend.auth import create_access_token
from backend.database import get_db, Base, engine
from backend.models import User

class TestUserManagement(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        # Create test database tables
        Base.metadata.create_all(bind=engine)
        self.test_user_data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User"
        }
        
    def tearDown(self):
        # Drop test database tables
        Base.metadata.drop_all(bind=engine)
        
    def test_user_registration(self):
        response = self.client.post("/api/auth/register", json=self.test_user_data)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["email"], self.test_user_data["email"])
        self.assertEqual(data["full_name"], self.test_user_data["full_name"])
        
    def test_user_login(self):
        # First register a user
        self.client.post("/api/auth/register", json=self.test_user_data)
        
        # Then try to login
        login_data = {
            "email": self.test_user_data["email"],
            "password": self.test_user_data["password"]
        }
        response = self.client.post("/api/auth/login", json=login_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        
    def test_get_profile(self):
        # Register and login
        self.client.post("/api/auth/register", json=self.test_user_data)
        login_response = self.client.post("/api/auth/login", 
            json={
                "email": self.test_user_data["email"],
                "password": self.test_user_data["password"]
            })
        token = login_response.json()["access_token"]
        
        # Get profile
        response = self.client.get("/api/profile", 
            headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], self.test_user_data["email"])
        
    def test_update_profile(self):
        # Register and login
        self.client.post("/api/auth/register", json=self.test_user_data)
        login_response = self.client.post("/api/auth/login", 
            json={
                "email": self.test_user_data["email"],
                "password": self.test_user_data["password"]
            })
        token = login_response.json()["access_token"]
        
        # Update profile
        update_data = {
            "full_name": "Updated Name",
            "phone_number": "1234567890",
            "bio": "Test bio"
        }
        response = self.client.put("/api/profile",
            headers={"Authorization": f"Bearer {token}"},
            json=update_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["full_name"], update_data["full_name"])
        self.assertEqual(data["phone_number"], update_data["phone_number"])
        
    def test_add_favorite(self):
        # Register and login
        self.client.post("/api/auth/register", json=self.test_user_data)
        login_response = self.client.post("/api/auth/login", 
            json={
                "email": self.test_user_data["email"],
                "password": self.test_user_data["password"]
            })
        token = login_response.json()["access_token"]
        
        # Add favorite
        favorite_data = {
            "place_id": "test_place_123",
            "place_name": "Test Place"
        }
        response = self.client.post("/api/favorites",
            headers={"Authorization": f"Bearer {token}"},
            json=favorite_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["place_name"], favorite_data["place_name"])
        
    def test_get_trip_history(self):
        # Register and login
        self.client.post("/api/auth/register", json=self.test_user_data)
        login_response = self.client.post("/api/auth/login", 
            json={
                "email": self.test_user_data["email"],
                "password": self.test_user_data["password"]
            })
        token = login_response.json()["access_token"]
        
        # Get trip history (should be empty initially)
        response = self.client.get("/api/trips",
            headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 0)
        
    def test_invalid_token(self):
        response = self.client.get("/api/profile",
            headers={"Authorization": "Bearer invalid_token"})
        self.assertEqual(response.status_code, 401)

if __name__ == '__main__':
    unittest.main()
