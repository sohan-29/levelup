const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    try {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        // Verify token using server-side secret
        const verified = jwt.verify(token, secret);
        // Optionally ensure user still exists
        const user = await User.findById(verified.id);
        if (!user) return res.status(401).json({ error: 'User not found' });
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
