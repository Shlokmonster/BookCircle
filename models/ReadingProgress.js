import mongoose from "mongoose";

const readingProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  status: {
    type: String,
    enum: ['reading', 'completed', 'on-hold'],
    default: 'reading'
  },
  currentPage: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number
  },
  completedDate: {
    type: Date
  },
  notes: [{
    content: String,
    page: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const ReadingProgress = mongoose.model("ReadingProgress", readingProgressSchema);

export default ReadingProgress;
