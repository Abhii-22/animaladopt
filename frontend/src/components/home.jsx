import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './home.css';
import About from './About';
import FeedbackAndContact from './Feedback';
import Header from './Header';

const Home = () => {
  return (
    <div className="home-container" style={{ backgroundImage: 'url(/images/black_dog.png)' }}>
      <Header />
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
