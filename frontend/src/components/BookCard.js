import React from 'react';
import './BookCard.css';

const BookCard = ({ book, onVote, onViewDetails }) => {
  const upvotes = book.votes?.filter(v => v.voteType === 'upvote').length || 0;
  const downvotes = book.votes?.filter(v => v.voteType === 'downvote').length || 0;
  const score = upvotes - downvotes;

  return (
    <div className="book-card">
      {book.coverImage && (
        <img src={book.coverImage} alt={book.title} className="book-cover" />
      )}
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>
        <p className="description">{book.description.substring(0, 150)}...</p>
        <div className="book-meta">
          <span className="status">{book.status}</span>
          <span className="pages">{book.totalPages} pages</span>
        </div>
        <div className="voting">
          <button onClick={() => onVote(book._id, 'upvote')} className="vote-btn upvote">
            ▲ {upvotes}
          </button>
          <span className="score">Score: {score}</span>
          <button onClick={() => onVote(book._id, 'downvote')} className="vote-btn downvote">
            ▼ {downvotes}
          </button>
        </div>
        <button onClick={() => onViewDetails(book._id)} className="details-btn">
          View Details
        </button>
      </div>
    </div>
  );
};

export default BookCard;
