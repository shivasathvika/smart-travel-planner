# Smart Travel Planner

A comprehensive web application for planning and managing your travels, featuring weather integration, email notifications, and personalized travel plans.

## Features

- User authentication and profile management
- Detailed travel planning with date and budget tracking
- Weather forecast integration
- Activity planning and management
- Email notifications for trip updates
- User preferences and customization
- Responsive design for all devices

## Tech Stack

### Backend
- Python 3.12
- FastAPI framework
- SQLAlchemy ORM
- SQLite Database
- JWT Authentication
- FastAPI-Mail for notifications

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Responsive design

## Project Structure

```
backend/
├── models/          # Database models
├── schemas/         # Pydantic schemas
├── routers/         # API endpoints
├── services/        # Business logic
├── utils/           # Utilities
├── crud/           # Database operations
└── main.py         # Application entry point
```

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration:
  ```
  DATABASE_URL=sqlite:///./travel_planner.db
  SECRET_KEY=your-secret-key
  MAIL_USERNAME=your-email@gmail.com
  MAIL_PASSWORD=your-app-password
  MAIL_FROM=noreply@travelplanner.com
  MAIL_SERVER=smtp.gmail.com
  ```

5. Start the development server:
```bash
uvicorn backend.main:app --reload
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key Endpoints

- `/api/auth/`: Authentication endpoints
- `/api/users/`: User management
- `/api/travel-plans/`: Travel plan operations
- `/api/weather/`: Weather data

## Features in Detail

### Travel Planning
- Create and manage travel plans
- Add activities to plans
- Get weather forecasts
- Budget tracking

### Email Notifications
- Welcome emails
- Trip confirmation
- Trip reminders
- Update notifications

### Weather Integration
- Current weather data
- Weather forecasts
- Weather-based activity suggestions

## Development

### Running Tests
```bash
pytest backend/tests/
```

### Code Style
```bash
flake8 backend/
black backend/
```

## Deployment

1. Update `SECRET_KEY` in production
2. Set up proper database (PostgreSQL recommended)
3. Configure email service
4. Set up SSL/TLS
5. Configure logging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by OpenWeatherMap API
- Email service using FastAPI-Mail
- FastAPI framework
