import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [filter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? null : filter;
      const data = await bookService.getAllBooks(status);
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (bookId, voteType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await bookService.voteBook(bookId, voteType);
      fetchBooks();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleViewDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Book Library</h1>
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'voting' ? 'active' : ''} 
            onClick={() => setFilter('voting')}
          >
            Voting
          </button>
          <button 
            className={filter === 'reading' ? 'active' : ''} 
            onClick={() => setFilter('reading')}
          >
            Currently Reading
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="no-books">No books found. Be the first to propose one!</div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <BookCard 
              key={book._id} 
              book={book} 
              onVote={handleVote}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
