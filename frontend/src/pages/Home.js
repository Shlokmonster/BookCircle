import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to BookCircle</h1>
        <p className="tagline">A collaborative book club platform where learners unite</p>
        <div className="features">
          <div className="feature">
            <h3>📖 Propose Books</h3>
            <p>Suggest books you'd like to read with the community</p>
          </div>
          <div className="feature">
            <h3>🗳️ Vote Together</h3>
            <p>Vote on which books the club should read next</p>
          </div>
          <div className="feature">
            <h3>📊 Track Progress</h3>
            <p>Monitor your reading progress and see how others are doing</p>
          </div>
          <div className="feature">
            <h3>💬 Discuss</h3>
            <p>Share thoughts, insights, and questions with fellow readers</p>
          </div>
        </div>
      </section>
      
      <section className="getting-started">
        <h2>Getting Started</h2>
        <ol>
          <li>Create an account or login</li>
          <li>Browse proposed books and vote on your favorites</li>
          <li>Start reading when a book is selected</li>
          <li>Track your progress and join discussions</li>
        </ol>
      </section>
    </div>
  );
};

export default Home;
