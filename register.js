document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            // Validate that passwords match
            if (data.password !== data['confirm-password']) {
                alert('Passwords do not match!');
                return;
            }

            // Call the common function to handle the form submission
            common.handleFormSubmission('register-form', '/auth/register', 'Registration successful! Redirecting to login...', 'Registration failed. Please try again.');
        });
    }
});
