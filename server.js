require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI,{
      dbName:"horticulture_market"
    });

    console.log("MongoDB connected");

  } catch(err){

    console.error("MongoDB error:",err);
  }
};

connectDB();

app.use('/api/auth',require('./routes/auth'));
app.use('/api/crops',require('./routes/crops'));
app.use('/api/market',require('./routes/market'));
app.use('/api/storage',require('./routes/storage'));
app.use('/api/weather',require('./routes/weather'));
app.use('/api/demand',require('./routes/demand'));

app.get('/api/health',(req,res)=>{
  res.json({
    status:"ok",
    message:"Smart Horticulture Platform API is running"
  });
});

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'));
});

module.exports = app;
