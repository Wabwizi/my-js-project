// index.js

// This script handles the functionality of the homepage

// Function to initialize event listeners
function init() {
    // Add an event listener for the DOM content loaded event
    window.addEventListener('DOMContentLoaded', () => {
        console.log("Welcome to the Mental Health App!"); // Log a message to the console

        // Check if the user is logged in and show/hide elements accordingly
        const userStatus = document.getElementById('user-status');
        const loginLink = document.getElementById('login-link');
        const logoutLink = document.getElementById('logout-link');

        // Assuming you want to dynamically check the session or login status (add actual logic here)
        if (isUserLoggedIn()) {
            userStatus.textContent = "You are logged in.";
            loginLink.style.display = 'none'; // Hide login link if logged in
            logoutLink.style.display = 'inline'; // Show logout link
        } else {
            userStatus.textContent = "Please log in.";
            loginLink.style.display = 'inline'; // Show login link
            logoutLink.style.display = 'none'; // Hide logout link if not logged in
        }

        // Add event listener for the logout link (if user is logged in)
        if (logoutLink) {
            logoutLink.addEventListener('click', handleLogout);
        }
    });

    // If you want to add more interactivity in the future, you can add it here
}

// Function to check if user is logged in (placeholder, replace with real logic)
function isUserLoggedIn() {
    // Add logic here to check the session status (e.g., check cookies or session storage)
    // For now, we'll assume the user is not logged in
    return false;
}

// Function to handle user logout (this can be extended to call a server-side logout endpoint)
function handleLogout(event) {
    event.preventDefault();
    console.log("Logging out...");

    // Here you can add logic to clear the session or call an API to handle logout
    // For example, you could use fetch to call the logout endpoint

    // Redirect to login page after logging out
    window.location.href = '/auth/login';
}

// Start the initialization function when the script is loaded
init();

