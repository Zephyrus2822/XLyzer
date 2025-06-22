// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoconfig');

const authRoutes = require('./routes/auth');
const chartRoutes = require('./routes/chart');

dotenv.config(); // Load env vars
connectDB(); // Connect to MongoDB

const app = express();

// 🔐 Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // Parse incoming JSON

// 🔗 Health check route
app.get('/', (req, res) => {
  res.send('✅ API is working');
});

// 🔗 Register routes
app.use('/api/auth', authRoutes);      // Auth-related endpoints
app.use('/api/chart', chartRoutes);    // Chart save/fetch endpoints

// 🔊 Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
