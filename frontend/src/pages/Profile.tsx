import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';

interface Trip {
  id: number;
  locations: {
    id: number;
    name: string;
    date: string;
  }[];
}

const Profile: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips');
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      
      const data = await response.json();
      setTrips(data);
    } catch (err) {
      setError('Failed to load trips. Please try again later.');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTrips(trips.filter(trip => trip.id !== tripId));
      } else {
        throw new Error('Failed to delete trip');
      }
    } catch (err) {
      console.error('Error deleting trip:', err);
      alert('Failed to delete trip. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      
      <section className="trips-section">
        <h2>Your Trips</h2>
        
        {trips.length === 0 ? (
          <p className="no-trips">No trips planned yet. Start planning your first trip!</p>
        ) : (
          <div className="trips-list">
            {trips.map((trip) => (
              <div key={trip.id} className="trip-card">
                <h3>Trip #{trip.id}</h3>
                <div className="locations-list">
                  {trip.locations.map((location) => (
                    <div key={location.id} className="location-item">
                      <span>{location.name}</span>
                      <span className="date">{location.date}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="delete-button"
                >
                  Delete Trip
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
