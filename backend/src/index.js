const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const connectDB = require('./config/mongoconfig');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/chart');
// Connect to MongoDB

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
app.use("/api/chart", require("./routes/chart"));


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://127.0.0.1:${PORT} and connected to MongoDB`);
});
