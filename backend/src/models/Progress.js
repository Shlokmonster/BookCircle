const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  currentPage: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to ensure one progress per user per book
ProgressSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
