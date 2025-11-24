import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Animal Adoption</h1>
        <p>Find your new best friend today.</p>
      </header>
      <main className="landing-main">
        <div className="cta-section">
          <h2>Ready to adopt?</h2>
          <p>Browse our available animals and find the perfect match for your family.</p>
                    <button onClick={() => navigate('/home')}>View Animals</button>
        </div>
      </main>
      <footer className="landing-footer">
        <p>&copy; 2025 Animal Adoption. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
