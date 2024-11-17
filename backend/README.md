# Smart Travel Planner Backend

This is the backend API for the Smart Travel Planner application, built with FastAPI and SQLAlchemy.

## Features

- User authentication with JWT tokens
- Travel plan management
- Activity tracking
- User preferences
- Weather integration
- Places/attractions integration

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration

4. Run the application:
```bash
uvicorn main:app --reload
```

## API Documentation

Once the application is running, you can access:
- Interactive API documentation: http://localhost:8000/docs
- Alternative API documentation: http://localhost:8000/redoc

## API Endpoints

### Authentication
- POST `/token` - Get access token
- POST `/users/` - Create new user
- GET `/users/me` - Get current user

### Travel Plans
- POST `/travel-plans/` - Create travel plan
- GET `/travel-plans/` - List user's travel plans
- GET `/travel-plans/{travel_plan_id}` - Get specific travel plan
- PUT `/travel-plans/{travel_plan_id}` - Update travel plan
- DELETE `/travel-plans/{travel_plan_id}` - Delete travel plan

### Activities
- POST `/activities/` - Create activity
- GET `/activities/{travel_plan_id}` - List activities for a travel plan

### User Preferences
- POST `/preferences/` - Create user preferences
- GET `/preferences/` - Get user preferences
- PUT `/preferences/` - Update user preferences

## Database Models

- User
- TravelPlan
- Activity
- WeatherData
- UserPreference

## Security

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Input validation with Pydantic

## Development

- Python 3.8+
- FastAPI
- SQLAlchemy
- Pydantic
- JWT authentication
- SQLite database (can be changed to PostgreSQL)
