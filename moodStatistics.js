document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch mood data from the backend
    async function fetchMoodData() {
        try {
            const response = await fetch('/api/moods'); // Adjust this endpoint according to your backend
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json(); // Assumes the server returns JSON data
        } catch (error) {
            console.error('Failed to fetch mood data:', error);
            return [];
        }
    }

    // Function to fetch latest mood from the backend
    async function fetchLatestMood() {
        try {
            const response = await fetch('/api/latestMood'); // Adjust this endpoint according to your backend
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json(); // Assumes the server returns JSON data
        } catch (error) {
            console.error('Failed to fetch latest mood:', error);
            return null; 
        }
    }

    // Function to fetch mood trend from the backend
    async function fetchMoodTrend() {
        try {
            const response = await fetch('/api/moodTrend'); // Adjust this endpoint according to your backend
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json(); // Assumes the server returns JSON data
        } catch (error) {
            console.error('Failed to fetch mood trend:', error);
            return [];
        }
    }

    // Function to fetch trend analysis from the backend
    async function fetchTrendAnalysis() {
        try {
            const response = await fetch('/api/trendAnalysis'); // Adjust this endpoint according to your backend
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json(); // Assumes the server returns JSON data
        } catch (error) {
            console.error('Failed to fetch trend analysis:', error);
            return null;
        }
    }

    // Suggestions based on mood
    const suggestions = {
        happy: [
            "Keep up the positive vibes! 😊",
            "Try a gratitude journal to stay in the moment.",
            "Continue with light exercises like yoga or walking.",
            "Celebrate your happiness by sharing it with friends!",
            "Explore new hobbies that excite you."
        ],
        excited: [
            "Channel your excitement into a creative project!",
            "Go for a run or do a HIIT workout to harness your energy.",
            "Try learning something new to keep the excitement flowing.",
            "Share your excitement with friends to boost your mood even more."
        ],
        relaxed: [
            "Maintain your calm by meditating for 10 minutes.",
            "Try some deep breathing exercises to stay centered.",
            "Consider journaling to reflect on your feelings.",
            "Enjoy a leisurely walk in nature to enhance your relaxation."
        ],
        neutral: [
            "You're feeling balanced—maybe try reading or journaling.",
            "A light walk could help boost your mood.",
            "Consider doing some light stretches to refresh your body.",
            "Engage in a simple task to keep your mind active."
        ],
        stressed: [
            "Take a break! Try breathing exercises or short mindfulness meditation.",
            "Go for a walk to clear your head and reset.",
            "Consider talking to someone about your stressors.",
            "Make a list of things that help you relax and use it."
        ],
        anxious: [
            "Focus on grounding techniques, like breathing or mindfulness.",
            "Progressive muscle relaxation may help reduce anxiety.",
            "Try writing down your thoughts to help organize them.",
            "Reach out to someone who can offer support."
        ],
        sad: [
            "Reach out to someone close to you for support.",
            "Try journaling your thoughts or going for a nature walk.",
            "Consider engaging in activities you usually enjoy.",
            "Explore creative outlets, like art or music, to express your feelings."
        ],
        angry: [
            "Take deep breaths and try a relaxation technique.",
            "Engage in physical exercise like running or boxing to let off steam.",
            "Consider talking it out with someone you trust.",
            "Find healthy outlets for your anger, such as art or writing."
        ],
        frustrated: [
            "Step away from the situation causing frustration and take a mental break.",
            "Consider trying yoga or mindfulness meditation to regain focus.",
            "Break tasks into smaller, manageable parts to reduce feelings of overwhelm.",
            "Talk to a friend or mentor for a fresh perspective."
        ],
        tired: [
            "Make sure you're getting enough sleep and rest.",
            "Engage in low-intensity activities like stretching or yoga.",
            "Consider taking a short nap to recharge.",
            "Reflect on your daily routine and make adjustments for better rest."
        ]
    };

    // Function to display mood suggestions based on the latest mood
    function displayMoodSuggestions(latestMood) {
        const suggestionsList = document.getElementById('mood-suggestions');
        const userMood = latestMood.mood; // Get user's latest mood for suggestions
        const userSuggestions = suggestions[userMood] || ["Take care of yourself, and remember to stay balanced."];
        suggestionsList.innerHTML = ''; // Clear previous suggestions
        userSuggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            suggestionsList.appendChild(li);
        });
    }

    // Function to populate mood distribution
    function populateMoodDistribution(moodData) {
        const moodList = document.getElementById('mood-distribution');
        moodList.innerHTML = ''; // Clear previous entries
        moodData.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.mood}: ${entry.count || 0}`; // Assuming moodData contains mood and count
            moodList.appendChild(li);
        });
    }

    // Function to display the latest mood
    function displayLatestMood(latestMood) {
        const latestMoodElement = document.getElementById('latest-mood');
        if (latestMood) {
            latestMoodElement.textContent = `Your latest mood was ${latestMood.mood} on ${latestMood.timestamp}. Note: ${latestMood.note || 'No note'}`;
        } else {
            latestMoodElement.textContent = "No latest mood entry found.";
        }
    }

    // Function to populate mood trend
    function populateMoodTrend(moodTrend) {
        const trendList = document.getElementById('mood-trend');
        trendList.innerHTML = ''; // Clear previous entries
        moodTrend.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.date}: ${entry.mood}`; // Assuming moodTrend contains date and mood
            trendList.appendChild(li);
        });
    }

    // Function to display trend analysis
    function displayTrendAnalysis(trendAnalysis) {
        const analysisList = document.getElementById('trend-analysis');
        analysisList.innerHTML = ''; // Clear previous entries
        if (trendAnalysis) {
            analysisList.innerHTML = `
                <li>High Stress: ${trendAnalysis.highStress ? 'Yes' : 'No'}</li>
                <li>Recurrent Sadness: ${trendAnalysis.recurrentSadness ? 'Yes' : 'No'}</li>
                <li>Positive Trend: ${trendAnalysis.positiveTrend ? 'Yes' : 'No'}</li>
            `;
        } else {
            analysisList.innerHTML = '<li>No trend analysis available.</li>';
        }
    }

    // Main function to fetch all data and display it
    async function init() {
        const moodData = await fetchMoodData();       // Fetch mood data from the backend
        const latestMood = await fetchLatestMood();   // Fetch the latest mood from the backend
        const moodTrend = await fetchMoodTrend();     // Fetch mood trend data from the backend
        const trendAnalysis = await fetchTrendAnalysis(); // Fetch trend analysis data from the backend

        // Populate UI with fetched data
        populateMoodDistribution(moodData); // Populate mood distribution
        if (latestMood) {
            displayLatestMood(latestMood);   // Display the latest mood
            displayMoodSuggestions(latestMood); // Display mood suggestions based on the latest mood
        }
        populateMoodTrend(moodTrend);       // Populate mood trend
        if (trendAnalysis) {
            displayTrendAnalysis(trendAnalysis); // Display trend analysis
        }
    }

    // Call the init function to fetch data and populate the UI
    init();
});
