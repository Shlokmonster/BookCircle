import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services';
import './ProposeBook.css';

const ProposeBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    coverImage: '',
    totalPages: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await bookService.proposeBook({
        ...formData,
        totalPages: parseInt(formData.totalPages)
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/books');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to propose book');
    }
  };

  if (success) {
    return (
      <div className="propose-container">
        <div className="success-message">
          Book proposed successfully! Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="propose-container">
      <div className="propose-box">
        <h2>Propose a Book</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Total Pages *</label>
            <input
              type="number"
              name="totalPages"
              value={formData.totalPages}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          <button type="submit" className="submit-btn">Propose Book</button>
        </form>
      </div>
    </div>
  );
};

export default ProposeBook;
