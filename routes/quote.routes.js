import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  likeQuote,
  unlikeQuote,
  addComment,
  likeComment,
  addToCollection,
  toggleFavorite,
  getUserQuotes,
  getPopularQuotes
} from '../controllers/quote.controller.js';

const router = express.Router();

router.use(protect);

router.post('/', createQuote);
router.get('/', getQuotes);
router.get('/popular', getPopularQuotes);
router.get('/user/:userId', getUserQuotes);
router.get('/:id', getQuoteById);
router.put('/:id', updateQuote);
router.delete('/:id', deleteQuote);
router.post('/:id/like', likeQuote);
router.delete('/:id/like', unlikeQuote);
router.post('/:id/comments', addComment);
router.post('/:id/comments/like', likeComment);
router.post('/:id/collection', addToCollection);
router.post('/:id/favorite', toggleFavorite);

export default router;
