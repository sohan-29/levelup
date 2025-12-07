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
        // Create a secret from user data (or use a fixed secret for consistency)
        const secret = user._id.toString();
        const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });
        res.json("successfully logged in!");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
