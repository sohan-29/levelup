const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    try {
        // Try to decode to get user ID
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        // Get the user to regenerate the secret
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        // Verify with user's ID as secret
        const secret = user._id.toString();
        const verified = jwt.verify(token, secret);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
