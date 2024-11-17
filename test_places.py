import asyncio
import os
from dotenv import load_dotenv
import sys
from pathlib import Path
import pytest

# Add the project root directory to Python path
project_root = str(Path(__file__).parent)
sys.path.append(project_root)

from backend.services.places_service import PlacesService

# Load environment variables
load_dotenv()

places_service = PlacesService()

@pytest.mark.asyncio
async def test_places():
    try:
        # Test place search
        print("\nTesting place search for 'Eiffel Tower':")
        places = await places_service.search_places("Eiffel Tower")
        if places:
            place = places[0]
            print(f"Name: {place.name}")
            print(f"Address: {place.formatted_address}")
            print(f"Location: {place.latitude}, {place.longitude}")
            print(f"Category: {place.category}")
            print(f"Type: {place.type}")
            
        # Test nearby places
        print("\nTesting nearby places in London (restaurants):")
        nearby = await places_service.get_nearby_places(
            location="London",
            type="restaurant"
        )
        print(f"\nFound {len(nearby)} nearby restaurants:")
        for place in nearby:
            print(f"\nName: {place.name}")
            print(f"Address: {place.formatted_address}")
            print(f"Location: {place.latitude}, {place.longitude}")
            print(f"Category: {place.category}")
            
    except Exception as e:
        print(f"\nError: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_places())
