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
const notificationsRoutes = require('./routes/notifications');
const authMiddleware = require('./middleware/auth');

// Notification scheduler
const notificationScheduler = require('./notificationScheduler');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activitiesRoutes);

// Add the trigger endpoint without auth middleware for testing
app.post('/api/notifications/trigger-streak-reminders', async (req, res) => {
  console.log('Trigger streak reminders endpoint called');
  try {
    const notificationScheduler = require('./notificationScheduler');
    await notificationScheduler.triggerStreakReminders();
    res.json({ success: true, message: 'Streak reminders triggered successfully' });
  } catch (error) {
    console.error('Error triggering streak reminders:', error);
    res.status(500).json({ success: false, message: 'Failed to trigger streak reminders' });
  }
});

app.use('/api/notifications', authMiddleware, notificationsRoutes);

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
  // Start the notification scheduler
  notificationScheduler.start();
});
