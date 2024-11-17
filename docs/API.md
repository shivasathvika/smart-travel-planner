# Travel Planner API Documentation

## Authentication

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe"
}
```
- **Response**: User object with token

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Response**: Access token

## User Profile Management

### Get Profile
- **URL**: `/api/profile`
- **Method**: `GET`
- **Headers**: Authorization: Bearer {token}
- **Response**: User profile object

### Update Profile
- **URL**: `/api/profile`
- **Method**: `PUT`
- **Headers**: Authorization: Bearer {token}
- **Body**:
```json
{
    "full_name": "John Doe",
    "phone_number": "1234567890",
    "bio": "Travel enthusiast",
    "preferred_currency": "USD",
    "preferred_language": "en"
}
```
- **Response**: Updated user profile

### Upload Profile Picture
- **URL**: `/api/profile/picture`
- **Method**: `POST`
- **Headers**: Authorization: Bearer {token}
- **Body**: Form data with file
- **Response**: Updated user profile with picture URL

## Trip Management

### Get Trip History
- **URL**: `/api/trips`
- **Method**: `GET`
- **Headers**: Authorization: Bearer {token}
- **Response**: Array of trip objects

### Create Trip
- **URL**: `/api/trips`
- **Method**: `POST`
- **Headers**: Authorization: Bearer {token}
- **Body**:
```json
{
    "destination": "Paris",
    "start_date": "2024-06-01T00:00:00Z",
    "end_date": "2024-06-07T00:00:00Z",
    "notes": "Summer vacation"
}
```
- **Response**: Created trip object

## Favorites Management

### Get Favorites
- **URL**: `/api/favorites`
- **Method**: `GET`
- **Headers**: Authorization: Bearer {token}
- **Response**: Array of favorite place objects

### Add Favorite
- **URL**: `/api/favorites`
- **Method**: `POST`
- **Headers**: Authorization: Bearer {token}
- **Body**:
```json
{
    "place_id": "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
    "place_name": "Eiffel Tower"
}
```
- **Response**: Created favorite object

### Remove Favorite
- **URL**: `/api/favorites/{favorite_id}`
- **Method**: `DELETE`
- **Headers**: Authorization: Bearer {token}
- **Response**: Success message

## Weather Integration

### Get Weather Forecast
- **URL**: `/api/weather/{destination}`
- **Method**: `GET`
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - start_date: ISO date string
  - end_date: ISO date string
- **Response**: Weather forecast data

## Trip Export

### Export to PDF
- **URL**: `/api/trips/{trip_id}/export/pdf`
- **Method**: `GET`
- **Headers**: Authorization: Bearer {token}
- **Response**: PDF file download

### Export to Calendar
- **URL**: `/api/trips/{trip_id}/export/calendar`
- **Method**: `GET`
- **Headers**: Authorization: Bearer {token}
- **Response**: ICS file download

## Error Responses

All endpoints may return the following error responses:

- **401 Unauthorized**: Invalid or missing authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Requested resource not found
- **422 Unprocessable Entity**: Invalid request data
- **500 Internal Server Error**: Server-side error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Data Models

### User Profile
```json
{
    "id": "integer",
    "email": "string",
    "full_name": "string",
    "profile_picture": "string (optional)",
    "phone_number": "string (optional)",
    "bio": "string (optional)",
    "preferred_currency": "string",
    "preferred_language": "string",
    "is_active": "boolean",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

### Trip
```json
{
    "id": "integer",
    "user_id": "integer",
    "destination": "string",
    "start_date": "datetime",
    "end_date": "datetime",
    "notes": "string (optional)",
    "created_at": "datetime"
}
```

### Favorite
```json
{
    "id": "integer",
    "user_id": "integer",
    "place_id": "string",
    "place_name": "string",
    "created_at": "datetime"
}
```
