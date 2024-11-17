// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const authRequired = document.getElementById('auth-required');
    const createPlan = document.getElementById('create-plan');

    if (token) {
        authRequired.style.display = 'none';
        createPlan.style.display = 'block';
        loadUserPlans();
    } else {
        authRequired.style.display = 'block';
        createPlan.style.display = 'none';
    }
});

// Handle travel plan form submission
document.getElementById('travel-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const budget = document.getElementById('budget').value;
    const mood = document.getElementById('mood').value;

    try {
        // Fetch weather data
        await fetchWeatherData(destination, startDate, endDate);
        
        // Fetch places data
        await fetchPlacesData(destination, mood);

        // Create travel plan
        const token = localStorage.getItem('token');
        const response = await fetch('/api/travel-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                destination,
                startDate,
                endDate,
                budget,
                mood
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Travel plan created successfully!');
            loadUserPlans();
        } else {
            alert(data.error || 'Failed to create travel plan');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the travel plan');
    }
});

// Fetch weather data for the destination
async function fetchWeatherData(destination, startDate, endDate) {
    try {
        const response = await fetch(`/api/weather/${encodeURIComponent(destination)}?start=${startDate}&end=${endDate}`);
        const data = await response.json();

        if (response.ok) {
            const weatherInfo = document.getElementById('weather-info');
            const weatherData = document.getElementById('weather-data');
            weatherInfo.style.display = 'block';

            weatherData.innerHTML = data.forecast.map(day => `
                <div class="weather-day">
                    <img src="${day.icon}" alt="Weather icon" class="weather-icon">
                    <div>
                        <strong>${new Date(day.date).toLocaleDateString()}</strong>
                        <div>${day.description}</div>
                        <div>Temperature: ${day.temperature}°C</div>
                    </div>
                </div>
            `).join('');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        alert('Failed to fetch weather data');
    }
}

// Fetch places data for the destination
async function fetchPlacesData(destination, mood) {
    try {
        const response = await fetch(`/api/places/search?destination=${encodeURIComponent(destination)}&mood=${mood}`);
        const data = await response.json();

        if (response.ok) {
            const placesInfo = document.getElementById('places-info');
            const placesData = document.getElementById('places-data');
            placesInfo.style.display = 'block';

            placesData.innerHTML = data.places.map(place => `
                <div class="attraction-item">
                    <h6>${place.name}</h6>
                    <p>${place.description}</p>
                    <small>Rating: ${place.rating} ⭐ | ${place.reviews} reviews</small>
                </div>
            `).join('');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Places fetch error:', error);
        alert('Failed to fetch places data');
    }
}

// Load user's travel plans
async function loadUserPlans() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/travel-plans', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Update UI with user's travel plans
            // This can be implemented based on how we want to display the plans
        } else {
            console.error('Failed to load travel plans:', data.error);
        }
    } catch (error) {
        console.error('Error loading travel plans:', error);
    }
}

// Handle offline functionality
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
});
