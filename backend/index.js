require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
origin: 'http://localhost:5173',
credentials: true,
allowedHeaders: ['Content-Type', 'Authorization'],
methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

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
