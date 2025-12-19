import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  pageNumber: {
    type: Number,
    required: true,
    min: 1
  },
  chapter: {
    type: String,
    maxlength: 100
  },
  context: {
    type: String,
    maxlength: 1000
  },
  tags: {
    type: [String],
    default: []
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      likedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  collections: [{
    name: {
      type: String,
      required: true,
      maxlength: 50
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff',
    match: /^#[0-9A-F]{6}$/i
  }
}, { timestamps: true });

quoteSchema.index({ book: 1, club: 1 });
quoteSchema.index({ user: 1, club: 1 });
quoteSchema.index({ tags: 1 });

quoteSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => 
    like.user.toString() === userId.toString()
  );
  
  if (!existingLike) {
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

quoteSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => 
    like.user.toString() !== userId.toString()
  );
  return this.save();
};

quoteSchema.methods.addComment = function(userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

quoteSchema.methods.addCommentLike = function(quoteIndex, userId) {
  if (quoteIndex >= 0 && quoteIndex < this.comments.length) {
    const comment = this.comments[quoteIndex];
    const existingLike = comment.likes.find(like => 
      like.user.toString() === userId.toString()
    );
    
    if (!existingLike) {
      comment.likes.push({ user: userId });
    }
  }
  return this.save();
};

quoteSchema.methods.addToCollection = function(userId, collectionName) {
  const existingCollection = this.collections.find(collection => 
    collection.user.toString() === userId.toString() && collection.name === collectionName
  );
  
  if (!existingCollection) {
    this.collections.push({ name: collectionName, user: userId });
  }
  
  return this.save();
};

quoteSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;
