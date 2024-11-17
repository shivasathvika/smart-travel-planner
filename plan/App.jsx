import React, { useState, useEffect } from 'react';
import TravelPlan from './TravelPlan';
import './App.css';

function App() {
  const [userData, setUserData] = useState({
    destination: '',
    budget: '',
    startDate: '',
    endDate: '',
    interests: '',
  });

  const [travelPlan, setTravelPlan] = useState(null);
  const [placesSuggestions, setPlacesSuggestions] = useState([]);

  // Google Maps API Loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAT4ARfY-W3O2I56FBX3rbHevxvfCcfdwY', // Replace with your actual API key
    libraries: ['places'],
  });

  // Fetching places suggestions based on destination
  useEffect(() => {
    if (userData.destination) {
      const fetchPlaces = async () => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${userData.destination}&key=AIzaSyAT4ARfY-W3O2I56FBX3rbHevxvfCcfdwY`
        );
        const data = await response.json();
        setPlacesSuggestions(data.predictions || []);
      };

      fetchPlaces();
    }
  }, [userData.destination]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const generatePlan = () => {
      let itinerary = `Day 1: Explore ${userData.destination} attractions.\nDay 2: Relax and enjoy the local culture.\n`;

      if (userData.interests.toLowerCase().includes('adventure')) {
        itinerary += 'Day 3: Hiking or adventure sports in your destination.\n';
      }

      if (userData.interests.toLowerCase().includes('relaxation')) {
        itinerary += 'Day 3: Spa and relaxation.\n';
      }

      return itinerary;
    };

    // Generate the travel plan and set it to state
    const generatedPlan = generatePlan();
    setTravelPlan({
      ...userData,
      itinerary: generatedPlan,
    });
  };

  return (
    <div className="App">
      <h1>Smart Travel Planner</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Destination:
          <input
            type="text"
            name="destination"
            value={userData.destination}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Budget:
          <input
            type="number"
            name="budget"
            value={userData.budget}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={userData.startDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={userData.endDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Interests (e.g., nature, adventure, relaxation):
          <input
            type="text"
            name="interests"
            value={userData.interests}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Generate Travel Plan</button>
      </form>

      {travelPlan && <TravelPlan plan={travelPlan} />}
    </div>
  );
}

export default App;
