import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService, progressService, discussionService } from '../services';
import { useAuth } from '../context/AuthContext';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [notes, setNotes] = useState('');
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [replyContent, setReplyContent] = useState({});

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const bookData = await bookService.getBook(id);
      setBook(bookData);
      
      const discussionsData = await discussionService.getDiscussionsForBook(id);
      setDiscussions(discussionsData);
      
      if (isAuthenticated) {
        try {
          const progressData = await progressService.getProgressForBook(id);
          setProgress(progressData);
          setCurrentPage(progressData.currentPage);
          setNotes(progressData.notes || '');
        } catch (err) {
          // No progress yet, that's ok
        }
      }
    } catch (error) {
      console.error('Failed to fetch book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await bookService.voteBook(id, voteType);
      fetchBookDetails();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await progressService.updateProgress(id, { currentPage: parseInt(currentPage), notes });
      fetchBookDetails();
      alert('Progress updated successfully!');
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await discussionService.createDiscussion({
        bookId: id,
        title: newDiscussionTitle,
        content: newDiscussionContent
      });
      setNewDiscussionTitle('');
      setNewDiscussionContent('');
      fetchBookDetails();
    } catch (error) {
      console.error('Failed to create discussion:', error);
    }
  };

  const handleAddReply = async (discussionId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const content = replyContent[discussionId];
    if (!content || content.trim() === '') {
      alert('Please enter a reply before submitting.');
      return;
    }
    
    try {
      await discussionService.addReply(discussionId, content);
      setReplyContent({ ...replyContent, [discussionId]: '' });
      fetchBookDetails();
    } catch (error) {
      console.error('Failed to add reply:', error);
      alert('Failed to add reply. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (!book) {
    return <div className="error">Book not found</div>;
  }

  const upvotes = book.votes?.filter(v => v.voteType === 'upvote').length || 0;
  const downvotes = book.votes?.filter(v => v.voteType === 'downvote').length || 0;
  const score = upvotes - downvotes;
  const userVote = book.votes?.find(v => v.user?._id === user?.id || v.user === user?.id);

  return (
    <div className="book-detail-page">
      <div className="book-detail-container">
        <div className="book-header">
          <button onClick={() => navigate('/books')} className="back-btn">← Back to Books</button>
          {book.coverImage && (
            <img src={book.coverImage} alt={book.title} className="book-cover-large" />
          )}
          <div className="book-main-info">
            <h1>{book.title}</h1>
            <h2>by {book.author}</h2>
            <p className="description">{book.description}</p>
            <div className="book-meta">
              <span className="status">{book.status}</span>
              <span>{book.totalPages} pages</span>
              {book.isbn && <span>ISBN: {book.isbn}</span>}
            </div>
            
            <div className="voting-section">
              <button 
                onClick={() => handleVote('upvote')} 
                className={`vote-btn upvote ${userVote?.voteType === 'upvote' ? 'active' : ''}`}
              >
                ▲ {upvotes}
              </button>
              <span className="score">Score: {score}</span>
              <button 
                onClick={() => handleVote('downvote')} 
                className={`vote-btn downvote ${userVote?.voteType === 'downvote' ? 'active' : ''}`}
              >
                ▼ {downvotes}
              </button>
            </div>
          </div>
        </div>

        {isAuthenticated && book.status === 'reading' && (
          <div className="progress-section">
            <h3>Update Your Progress</h3>
            <form onSubmit={handleUpdateProgress}>
              <div className="form-group">
                <label>Current Page</label>
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  min="0"
                  max={book.totalPages}
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  placeholder="Add your reading notes..."
                />
              </div>
              <button type="submit" className="submit-btn">Update Progress</button>
            </form>
            {progress && (
              <div className="progress-display">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(progress.currentPage / book.totalPages) * 100}%` }}
                  />
                </div>
                <p>{Math.round((progress.currentPage / book.totalPages) * 100)}% complete</p>
              </div>
            )}
          </div>
        )}

        <div className="discussions-section">
          <h3>Discussions</h3>
          
          {isAuthenticated && (
            <form onSubmit={handleCreateDiscussion} className="new-discussion-form">
              <h4>Start a New Discussion</h4>
              <div className="form-group">
                <input
                  type="text"
                  value={newDiscussionTitle}
                  onChange={(e) => setNewDiscussionTitle(e.target.value)}
                  placeholder="Discussion title..."
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  value={newDiscussionContent}
                  onChange={(e) => setNewDiscussionContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Post Discussion</button>
            </form>
          )}

          <div className="discussions-list">
            {discussions.length === 0 ? (
              <p className="no-discussions">No discussions yet. Be the first to start one!</p>
            ) : (
              discussions.map(discussion => (
                <div key={discussion._id} className="discussion-item">
                  <h4>{discussion.title}</h4>
                  <p className="discussion-meta">
                    Posted by {discussion.user.username} on {new Date(discussion.createdAt).toLocaleDateString()}
                  </p>
                  <p className="discussion-content">{discussion.content}</p>
                  
                  <div className="replies">
                    {discussion.replies.map(reply => (
                      <div key={reply._id} className="reply-item">
                        <p className="reply-meta">
                          <strong>{reply.user.username}</strong> - {new Date(reply.createdAt).toLocaleDateString()}
                        </p>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                  </div>

                  {isAuthenticated && (
                    <div className="reply-form">
                      <textarea
                        value={replyContent[discussion._id] || ''}
                        onChange={(e) => setReplyContent({ ...replyContent, [discussion._id]: e.target.value })}
                        placeholder="Write a reply..."
                        rows="2"
                      />
                      <button 
                        onClick={() => handleAddReply(discussion._id)} 
                        className="reply-btn"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
