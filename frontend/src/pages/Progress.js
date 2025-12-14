import React, { useState, useEffect } from 'react';
import { progressService } from '../services';
import './Progress.css';

const Progress = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await progressService.getMyProgress();
      setProgressList(data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (current, total) => {
    return Math.round((current / total) * 100);
  };

  if (loading) {
    return <div className="loading">Loading progress...</div>;
  }

  return (
    <div className="progress-page">
      <h1>My Reading Progress</h1>
      
      {progressList.length === 0 ? (
        <div className="no-progress">
          You haven't started tracking any books yet. Start reading to track your progress!
        </div>
      ) : (
        <div className="progress-list">
          {progressList.map(progress => (
            <div key={progress._id} className="progress-item">
              <div className="progress-info">
                <h3>{progress.book.title}</h3>
                <p className="author">by {progress.book.author}</p>
                <div className="progress-stats">
                  <span>
                    {progress.currentPage} / {progress.book.totalPages} pages
                  </span>
                  <span className="percentage">
                    {calculatePercentage(progress.currentPage, progress.book.totalPages)}% complete
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${calculatePercentage(progress.currentPage, progress.book.totalPages)}%` 
                    }}
                  />
                </div>
                {progress.notes && (
                  <div className="notes">
                    <strong>Notes:</strong> {progress.notes}
                  </div>
                )}
                <p className="updated">
                  Last updated: {new Date(progress.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Progress;
