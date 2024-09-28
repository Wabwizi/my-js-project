// mood_statistics.js

document.addEventListener('DOMContentLoaded', () => {
    // Log to console to indicate the mood statistics page has loaded
    console.log('Mood statistics page loaded.');

    // Example: Show additional tips on button click (you can add a button in the HTML for this)
    const tipButton = document.getElementById('get-tips-button');
    if (tipButton) {
        tipButton.addEventListener('click', () => {
            alert('Remember to check in with yourself regularly! Consistent tracking can lead to better insights.');
        });
    }

    // Handle mood tracking form submission
    const moodTrackingForm = document.getElementById('mood-tracking-form'); // Make sure your form has this ID
    if (moodTrackingForm) {
        moodTrackingForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(moodTrackingForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/mood/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    // Redirect to mood statistics after successful submission
                    window.location.href = './mood_statistics.html'; // Ensure this path is correct
                } else {
                    const errorMessage = await response.text();
                    alert(`Error: ${errorMessage}`);
                }
            } catch (error) {
                console.error('Error during mood tracking:', error);
                alert('Submission failed. Please try again.');
            }
        });
    }
});

