import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Travel Weather</h1>
        <p>Plan your trips with real-time weather insights</p>
      </header>
      
      <section className="features-section">
        <div className="feature-card">
          <h2>Plan Your Trip</h2>
          <p>Create and manage your travel itineraries</p>
          <Link to="/plan" className="feature-button">Start Planning</Link>
        </div>
        
        <div className="feature-card">
          <h2>Weather Forecast</h2>
          <p>Get detailed weather information for your destinations</p>
          <Link to="/weather" className="feature-button">Check Weather</Link>
        </div>
        
        <div className="feature-card">
          <h2>Your Profile</h2>
          <p>View and manage your saved trips</p>
          <Link to="/profile" className="feature-button">View Profile</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
