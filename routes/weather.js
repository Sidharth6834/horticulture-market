const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const axios = require('axios');

// Get weather data
router.get('/', auth, async (req, res) => {
    try {
        // Normally we would use req.query.lat and req.query.lon to call an actual weather API.
        // For demonstration purposes, we are using mock data if an API key is not present.
        const lat = req.query.lat || 28.6139;
        const lon = req.query.lon || 77.2090;

        // If the API key is missing or invalid, return mock data
        if (!process.env.WEATHER_API_KEY) {
            return res.json({
                location: 'Mock Location',
                temperature: 28,
                humidity: 65,
                windSpeed: 12,
                forecast: 'Clear Sky'
            });
        }

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`);

        res.json({
            location: response.data.name,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            forecast: response.data.weather[0].description
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching weather data');
    }
});

module.exports = router;
