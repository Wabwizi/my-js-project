document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Optional: Basic client-side validation (if needed)
    if (!data.username || !data.password) {
        alert('Username and password are required!');
        return;
    }

    // Use the common handleFormSubmission function
    common.handleFormSubmission(
        'login-form',
        '/auth/login',
        'Login successful! Redirecting...',
        'Login failed. Please check your credentials and try again.'
    );
});
