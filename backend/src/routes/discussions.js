const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Discussion = require('../models/Discussion');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// @route   GET /api/discussions/book/:bookId
// @desc    Get all discussions for a book
// @access  Public
router.get('/book/:bookId', async (req, res) => {
  try {
    const discussions = await Discussion.find({ book: req.params.bookId })
      .populate('user', 'username')
      .populate('replies.user', 'username')
      .sort({ createdAt: -1 });
    
    res.json(discussions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/discussions/:id
// @desc    Get a single discussion
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('user', 'username')
      .populate('replies.user', 'username')
      .populate('book', 'title');
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    res.json(discussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/discussions
// @desc    Create a new discussion
// @access  Private
router.post('/', [
  auth,
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId, title, content } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const discussion = new Discussion({
      book: bookId,
      user: req.user.id,
      title,
      content
    });

    await discussion.save();
    await discussion.populate('user', 'username');
    await discussion.populate('book', 'title');
    
    res.status(201).json(discussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/discussions/:id/reply
// @desc    Add a reply to a discussion
// @access  Private
router.post('/:id/reply', [
  auth,
  body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.replies.push({
      user: req.user.id,
      content
    });

    discussion.updatedAt = Date.now();

    await discussion.save();
    await discussion.populate('user', 'username');
    await discussion.populate('replies.user', 'username');
    await discussion.populate('book', 'title');
    
    res.json(discussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/discussions/:id
// @desc    Delete a discussion
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if user is the author
    if (discussion.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this discussion' });
    }

    await discussion.deleteOne();
    
    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
