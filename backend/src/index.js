const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const connectDB = require('./config/mongoconfig');
const authRoutes = require('./routes/auth');

connectDB();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json()); // Enable JSON parsing

app.get('/', (req, res) => {
  res.send('API is working');
});

// ✅ Mount auth routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://127.0.0.1:${PORT}`);
});
