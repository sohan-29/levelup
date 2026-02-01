const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

// Helpers
function normalizeDateToMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Get note for a given date (query param ?date=YYYY-MM-DD), defaults to today
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const dateQuery = req.query.date ? new Date(req.query.date) : new Date();
    const date = normalizeDateToMidnight(dateQuery);

    const note = await Note.findOne({ user: userId, date });
    if (!note) return res.json({ note: null });

    res.json({ note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List notes in a date range: ?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/list', async (req, res) => {
  try {
    const userId = req.user.id;
    const start = req.query.start ? normalizeDateToMidnight(req.query.start) : normalizeDateToMidnight(new Date());
    const end = req.query.end ? normalizeDateToMidnight(req.query.end) : normalizeDateToMidnight(new Date());

    // Include whole end day by adding 1 day minus 1ms
    const endInclusive = new Date(end);
    endInclusive.setDate(endInclusive.getDate() + 1);

    const notes = await Note.find({ user: userId, date: { $gte: start, $lt: endInclusive } });

    res.json({ notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update note for a date (only allowed for today)
router.put('/:date', async (req, res) => {
  try {
    const userId = req.user.id;
    const dateParam = req.params.date; // Expecting iso date or YYYY-MM-DD
    const text = (req.body.text || '').trim();

    if (text.length === 0) {
      return res.status(400).json({ error: 'Note text cannot be empty' });
    }
    if (text.length > 500) {
      return res.status(400).json({ error: 'Note cannot exceed 500 characters' });
    }

    const date = normalizeDateToMidnight(dateParam);
    const today = normalizeDateToMidnight(new Date());

    // Only allow create/update for today's date
    if (date.getTime() !== today.getTime()) {
      return res.status(403).json({ error: 'Notes can only be created or updated for today' });
    }

    const note = await Note.findOneAndUpdate(
      { user: userId, date },
      { text },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: 'Note saved', note });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;