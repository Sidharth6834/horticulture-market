require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------- MongoDB Connection ----------------

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "horticulture_market",
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

connectDB();

// ---------------- Routes ----------------

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/market', require('./routes/market'));
app.use('/api/storage', require('./routes/storage'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/demand', require('./routes/demand'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    message: "Smart Horticulture Platform API is running"
  });
});

module.exports = app;
