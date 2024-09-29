
document.addEventListener('DOMContentLoaded', () => {
    const moodTrackingForm = document.getElementById('mood-tracking-form');

    if (moodTrackingForm) {
        moodTrackingForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(moodTrackingForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Provide feedback that the submission is in progress
                const submitButton = moodTrackingForm.querySelector('button[type="submit"]');
                submitButton.disabled = true; // Disable the button to prevent multiple submissions
                submitButton.textContent = 'Submitting...';

                // Send mood data using Fetch API
                const response = await fetch('/moodTracking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data),
                });

                // Re-enable the button after the request is completed
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';

                if (response.ok) {
                    alert('Mood recorded successfully! Redirecting to mood statistics...');
                    window.location.href = '/moodStatistics.html'; // Redirect to mood statistics page
                } else {
                    const errorText = await response.text();
                    alert(`Failed to record mood: ${errorText}`);
                }
            } catch (error) {
                console.error('Error submitting mood data:', error);
                alert('An error occurred while submitting your mood. Please try again.');
                
                // Re-enable the button in case of an error
                const submitButton = moodTrackingForm.querySelector('button[type="submit"]');
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
            }
        });
    }
});
