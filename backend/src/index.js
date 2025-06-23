// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoconfig');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const authRoutes = require('./routes/auth');
const chartRoutes = require('./routes/chart');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

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
// app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    });

    const text = result.response.text();
    return res.json({ reply: text });

  } catch (error) {
    console.error('[Gemini Error]', error.message); // 👈 log full error object
    return res.status(500).json({ error: error.message });
  }
});




// 🔗 Health check route
app.get('/', (req, res) => {
  res.send('✅ API is working and gemini api is working!');
});

// 🔗 Register routes
app.use('/api/auth', authRoutes);      // Auth-related endpoints
app.use('/api/chart', chartRoutes);    // Chart save/fetch endpoints

// 🔊 Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
