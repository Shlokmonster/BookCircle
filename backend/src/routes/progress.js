const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Progress = require('../models/Progress');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// @route   GET /api/progress
// @desc    Get user's reading progress for all books
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('book', 'title author totalPages');
    
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/:bookId
// @desc    Get user's reading progress for a specific book
// @access  Private
router.get('/:bookId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      book: req.params.bookId
    }).populate('book', 'title author totalPages');
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/progress/:bookId
// @desc    Update reading progress
// @access  Private
router.post('/:bookId', [
  auth,
  body('currentPage').isInt({ min: 0 }).withMessage('Current page must be a non-negative number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPage, notes } = req.body;

    // Check if book exists
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if current page is valid
    if (currentPage > book.totalPages) {
      return res.status(400).json({ message: 'Current page cannot exceed total pages' });
    }

    // Find or create progress
    let progress = await Progress.findOne({
      user: req.user.id,
      book: req.params.bookId
    });

    if (progress) {
      progress.currentPage = currentPage;
      if (notes !== undefined) {
        progress.notes = notes;
      }
      progress.updatedAt = Date.now();
    } else {
      progress = new Progress({
        user: req.user.id,
        book: req.params.bookId,
        currentPage,
        notes
      });
    }

    await progress.save();
    await progress.populate('book', 'title author totalPages');
    
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/book/:bookId/all
// @desc    Get all users' progress for a specific book
// @access  Public
router.get('/book/:bookId/all', async (req, res) => {
  try {
    const progress = await Progress.find({ book: req.params.bookId })
      .populate('user', 'username')
      .populate('book', 'title totalPages');
    
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
