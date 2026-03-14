# Smart Horticulture Market Platform 🌿

A modern, responsive web application designed to empower horticulture farmers with data-driven insights. This platform helps farmers find the best market prices, locate storage facilities, monitor weather conditions, and discover value-addition opportunities.

## 🚀 Key Features

### For Farmers 👨‍🌾
- **Live Market Prices**: Search for crops and compare prices across different mandis (markets).
- **Weather Monitoring**: Real-time weather updates (Temp, Humidity, Forecast) to plan harvesting and transport.
- **Storage Finder**: Locate nearby cold storage and warehouse facilities with contact details.
- **Crop Demand Prediction**: Data-driven insights on current and future demand for specific crops.
- **Value Addition Ideas**: Suggestions on processing raw crops into higher-value products (e.g., Tomatoes to Puree).
- **Personal Dashboard**: A clean, centralized view of all essential farming data.

### For Admins 🛡️
- **Data Management**: Update market prices and crop demand predictions.
- **Facility Management**: Add and edit storage center locations.
- **User Insights**: Manage farmer accounts and platform analytics.

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Modern Glassmorphism Design), JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **Data Visualization**: Chart.js
- **Icons**: Font Awesome

## 🏁 Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB installed and running locally

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/horticulture-market.git
   cd horticulture-market
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/horticulture_market
   JWT_SECRET=your_secure_secret_key
   WEATHER_API_KEY=your_openweather_api_key
   ```

4. **Run the application**
   ```bash
   node server.js
   ```
   Open `http://localhost:5000` in your browser.

## 📁 Project Structure

```text
horticulture-market/
├── models/           # Mongoose schemas (User, Crop, Price, etc.)
├── routes/           # Express API endpoints
├── middlewares/      # Auth & logic gatekeepers
├── public/           # Frontend (HTML, CSS, JS)
│   ├── css/          # Glassmorphism styling
│   ├── js/           # Frontend logic & API calls
│   └── ...           # HTML Pages
├── server.js         # Entry point
└── .env              # Environment secrets (ignored by git)
```

## 🌐 Deployment
This project is ready to be deployed on platforms like **Render**, **Railway**, or **Heroku** with a **MongoDB Atlas** cloud database.

## 📄 License
This project is licensed under the ISC License.
