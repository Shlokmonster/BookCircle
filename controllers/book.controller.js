import Book from "../models/Book.js";
import { uploadToCloudinary } from "../utils/uploadHelper.js";

// @route   GET /api/books
export const getBooks = async (req, res) => {
  try {
    const { search, genre, rating, limit } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } } // "genre" array matches regex against elements
      ];
    }

    if (genre) {
      query.genre = genre;
    }

    if (rating) {
      query.averageRating = { $gte: Number(rating) };
    }

    const books = await Book.find(query).limit(Number(limit) || 20);

    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   POST /api/books
export const createBook = async (req, res) => {
  try {
    const { title, author, description, genre, isbn, coverImage, totalPages, publishedYear } = req.body;

    let imageUrl = coverImage;
    if (coverImage) {
      imageUrl = await uploadToCloudinary(coverImage);
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre, // Assumes array provided or handled by Mongoose casting if string
      isbn,
      coverImage: imageUrl,
      totalPages,
      publishedYear
    });

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @route   GET /api/books/:id
export const getBookById = async (req, res) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Book ID format" });
    }
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   POST /api/books/:id/rate
export const rateBook = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid Book ID format" });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Check if user already rated
    const existingRatingIndex = book.ratings.findIndex(
      (r) => r.userId.toString() === req.user._id.toString()
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      book.ratings[existingRatingIndex].rating = Number(rating);
    } else {
      // Add new rating
      book.ratings.push({ userId: req.user._id, rating: Number(rating) });
    }

    // Recalculate average
    const total = book.ratings.reduce((acc, item) => acc + item.rating, 0);
    book.averageRating = total / book.ratings.length;

    await book.save();

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
