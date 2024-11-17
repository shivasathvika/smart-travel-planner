document.addEventListener("DOMContentLoaded", function() {
    const successMessage = document.getElementById('success-message');
    const travelPlanContainer = document.getElementById('generated-plan');

    // Check if travel plan data exists in sessionStorage (set after form submission)
    const travelPlan = sessionStorage.getItem('travelPlan');

    if (travelPlan) {
        successMessage.textContent = "Your Travel Plan Has Been Generated!";
        travelPlanContainer.textContent = travelPlan;
        travelPlanContainer.style.display = 'block';
        sessionStorage.removeItem('travelPlan');  // Clean up after displaying
    } else {
        successMessage.textContent = "Error: Could not generate your travel plan.";
    }
});
