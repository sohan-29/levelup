const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  text: { type: String, required: true, maxlength: 500 }
}, { timestamps: true });

noteSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);