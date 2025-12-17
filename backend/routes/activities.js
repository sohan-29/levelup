const express = require('express');
const Activities = require('../models/Activities');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create a new activity
router.post('/activity', authMiddleware, async (req, res) => {
    try {
        const { title, createdDate, streak = 0, dailyStatus = [] } = req.body;

        // Validation with detailed error messages
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'title is required and cannot be empty' });
        }
        if (!createdDate) {
            return res.status(400).json({ error: 'createdDate is required (format: ISO date)' });
        }

        // Parse and validate date
        const parsedDate = new Date(createdDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'createdDate must be a valid date (format: ISO date string)' });
        }

        const activity = new Activities({
            title: title.trim(),
            createdDate: parsedDate,
            streak: Number(streak) || 0,
            dailyStatus: Array.isArray(dailyStatus) ? dailyStatus : [],
            createdBy: req.user.id
        });
        await activity.save();
        res.status(201).json({ message: 'Activity created successfully', activity });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all activities for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const activities = await Activities.find({ createdBy: req.user.id });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get activity by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const activity = await Activities.findOne({ _id: req.params.id, createdBy: req.user.id });
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update activity (currently not required)
// router.put('/:id', authMiddleware, async (req, res) => {
//     try {
//         const { title, createdDate, streak, dailyStatus } = req.body;
//         const updateData = {};

//         if (title !== undefined) updateData.title = title.trim();
//         if (createdDate !== undefined) updateData.createdDate = new Date(createdDate);
//         if (streak !== undefined) updateData.streak = Number(streak);
//         if (dailyStatus !== undefined) updateData.dailyStatus = dailyStatus;

//         const activity = await Activities.findOneAndUpdate(
//             { _id: req.params.id, createdBy: req.user.id },
//             updateData,
//             { new: true, runValidators: true }
//         );

//         if (!activity) {
//             return res.status(404).json({ error: 'Activity not found' });
//         }

//         res.json({ message: 'Activity updated successfully', activity });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// Delete activity
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const activity = await Activities.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id
        });
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found or unauthorized' });
        }
        res.json({ message: 'Activity deleted successfully', activity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
