const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// @route   GET /api/books
// @desc    Get all books
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const books = await Book.find(filter)
      .populate('proposedBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/:id
// @desc    Get a single book
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('proposedBy', 'username')
      .populate('votes.user', 'username');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books
// @desc    Propose a new book
// @access  Private
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('totalPages').isInt({ min: 1 }).withMessage('Total pages must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, description, isbn, coverImage, totalPages } = req.body;

    const book = new Book({
      title,
      author,
      description,
      isbn,
      coverImage,
      totalPages,
      proposedBy: req.user.id,
      status: 'voting'
    });

    await book.save();
    await book.populate('proposedBy', 'username');
    
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books/:id/vote
// @desc    Vote on a book
// @access  Private
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body;
    
    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Remove existing vote if any
    book.votes = book.votes.filter(vote => vote.user.toString() !== req.user.id);

    // Add new vote
    book.votes.push({
      user: req.user.id,
      voteType
    });

    await book.save();
    await book.populate('proposedBy', 'username');
    
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/books/:id/vote
// @desc    Remove vote from a book
// @access  Private
router.delete('/:id/vote', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Remove user's vote
    book.votes = book.votes.filter(vote => vote.user.toString() !== req.user.id);

    await book.save();
    await book.populate('proposedBy', 'username');
    
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/books/:id/status
// @desc    Update book status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['proposed', 'voting', 'reading', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.status = status;
    
    if (status === 'reading' && !book.startDate) {
      book.startDate = new Date();
    }
    
    if (status === 'completed' && !book.endDate) {
      book.endDate = new Date();
    }

    await book.save();
    await book.populate('proposedBy', 'username');
    
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
