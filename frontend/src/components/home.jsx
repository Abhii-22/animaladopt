import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './home.css';
import About from './About';
import FeedbackAndContact from './Feedback';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="home-container" style={{ backgroundImage: 'url(/images/black_dog.png)' }}>
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="paw">🐾</span>
          <span className="logo-text"></span>
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
          <a href="#about-section-home" onClick={(e) => { e.preventDefault(); document.getElementById('about-section-home').scrollIntoView({ behavior: 'smooth' }); }} className="nav-link">About</a>
          <Link to="/kit" className="nav-link">Kit</Link>
          <Link to="/upload" className="nav-link upload-button">Upload your pet</Link>
        </nav>
      </header>
      <main className="main-content">
        <div className="animals-section">
          <div className="text-content">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Find Your New Best Friend
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Ready to bring joy and companionship into your life? We have amazing animals waiting to become part of your family.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/adoption" className="adopt-button">Start Your Adoption Journey</Link>
            </motion.div>
          </div>
        </div>
      </main>
      <div id="about-section-home">
        <About />
      </div>
      <FeedbackAndContact />
    </div>
  );
};

export default Home;
