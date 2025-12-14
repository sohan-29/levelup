const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: isProd, // send cookie only over HTTPS in production
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 48 * 60 * 60 * 1000, // 2 days
            path: '/'
        });
        // Also return token in response body so SPA can store it if needed
        res.json({ message: 'successfully logged in!', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify token route
router.get('/verify', async (req, res) => {
    try {
        const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(200).json({ authenticated: false });
        }
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const verified = jwt.verify(token, secret);
        res.json({ authenticated: true, user: verified });
    } catch (error) {
        res.status(200).json({ authenticated: false });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'None' : 'Lax',
        path: '/'
    });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
