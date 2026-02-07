import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import './category.css';

const Category = () => {
  const navigate = useNavigate();
  const [adoptionAnimals, setAdoptionAnimals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/animals`)
      .then(response => response.json())
      .then(data => setAdoptionAnimals(data))
      .catch(error => console.error('Error fetching animals:', error));
  }, []);

  const categoriesData = {
    dog: {
      name: 'Dogs',
      icon: '🐕',
      description: 'Loyal companions who bring joy to every home',
      color: '#FF6B6B',
      bgImage: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    },
    cat: {
      name: 'Cats',
      icon: '🐱',
      description: 'Independent spirits with hearts full of love',
      color: '#4ECDC4',
      bgImage: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    },
    bird: {
      name: 'Birds',
      icon: '🐦',
      description: 'Colorful melodies that brighten your day',
      color: '#45B7D1',
      bgImage: 'https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    },
    rabbit: {
      name: 'Rabbits',
      icon: '🐰',
      description: 'Gentle souls with boundless energy',
      color: '#96CEB4',
      bgImage: 'https://images.pexels.com/photos/458976/pexels-photo-458976.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    },
    farm: {
      name: 'Farm Animals',
      icon: '🐄',
      description: 'Hardy friends for rural adventures',
      color: '#FECA57',
      bgImage: 'https://images.pexels.com/photos/1824353/pexels-photo-1824353.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    },
    cow: {
      name: 'Cows',
      icon: '🐄',
      description: 'Gentle giants for a peaceful farm life',
      color: '#FECA57',
      bgImage: 'https://images.pexels.com/photos/1824353/pexels-photo-1824353.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    }
  };

  const categories = Object.keys(categoriesData).map((key, index) => {
    const animalsInCategory = adoptionAnimals.filter(animal => animal.type.toLowerCase() === key.toLowerCase());
    return {
      id: index + 1,
      type: key,
      ...categoriesData[key],
      count: animalsInCategory.length,
      animals: animalsInCategory.map(animal => ({ name: animal.name }))
    };
  }).filter(category => category.count > 0);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
  };

  const handleViewAdoptions = () => {
    navigate('/adoption');
  };

  return (
    <div className="category-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <button className="back-btn" onClick={() => navigate('/')}>
            <span className="back-icon">←</span>
            <span className="back-text">Back to Home</span>
          </button>
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Choose Your</span>
              <span className="title-highlight">Perfect Match</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing animals organized by category. Each one is waiting for a loving home like yours.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{adoptionAnimals.length}</span>
                <span className="stat-label">Total Animals</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">6</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Love Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Browse Categories</h2>
          <p className="section-subtitle">Click on any category to explore available animals</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className={`category-card ${hoveredCategory === category.id ? 'hovered' : ''}`}
              onClick={() => handleCategoryClick(category)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{ 
                '--category-color': category.color,
                '--category-bg': category.bgImage,
                '--animation-delay': `${index * 0.1}s`
              }}
            >
              <div className="card-background">
                <div className="bg-overlay"></div>
                <div className="bg-image" style={{ backgroundImage: `url(${category.bgImage})` }}></div>
              </div>
              
              <div className="card-content">
                <div className="category-header">
                  <div className="category-icon">{category.icon}</div>
                  <div className="category-count">
                    <span className="count-number">{category.count}</span>
                    <span className="count-label">available</span>
                  </div>
                </div>
                
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <div className="category-actions">
                    <button className="explore-btn">
                      <span>Explore</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Find Your New Best Friend?</h2>
          <p className="cta-subtitle">Browse all available animals or go back to home</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={handleViewAdoptions}>
              <span className="btn-icon">🔍</span>
              <span>View All Adoptions</span>
            </button>
            <button className="cta-btn secondary" onClick={() => navigate('/')}>
              <span className="btn-icon">🏠</span>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedCategory && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              <span>×</span>
            </button>
            
            <div className="modal-header">
              <div className="modal-hero">
                <div 
                  className="modal-bg"
                  style={{ backgroundImage: `url(${selectedCategory.bgImage})` }}
                ></div>
                <div className="modal-bg-overlay"></div>
                <div className="modal-icon">{selectedCategory.icon}</div>
              </div>
              <div className="modal-info">
                <h2 className="modal-title">{selectedCategory.name}</h2>
                <p className="modal-description">{selectedCategory.description}</p>
                <div className="modal-count">
                  <span className="count-number">{selectedCategory.count}</span>
                  <span className="count-text">animals waiting for adoption</span>
                </div>
              </div>
            </div>
            
            <div className="modal-body">
              <h3 className="breeds-title">Available Breeds & Types</h3>
              <div className="breeds-grid">
                {selectedCategory.animals.map((animal, index) => (
                  <div key={index} className="breed-card">
                    <span className="breed-name">{animal.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-adopt-btn"
                onClick={handleViewAdoptions}
              >
                <span className="btn-icon">❤️</span>
                <span>View {selectedCategory.name} Adoptions</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
