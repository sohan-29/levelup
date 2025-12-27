require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

// Firebase Admin SDK
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://level-up-ko45.onrender.com',
  'https://levelup-now.netlify.app'
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const activitiesRoutes = require('./routes/activities');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activitiesRoutes);

// 🔹 Notification Routes
let tokens = []; // In-memory store for demo (replace with DB later)

// Register FCM token
app.post('/api/notifications/register', (req, res) => {
  const { token } = req.body;
  if (token && !tokens.includes(token)) {
    tokens.push(token);
    console.log("Token registered:", token);
  }
  res.json({ success: true });
});

// Send notification to a specific token
app.post('/api/notifications/send', async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: {
      title: title || "LevelUp Alert 🚀",
      body: body || "You just got a new activity!",
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
