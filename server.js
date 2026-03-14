require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/market', require('./routes/market'));
app.use('/api/storage', require('./routes/storage'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/demand', require('./routes/demand'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Smart Horticulture Platform API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
