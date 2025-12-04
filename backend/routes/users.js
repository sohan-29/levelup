const express = require('express');
const User = require('../models/User'); // Assuming a User model exists
const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming middleware sets req.user
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
