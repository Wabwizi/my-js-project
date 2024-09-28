// common.js

// Function to display notifications to users
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);

    // Automatically remove the notification after a few seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to handle form submissions with AJAX
function handleFormSubmission(formId, actionUrl, successMessage, errorMessage) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);

        fetch(actionUrl, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON response
        })
        .then(data => {
            // Assume the server responds with a success property
            if (data.success) {
                showNotification(successMessage, 'success');
                clearForm(formId); // Clear form fields after successful submission
                // Optionally redirect or update UI
                window.location.href = data.redirectUrl || './login.html'; // Redirect if specified
            } else {
                showNotification(errorMessage || data.message || 'An error occurred.', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            showNotification('An error occurred. Please try again.', 'error');
        });
    });
}

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Function to clear all form fields
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// Function to dynamically load scripts
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Example of using the loadScript function
loadScript('/path/to/someScript.js', () => {
    console.log('Script loaded and ready to use.');
});

// Expose functions for use in other scripts
window.common = {
    showNotification,
    handleFormSubmission,
    validateEmail,
    clearForm,
};
