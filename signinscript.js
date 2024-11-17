// Handle form submission and navigation between steps
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('step-container').classList.remove('hidden');
});

// User Data Step
document.getElementById('next-step').addEventListener('click', function() {
    document.getElementById('user-data').classList.add('hidden');
    document.getElementById('city-details').classList.remove('hidden');
});

// City Details Step
document.getElementById('next-planning').addEventListener('click', function() {
    document.getElementById('city-details').classList.add('hidden');
    document.getElementById('planning').classList.remove('hidden');
});

// Planning Step
document.getElementById('confirm-plan').addEventListener('click', function() {
    document.getElementById('planning').classList.add('hidden');
    document.getElementById('logout-section').classList.remove('hidden');
});

// Logout
document.getElementById('logout').addEventListener('click', function() {
    alert("You have been logged out.");
    window.location.reload(); // Reload the page to restart
});
