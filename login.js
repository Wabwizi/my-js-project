document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            // Client-side validation: Check if username and password are provided
            if (!data.username || !data.password) {
                alert('Username and password are required!');
                return;
            }

            try {
                // Send login data using Fetch API
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data),
                });

                if (response.ok) {
                    alert('Login successful! Redirecting...');
                    window.location.href = '/moodTracking.html'; // Redirect to mood tracking page after login
                } else {
                    const errorText = await response.text();
                    alert(`Login failed: ${errorText}`);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});
