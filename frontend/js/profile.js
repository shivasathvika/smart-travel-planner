// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    loadTripHistory();
    loadFavorites();
    setupEventListeners();
});

// Load user profile information
async function loadUserProfile() {
    try {
        const response = await fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load profile');
        
        const profile = await response.json();
        populateProfileForm(profile);
    } catch (error) {
        console.error('Error loading profile:', error);
        showAlert('error', 'Failed to load profile information');
    }
}

// Populate profile form with user data
function populateProfileForm(profile) {
    document.getElementById('userFullName').textContent = profile.full_name;
    document.getElementById('userEmail').textContent = profile.email;
    document.getElementById('fullName').value = profile.full_name;
    document.getElementById('phoneNumber').value = profile.phone_number || '';
    document.getElementById('bio').value = profile.bio || '';
    document.getElementById('preferredCurrency').value = profile.preferred_currency;
    document.getElementById('preferredLanguage').value = profile.preferred_language;
    
    if (profile.profile_picture) {
        document.getElementById('profilePicture').src = profile.profile_picture;
    }
}

// Load user's trip history
async function loadTripHistory() {
    try {
        const response = await fetch('/api/trips', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load trips');
        
        const trips = await response.json();
        displayTripHistory(trips);
    } catch (error) {
        console.error('Error loading trips:', error);
        showAlert('error', 'Failed to load trip history');
    }
}

// Display trip history
function displayTripHistory(trips) {
    const tripHistoryContainer = document.getElementById('tripHistory');
    tripHistoryContainer.innerHTML = '';
    
    if (trips.length === 0) {
        tripHistoryContainer.innerHTML = '<p class="text-muted">No trips yet</p>';
        return;
    }
    
    trips.forEach(trip => {
        const tripElement = document.createElement('div');
        tripElement.className = 'list-group-item';
        tripElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${trip.destination}</h6>
                    <small class="text-muted">
                        ${new Date(trip.start_date).toLocaleDateString()} - 
                        ${new Date(trip.end_date).toLocaleDateString()}
                    </small>
                </div>
                <span class="badge bg-primary rounded-pill">Completed</span>
            </div>
        `;
        tripHistoryContainer.appendChild(tripElement);
    });
}

// Load user's favorite places
async function loadFavorites() {
    try {
        const response = await fetch('/api/favorites', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load favorites');
        
        const favorites = await response.json();
        displayFavorites(favorites);
    } catch (error) {
        console.error('Error loading favorites:', error);
        showAlert('error', 'Failed to load favorite places');
    }
}

// Display favorite places
function displayFavorites(favorites) {
    const favoritesContainer = document.getElementById('favoritePlaces');
    favoritesContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="text-muted">No favorite places yet</p>';
        return;
    }
    
    favorites.forEach(favorite => {
        const favoriteElement = document.createElement('div');
        favoriteElement.className = 'col-md-6 mb-3';
        favoriteElement.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h6 class="card-title">${favorite.place_name}</h6>
                    <button class="btn btn-sm btn-danger remove-favorite" 
                            data-favorite-id="${favorite.id}">
                        Remove
                    </button>
                </div>
            </div>
        `;
        favoritesContainer.appendChild(favoriteElement);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profileData = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(profileData)
            });
            
            if (!response.ok) throw new Error('Failed to update profile');
            
            showAlert('success', 'Profile updated successfully');
            loadUserProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('error', 'Failed to update profile');
        }
    });
    
    // Profile picture upload
    document.getElementById('profilePictureInput').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/profile/picture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            
            if (!response.ok) throw new Error('Failed to upload profile picture');
            
            const result = await response.json();
            document.getElementById('profilePicture').src = result.profile_picture;
            showAlert('success', 'Profile picture updated successfully');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            showAlert('error', 'Failed to upload profile picture');
        }
    });
    
    // Remove favorite
    document.getElementById('favoritePlaces').addEventListener('click', async (e) => {
        if (!e.target.matches('.remove-favorite')) return;
        
        const favoriteId = e.target.dataset.favoriteId;
        
        try {
            const response = await fetch(`/api/favorites/${favoriteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to remove favorite');
            
            loadFavorites();
            showAlert('success', 'Favorite removed successfully');
        } catch (error) {
            console.error('Error removing favorite:', error);
            showAlert('error', 'Failed to remove favorite');
        }
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '/signin.html';
    });
}

// Show alert message
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
