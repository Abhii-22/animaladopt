import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/images/PetHomeX.png" alt="PetHomeX Logo" className="logo-image" />
      </div>
      <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/adoption" className="nav-link">Adoption</Link>
        <Link to="/category" className="nav-link">Category</Link>
        <a href="#about-section-home" onClick={(e) => { 
          e.preventDefault(); 
          navigate('/');
          setTimeout(() => {
            document.getElementById('about-section-home')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }} className="nav-link">About</a>
        <Link to="/kit" className="nav-link">Kit</Link>
        {currentUser ? (
          <div className="auth-buttons">
            <Link to="/profile" className="profile-button">
              <span className="profile-icon">👤</span>
              {currentUser.name || 'Profile'}
            </Link>
            <button onClick={handleSignOut} className="signout-button">Sign Out</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/signin" className="signin-button">Sign In</Link>
            <Link to="/signup" className="signup-button">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
