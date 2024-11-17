import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from datetime import datetime, timedelta
from dotenv import load_dotenv
from services.email_service import EmailService
from services.weather_service import WeatherService
from models import Trip, User, Base
from tests.test_config import engine, TestingSessionLocal

load_dotenv()

# Create test database tables
Base.metadata.create_all(bind=engine)

async def test_services():
    print("Testing Email and Weather Services...")
    
    # Get test database session
    db = TestingSessionLocal()
    
    try:
        # Test user data
        test_user = User(
            email=os.getenv("SMTP_USER"),  # Using the same email for testing
            full_name="Test User",
            is_active=True
        )
        
        # Add test user to database
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        # Test trip data
        test_trip = Trip(
            user_id=test_user.id,
            destination="London, UK",
            start_date=datetime.now() + timedelta(days=1),
            end_date=datetime.now() + timedelta(days=5),
            notes="Test trip to London"
        )
        
        # Add test trip to database
        db.add(test_trip)
        db.commit()
        db.refresh(test_trip)

        # 1. Test Weather Service
        print("\n1. Testing Weather Service...")
        
        # Test current weather
        print("\nFetching current weather for London...")
        current_weather = WeatherService.get_current_weather("London, UK")
        print(f"Current weather in {current_weather['location']['name']}:")
        print(f"Temperature: {current_weather['current']['temp_c']}°C")
        print(f"Condition: {current_weather['current']['condition']}")
        
        # Test weather forecast
        print("\nFetching weather forecast for the trip...")
        forecast = WeatherService.get_forecast(
            test_trip.destination,
            test_trip.start_date,
            test_trip.end_date
        )
        print(f"Forecast received for {len(forecast['forecast'])} days")
        
        # Test weather alerts
        print("\nChecking weather alerts...")
        alerts = WeatherService.get_weather_alerts(test_trip.destination)
        if alerts:
            print(f"Found {len(alerts)} weather alerts")
        else:
            print("No weather alerts found")
            
        # Test packing suggestions
        print("\nGenerating packing suggestions...")
        suggestions = WeatherService.get_packing_suggestions(forecast)
        print("Packing suggestions generated:")
        for category, items in suggestions.items():
            print(f"\n{category.title()}:")
            for item in items:
                print(f"- {item}")

        # 2. Test Email Service
        print("\n2. Testing Email Service...")
        
        # Test welcome email
        print("\nSending welcome email...")
        welcome_success = EmailService.send_welcome_email(test_user)
        print(f"Welcome email {'sent successfully' if welcome_success else 'failed to send'}")
        
        # Test trip reminder email
        print("\nSending trip reminder email...")
        reminder_success = EmailService.send_trip_reminder(test_trip, test_user)
        print(f"Trip reminder email {'sent successfully' if reminder_success else 'failed to send'}")

        print("\nAll tests completed successfully!")
        
    except Exception as e:
        print(f"\nError during testing: {str(e)}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_services())
