// mood_statistics.js

document.addEventListener('DOMContentLoaded', () => {
    // Sample data - replace with your actual data from the backend if available
    const moodData = [
        { mood: 'happy', count: 5 },
        { mood: 'stressed', count: 3 },
        { mood: 'sad', count: 2 },
        { mood: 'anxious', count: 1 },
        { mood: 'excited', count: 4 },
        { mood: 'relaxed', count: 6 },
        { mood: 'neutral', count: 2 },
        { mood: 'angry', count: 1 },
        { mood: 'frustrated', count: 1 },
        { mood: 'tired', count: 2 },
    ];

    const latestMood = { mood: 'happy', timestamp: '2024-09-28 12:00 PM', note: 'Feeling great!' };
    const moodTrend = [
        { mood: 'happy', count: 3 },
        { mood: 'stressed', count: 2 },
    ];

    const trendAnalysis = {
        highStress: true,
        recurrentSadness: false,
        positiveTrend: true,
    };

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

    // Function to populate mood distribution
    function populateMoodDistribution() {
        const moodList = document.getElementById('mood-distribution');
        moodData.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.mood}: ${entry.count} times`;
            moodList.appendChild(li);
        });
    }

    // Function to display the latest mood
    function displayLatestMood() {
        const latestMoodElement = document.getElementById('latest-mood');
        latestMoodElement.textContent = `Your latest mood was ${latestMood.mood} on ${latestMood.timestamp}. Note: ${latestMood.note}`;
    }

    // Function to populate mood trend
    function populateMoodTrend() {
        const trendList = document.getElementById('mood-trend');
        moodTrend.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.mood}: ${entry.count} times`;
            trendList.appendChild(li);
        });
    }

    // Function to display trend analysis
    function displayTrendAnalysis() {
        const analysisList = document.getElementById('trend-analysis');
        analysisList.innerHTML = `
            <li>High Stress: ${trendAnalysis.highStress ? 'Yes' : 'No'}</li>
            <li>Recurrent Sadness: ${trendAnalysis.recurrentSadness ? 'Yes' : 'No'}</li>
            <li>Positive Trend: ${trendAnalysis.positiveTrend ? 'Yes' : 'No'}</li>
        `;
    }

    // Function to display mood suggestions
    function displayMoodSuggestions() {
        const suggestionsList = document.getElementById('mood-suggestions');
        const userMood = latestMood.mood; // Get user's latest mood for suggestions
        const userSuggestions = suggestions[userMood] || ["Take care of yourself, and remember to stay balanced."];
        userSuggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            suggestionsList.appendChild(li);
        });
    }

    // Function to populate recent moods
    function populateRecentMoods() {
        const recentMoodsList = document.getElementById('recent-moods');
        const recentMoods = [
            { mood: 'happy', timestamp: '2024-09-27' },
            { mood: 'stressed', timestamp: '2024-09-26' },
            // Add more recent moods...
        ];
        recentMoods.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.mood} on ${entry.timestamp}`;
            recentMoodsList.appendChild(li);
        });
    }

    // Call functions to populate data
    populateMoodDistribution();
    displayLatestMood();
    populateMoodTrend();
    displayTrendAnalysis();
    displayMoodSuggestions();
    populateRecentMoods();
});
