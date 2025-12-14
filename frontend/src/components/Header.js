import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>📚 BookCircle</h1>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          {isAuthenticated ? (
            <>
              <Link to="/progress">My Progress</Link>
              <Link to="/propose">Propose Book</Link>
              <span className="username">Hello, {user?.username}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
