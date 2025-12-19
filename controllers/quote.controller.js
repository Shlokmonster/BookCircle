import Quote from '../models/Quote.js';
import Club from '../models/Club.js';
import Book from '../models/Book.js';

export const createQuote = async (req, res) => {
  try {
    const {
      clubId,
      bookId,
      content,
      pageNumber,
      chapter,
      context,
      tags,
      isPublic = true,
      color = '#ffffff'
    } = req.body;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    const isMember = club.members.some(member => 
      member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only club members can create quotes'
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const quote = new Quote({
      book: bookId,
      club: clubId,
      user: req.user.id,
      content,
      pageNumber,
      chapter,
      context,
      tags: tags || [],
      isPublic,
      color
    });

    await quote.save();
    await quote.populate([
      { path: 'user', select: 'name email' },
      { path: 'book', select: 'title author coverImage' },
      { path: 'club', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Quote created successfully',
      quote
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating quote',
      error: error.message
    });
  }
};

export const getQuotes = async (req, res) => {
  try {
    const { clubId, bookId, userId, tags, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isPublic: true };
    
    if (clubId) query.club = clubId;
    if (bookId) query.book = bookId;
    if (userId) query.user = userId;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray };
    }

    const quotes = await Quote.find(query)
      .populate('user', 'name email')
      .populate('book', 'title author coverImage')
      .populate('club', 'name')
      .populate('likes.user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quote.countDocuments(query);

    res.json({
      success: true,
      quotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quotes',
      error: error.message
    });
  }
};

export const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quote = await Quote.findById(id)
      .populate('user', 'name email')
      .populate('book', 'title author coverImage totalPages')
      .populate('club', 'name')
      .populate('likes.user', 'name email')
      .populate('comments.user', 'name email')
      .populate('comments.likes.user', 'name email')
      .populate('collections.user', 'name email');

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    if (!quote.isPublic) {
      const club = await Club.findById(quote.club._id);
      const isMember = club.members.some(member => 
        member.user.toString() === req.user.id
      );

      if (!isMember && quote.user._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      quote
    });
  } catch (error) {
    console.error('Error getting quote:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quote',
      error: error.message
    });
  }
};

export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    if (quote.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the quote owner can update it'
      });
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('book', 'title author coverImage')
      .populate('club', 'name');

    res.json({
      success: true,
      message: 'Quote updated successfully',
      quote: updatedQuote
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating quote',
      error: error.message
    });
  }
};

export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    if (quote.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the quote owner can delete it'
      });
    }

    await Quote.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting quote',
      error: error.message
    });
  }
};

export const likeQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    await quote.addLike(req.user.id);

    await quote.populate([
      { path: 'user', select: 'name email' },
      { path: 'book', select: 'title author coverImage' },
      { path: 'club', select: 'name' },
      { path: 'likes.user', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Quote liked successfully',
      quote
    });
  } catch (error) {
    console.error('Error liking quote:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking quote',
      error: error.message
    });
  }
};

export const unlikeQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    await quote.removeLike(req.user.id);

    await quote.populate([
      { path: 'user', select: 'name email' },
      { path: 'book', select: 'title author coverImage' },
      { path: 'club', select: 'name' },
      { path: 'likes.user', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Quote unliked successfully',
      quote
    });
  } catch (error) {
    console.error('Error unliking quote:', error);
    res.status(500).json({
      success: false,
      message: 'Error unliking quote',
      error: error.message
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    await quote.addComment(req.user.id, content);

    await quote.populate([
      { path: 'user', select: 'name email' },
      { path: 'book', select: 'title author coverImage' },
      { path: 'club', select: 'name' },
      { path: 'comments.user', select: 'name email' },
      { path: 'comments.likes.user', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Comment added successfully',
      quote
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentIndex } = req.body;

    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    await quote.addCommentLike(commentIndex, req.user.id);

    await quote.populate([
      { path: 'user', select: 'name email' },
      { path: 'book', select: 'title author coverImage' },
      { path: 'club', select: 'name' },
      { path: 'comments.user', select: 'name email' },
      { path: 'comments.likes.user', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Comment liked successfully',
      quote
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking comment',
      error: error.message
    });
  }
};

export const addToCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { collectionName } = req.body;

    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    await quote.addToCollection(req.user.id, collectionName);

    await quote.populate([
      { path: 'user', select: 'name email' },
      { path: 'book', select: 'title author coverImage' },
      { path: 'club', select: 'name' },
      { path: 'collections.user', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Added to collection successfully',
      quote
    });
  } catch (error) {
    console.error('Error adding to collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to collection',
      error: error.message
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    await quote.toggleFavorite();

    await quote.populate([
      { path: 'user', select: 'name email' },
      { path: 'book', select: 'title author coverImage' },
      { path: 'club', select: 'name' }
    ]);

    res.json({
      success: true,
      message: `Quote ${quote.isFavorite ? 'favorited' : 'unfavorited'} successfully`,
      quote
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling favorite',
      error: error.message
    });
  }
};

export const getUserQuotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: userId };
    
    if (userId !== req.user.id) {
      query.isPublic = true;
    }

    const quotes = await Quote.find(query)
      .populate('user', 'name email')
      .populate('book', 'title author coverImage')
      .populate('club', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quote.countDocuments(query);

    res.json({
      success: true,
      quotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user quotes',
      error: error.message
    });
  }
};

export const getPopularQuotes = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const quotes = await Quote.find({ isPublic: true })
      .populate('user', 'name email')
      .populate('book', 'title author coverImage')
      .populate('club', 'name')
      .sort({ 'likes.length': -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      quotes
    });
  } catch (error) {
    console.error('Error getting popular quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular quotes',
      error: error.message
    });
  }
};
