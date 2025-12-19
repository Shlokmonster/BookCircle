import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  genre: [{
    type: String
  }],
  isbn: {
    type: String
  },
  coverImage: {
    type: String // URL
  },
  totalPages: {
    type: Number
  },
  publishedYear: {
    type: Number
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

export default Book;
