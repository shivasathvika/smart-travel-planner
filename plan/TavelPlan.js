import React from 'react';

function TravelPlan({ plan }) {
  return (
    <div className="travel-plan">
      <h2>Your Travel Plan</h2>
      <p><strong>Destination:</strong> {plan.destination}</p>
      <p><strong>Budget:</strong> ${plan.budget}</p>
      <p><strong>Dates:</strong> {plan.startDate} to {plan.endDate}</p>
      <p><strong>Interests:</strong> {plan.interests}</p>
      <h3>Suggested Itinerary</h3>
      <pre>{plan.itinerary}</pre>
    </div>
  );
}

export default TravelPlan;
