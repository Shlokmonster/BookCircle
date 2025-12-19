import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['general', 'fiction', 'non-fiction', 'mystery', 'sci-fi', 'romance'],
    default: 'general'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  inviteCode: {
    type: String,
    required: function () { return this.isPrivate; }
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  currentBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  meetings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting'
  }]
}, { timestamps: true });

const Club = mongoose.model("Club", clubSchema);

export default Club;
