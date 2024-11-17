// Utility functions
const getToken = () => localStorage.getItem('token');
const getUserId = () => localStorage.getItem('userId');

// API calls
const api = {
    async signup(userData) {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    async signin(credentials) {
        const response = await fetch('/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    async createTravelPlan(planData) {
        const response = await fetch('/api/travel-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(planData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    async getTravelPlans() {
        const response = await fetch('/api/travel-plans', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    }
};

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    // Travel plan form handling
    const travelForm = document.getElementById('travel-form');
    if (travelForm) {
        travelForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const formData = {
                    destination: document.getElementById('destination').value,
                    startDate: document.getElementById('start-date').value,
                    endDate: document.getElementById('end-date').value,
                    mood: document.getElementById('mood').value,
                    budget: parseFloat(document.getElementById('budget').value)
                };

                const plan = await api.createTravelPlan(formData);
                window.location.href = `/success.html?planId=${plan._id}`;
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Profile dropdown
    const profileLink = document.querySelector('.profile-link');
    const dropdownMenu = document.querySelector('.dropdown');
    if (profileLink && dropdownMenu) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!profileLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // Check authentication status
    const token = getToken();
    if (!token && window.location.pathname !== '/signin.html' && window.location.pathname !== '/signup.html') {
        window.location.href = '/signin.html';
    }

    // Load user's travel plans if on success page
    if (window.location.pathname === '/success.html') {
        loadTravelPlans();
    }
});

// Load and display travel plans
async function loadTravelPlans() {
    try {
        const plans = await api.getTravelPlans();
        const plansList = document.getElementById('plans-list');
        if (plansList && plans.length > 0) {
            plansList.innerHTML = plans.map(plan => `
                <div class="plan-card">
                    <h3>${plan.destination}</h3>
                    <p>From: ${new Date(plan.startDate).toLocaleDateString()}</p>
                    <p>To: ${new Date(plan.endDate).toLocaleDateString()}</p>
                    <p>Budget: $${plan.budget}</p>
                    <div class="itinerary">
                        ${plan.itinerary.map(day => `
                            <div class="day">
                                <h4>Day ${day.day}</h4>
                                ${day.activities.map(activity => `
                                    <div class="activity">
                                        <span>${activity.time}</span>
                                        <span>${activity.activity}</span>
                                        <span>$${activity.cost.toFixed(2)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading travel plans:', error);
    }
}

// Smooth scroll functionality
document.querySelectorAll('.scroll-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Image Gallery Hover and Modal Popup
const images = document.querySelectorAll('.image-gallery img');
images.forEach(img => {
    img.addEventListener('mouseover', () => {
        img.style.transform = 'scale(1.1)';
    });
    img.addEventListener('mouseout', () => {
        img.style.transform = 'scale(1)';
    });

    // Modal Popup on click
    img.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.classList.add('modal-image');
        modal.appendChild(modalImg);
        document.body.appendChild(modal);

        modal.addEventListener('click', () => {
            modal.remove();
        });
    });
});

// Minimum length validation for username and password
document.querySelector("form").addEventListener("submit", function (event) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username.length < 5) {
        alert("Username must be at least 5 characters long.");
        event.preventDefault();
    } else if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        event.preventDefault();
    }
});

// Password visibility toggle
const passwordField = document.getElementById("password");
const toggleButton = document.createElement("button");
toggleButton.type = "button";
toggleButton.textContent = "Show";
toggleButton.style.marginTop = "10px";
toggleButton.onclick = () => {
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleButton.textContent = "Hide";
    } else {
        passwordField.type = "password";
        toggleButton.textContent = "Show";
    }
};

// Add the toggle button after the password field
passwordField.parentNode.insertBefore(toggleButton, passwordField.nextSibling);

// Password confirmation check
document.querySelector("form").addEventListener("submit", function (event) {
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        event.preventDefault(); // Prevent form submission
    }
});

// Password strength feedback
const passwordInput = document.getElementById("new-password");
const strengthMessage = document.createElement("p");
strengthMessage.style.color = "red";
passwordInput.parentNode.insertBefore(strengthMessage, passwordInput.nextSibling);

passwordInput.addEventListener("input", function () {
    const passwordValue = passwordInput.value;
    if (passwordValue.length < 6) {
        strengthMessage.textContent = "Password is too weak.";
    } else if (passwordValue.length < 10) {
        strengthMessage.textContent = "Password is moderate.";
        strengthMessage.style.color = "orange";
    } else {
        strengthMessage.textContent = "Password is strong!";
        strengthMessage.style.color = "green";
    }
});

// Set a countdown timer for redirection
let countdown = 10; // 10-second countdown
const countdownDisplay = document.createElement("p");
countdownDisplay.textContent = `Redirecting to the homepage in ${countdown} seconds...`;
document.querySelector("main").appendChild(countdownDisplay);

const countdownInterval = setInterval(() => {
    countdown--;
    countdownDisplay.textContent = `Redirecting to the homepage in ${countdown} seconds...`;

    // Redirect when countdown reaches 0
    if (countdown === 0) {
        clearInterval(countdownInterval);
        window.location.href = "index.html";
    }
}, 1000);

// Optional: Cancel auto-redirect if the user clicks the "Back to Home" button
document.querySelector("button").addEventListener("click", () => {
    clearInterval(countdownInterval); // Stop countdown
    window.location.href = "index.html"; // Immediate redirect
});
