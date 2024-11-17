import React from 'react';
import '../styles/About.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <div className="hero">
        <h1>About Smart Travel Planner</h1>
        <p>Your AI-powered companion for weather-aware travel planning</p>
      </div>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Smart Trip Planning</h3>
            <p>Our AI-powered system helps you create personalized travel itineraries based on your preferences and real-time weather data.</p>
          </div>
          
          <div className="feature-card">
            <h3>Weather Integration</h3>
            <p>Get accurate weather forecasts for your destinations and receive smart suggestions for the best times to visit.</p>
          </div>
          
          <div className="feature-card">
            <h3>ChatGPT Integration</h3>
            <p>Get personalized travel advice and recommendations from our advanced AI assistant.</p>
          </div>
          
          <div className="feature-card">
            <h3>Profile Management</h3>
            <p>Save and manage your travel plans, preferences, and favorite destinations in one place.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Share Your Preferences</h3>
            <p>Tell us about your travel style, preferred activities, and destination wishes.</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Weather Insights</h3>
            <p>We analyze weather patterns and provide recommendations for the best travel times.</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Receive Personalized Plans</h3>
            <p>Get AI-generated itineraries that match your preferences and weather conditions.</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Travel with Confidence</h3>
            <p>Enjoy your trip knowing you have weather-optimized plans and real-time updates.</p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Our Mission</h2>
        <p>At Smart Travel Planner, we believe that great trips start with great planning. Our mission is to combine the power of artificial intelligence with real-time weather data to help travelers make informed decisions and create unforgettable experiences.</p>
      </section>

      <section className="contact-section">
        <h2>Get in Touch</h2>
        <p>Have questions or suggestions? We'd love to hear from you!</p>
        <div className="contact-info">
          <div>
            <h3>Email</h3>
            <p>support@smarttravelplanner.com</p>
          </div>
          <div>
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
