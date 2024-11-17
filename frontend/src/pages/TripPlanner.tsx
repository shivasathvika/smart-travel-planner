import React, { useState, useEffect } from 'react';
import '../styles/TripPlanner.css';

interface TravelPreferences {
  name: string;
  email: string;
  phone: string;
  tripType: string;
  mood: string;
  activities: string;
  travelPace: string;
  destination: string;
  climate: string;
  locationType: string;
}

const TripPlanner: React.FC = () => {
  const [preferences, setPreferences] = useState<TravelPreferences>({
    name: '',
    email: '',
    phone: '',
    tripType: 'luxury',
    mood: 'relaxing',
    activities: '',
    travelPace: 'balanced',
    destination: '',
    climate: 'moderate',
    locationType: 'urban'
  });

  const [chatGPTPrompt, setChatGPTPrompt] = useState('');
  const [chatGPTResponse, setChatGPTResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to submit travel preferences');
      }

      const data = await response.json();
      // Handle successful submission
      alert('Travel preferences submitted successfully!');
    } catch (error) {
      console.error('Error submitting preferences:', error);
      alert('Failed to submit preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getChatGPTAdvice = async () => {
    if (!chatGPTPrompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/chatgpt-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: chatGPTPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get ChatGPT advice');
      }

      const data = await response.json();
      setChatGPTResponse(data.response);
    } catch (error) {
      console.error('Error getting ChatGPT advice:', error);
      setChatGPTResponse('Failed to get advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-planner-container">
      <div className="hero">
        <h1>Your Ultimate Travel Assistant</h1>
      </div>

      <div className="travel-form-container">
        <h2>Fill out Your Travel Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <fieldset>
            <legend>Personal Information</legend>
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={preferences.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={preferences.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={preferences.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </fieldset>

          {/* Travel Preferences */}
          <fieldset>
            <legend>Travel Preferences</legend>
            <div className="form-group">
              <label htmlFor="tripType">What type of trip are you looking for?</label>
              <select
                id="tripType"
                name="tripType"
                value={preferences.tripType}
                onChange={handleInputChange}
              >
                <option value="luxury">Luxury</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="eco-friendly">Eco-friendly</option>
                <option value="solo">Solo</option>
                <option value="family">Family</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mood">What kind of vacation mood are you in?</label>
              <select
                id="mood"
                name="mood"
                value={preferences.mood}
                onChange={handleInputChange}
              >
                <option value="relaxing">Relaxing</option>
                <option value="thrilling">Thrilling</option>
                <option value="explorative">Explorative</option>
                <option value="romantic">Romantic</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="activities">Preferred Activities:</label>
              <input
                type="text"
                id="activities"
                name="activities"
                value={preferences.activities}
                onChange={handleInputChange}
                placeholder="e.g., Hiking, Beach, Shopping"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="travelPace">What pace do you prefer for your trip?</label>
              <select
                id="travelPace"
                name="travelPace"
                value={preferences.travelPace}
                onChange={handleInputChange}
              >
                <option value="busy">Busy</option>
                <option value="balanced">Balanced</option>
                <option value="laid-back">Laid-back</option>
              </select>
            </div>
          </fieldset>

          {/* Destination Preferences */}
          <fieldset>
            <legend>Destination Preferences</legend>
            <div className="form-group">
              <label htmlFor="destination">Preferred Destination(s):</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={preferences.destination}
                onChange={handleInputChange}
                placeholder="e.g., Paris, Tokyo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="climate">What climate do you prefer?</label>
              <select
                id="climate"
                name="climate"
                value={preferences.climate}
                onChange={handleInputChange}
              >
                <option value="hot">Hot</option>
                <option value="cold">Cold</option>
                <option value="moderate">Moderate</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="locationType">Do you prefer urban or rural destinations?</label>
              <select
                id="locationType"
                name="locationType"
                value={preferences.locationType}
                onChange={handleInputChange}
              >
                <option value="urban">Urban</option>
                <option value="rural">Rural</option>
              </select>
            </div>
          </fieldset>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Travel Preferences'}
          </button>
        </form>
      </div>

      {/* ChatGPT Advice Section */}
      <div className="chatgpt-section">
        <h3>Get Travel Advice from ChatGPT</h3>
        <div className="chatgpt-input">
          <textarea
            value={chatGPTPrompt}
            onChange={(e) => setChatGPTPrompt(e.target.value)}
            placeholder="Ask ChatGPT for travel advice..."
            rows={4}
          />
          <button onClick={getChatGPTAdvice} disabled={loading}>
            {loading ? 'Getting Advice...' : 'Get Advice'}
          </button>
        </div>
        {chatGPTResponse && (
          <div className="chatgpt-response">
            <h4>ChatGPT's Advice:</h4>
            <p>{chatGPTResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;
