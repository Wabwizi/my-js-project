document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            // Validate that passwords match
            if (data.password !== data['confirm-password']) {
                alert('Passwords do not match!');
                return;
            }

            try {
                // Send the registration data using the Fetch API
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data),
                });

                if (response.ok) {
                    alert('Registration successful! Redirecting to login...');
                    window.location.href = '/auth/login'; // Redirect to the login page
                } else {
                    const errorText = await response.text();
                    alert(`Registration failed: ${errorText}`);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});
