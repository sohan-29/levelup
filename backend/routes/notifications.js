const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User'); // Assuming you have a User model

// Register FCM token for a user
router.post('/register', async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user?.id; // Assuming auth middleware sets req.user

    console.log('Token registration request:', { token: token?.substring(0, 50) + '...', userId, user: req.user });

    if (!token) {
      return res.status(400).json({ message: 'FCM token is required' });
    }

    // TEMP: Allow registration without auth for testing
    if (!userId) {
      console.log('No userId from auth, trying to find user by email from token...');
      // Try to get user from the JWT token in Authorization header
      const authHeader = req.header('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        try {
          const jwt = require('jsonwebtoken');
          const secret = process.env.JWT_SECRET || 'your-secret-key';
          const decoded = jwt.verify(token, secret);
          const foundUserId = decoded.id;
          console.log('Found userId from JWT:', foundUserId);

          const updatedUser = await User.findByIdAndUpdate(foundUserId, { fcmToken: token }, { new: true });
          if (updatedUser) {
            console.log(`FCM token registered for user ${foundUserId}:`, token.substring(0, 50) + '...');
            console.log(`Updated user fcmToken:`, updatedUser.fcmToken ? 'SET' : 'NOT SET');
            return res.json({ success: true, message: 'Token registered successfully' });
          }
        } catch (jwtError) {
          console.log('JWT verification failed:', jwtError.message);
        }
      }
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Update user's FCM token
    const updatedUser = await User.findByIdAndUpdate(userId, { fcmToken: token }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`FCM token registered for user ${userId}:`, token.substring(0, 50) + '...');
    console.log(`Updated user fcmToken:`, updatedUser.fcmToken ? 'SET' : 'NOT SET');
    res.json({ success: true, message: 'Token registered successfully' });
  } catch (error) {
    console.error('Error registering FCM token:', error);
    res.status(500).json({ success: false, message: 'Failed to register token' });
  }
});

// Send notification to a specific user
router.post('/send-to-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, body, data } = req.body;

    console.log('Sending notification to user:', userId);
    const user = await User.findById(userId);
    console.log('User found:', !!user, 'fcmToken:', user?.fcmToken ? 'EXISTS' : 'NOT SET');
    if (!user || !user.fcmToken) {
      return res.status(404).json({ message: 'User not found or no FCM token' });
    }

    const message = {
      notification: {
        title: title || 'LevelUp Notification',
        body: body || 'You have a new notification!',
      },
      data: data || {},
      token: user.fcmToken,
    };

    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);

    res.json({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
});

// Send notification to all users (for broadcasts)
router.post('/send-to-all', async (req, res) => {
  try {
    const { title, body, data } = req.body;

    const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
    const tokens = users.map(user => user.fcmToken).filter(token => token);

    if (tokens.length === 0) {
      return res.status(404).json({ message: 'No users with FCM tokens found' });
    }

    const message = {
      notification: {
        title: title || 'LevelUp Broadcast',
        body: body || 'Broadcast message from LevelUp!',
      },
      data: data || {},
      tokens: tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log('Broadcast sent successfully:', response);

    res.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ success: false, message: 'Failed to send broadcast' });
  }
});

// Unregister FCM token (for logout)
router.post('/unregister', async (req, res) => {
  try {
    const userId = req.user?.id;

    await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });

    console.log(`FCM token unregistered for user ${userId}`);
    res.json({ success: true, message: 'Token unregistered successfully' });
  } catch (error) {
    console.error('Error unregistering FCM token:', error);
    res.status(500).json({ success: false, message: 'Failed to unregister token' });
  }
});

module.exports = router;
