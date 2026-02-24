import React, { useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import API_BASE_URL, { IMAGE_BASE_URL } from '../config/api';

import './adoption.css';

import AdoptionForm from './AdoptionForm';

import ShelterModal from './ShelterModal';

const Adoption = () => {

  const navigate = useNavigate();

  const [adoptionAnimals, setAdoptionAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAge] = useState('all');
  const [selectedGender] = useState('all');
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showShelterModal, setShowShelterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);


  // Placeholder image base64
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0xMzcuNSA4Ny41SDE2Mi41VjExMi41SDEzNy41Vjg3LjVaIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LXNpemU9IjE2IiBmb250LWZhbWlseT0iQXJpYWwiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';

  
  const normalizeText = (text = '') =>
    text.toLowerCase().replace(/[^a-z0-9]/g, '');

  const isFuzzyMatch = useCallback((source = '', query = '') => {
    const src = normalizeText(source);
    const q = normalizeText(query);

    if (!q) return true;

    if (src.includes(q)) return true;

    // Simple Levenshtein distance for short strings
    const len1 = src.length;
    const len2 = q.length;

    if (!len1 || !len2) return false;

    // Fast-fail when length difference is already too big to be a close match
    const maxAllowedDifference = 3;
    if (Math.abs(len1 - len2) > maxAllowedDifference) {
      return false;
    }

    const dp = Array.from({ length: len1 + 1 }, () =>
      new Array(len2 + 1).fill(0)
    );

    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = src[i - 1] === q[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }

    const distance = dp[len1][len2];
    const threshold = 3; // allow a few typos
    return distance <= threshold;
  }, []);

  // Update filtered animals when filters change
  useEffect(() => {
    const filtered = adoptionAnimals.filter(animal => {
      const matchesSearch =
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = !locationTerm || 
        isFuzzyMatch(animal.location, locationTerm);

      const matchesType =
        selectedType === 'all' ||
        animal.type?.toLowerCase() === selectedType.toLowerCase();

      const matchesAge =
        selectedAge === 'all' ||
        animal.age?.toLowerCase() === selectedAge.toLowerCase();

      const matchesGender =
        selectedGender === 'all' ||
        animal.gender?.toLowerCase() === selectedGender.toLowerCase();

      return matchesSearch && matchesLocation && matchesType && matchesAge && matchesGender;
    });

    setFilteredAnimals(filtered);
  }, [adoptionAnimals, searchTerm, locationTerm, selectedType, selectedAge, selectedGender, isFuzzyMatch]);

  const fetchAnimals = useCallback(() => {
    setIsLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/animals`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load animals');
        }
        return response.json();
      })
      .then(data => {
        setAdoptionAnimals(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching animals:', error);
        setError(error.message || 'Something went wrong while loading animals.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  useEffect(() => {
    // Reset visible items when filters change
    setVisibleCount(12);
  }, [searchTerm, locationTerm, selectedType, selectedAge, selectedGender]);


  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return placeholderImage;
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Convert backslashes to forward slashes and remove leading slash if present
    const normalizedPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
    
    // Ensure the path starts with 'uploads/' if it doesn't already
    const finalPath = normalizedPath.startsWith('uploads/') ? normalizedPath : `uploads/${normalizedPath}`;
    
    // Use the same base URL for both development and production
    const baseUrl = IMAGE_BASE_URL;
    const fullUrl = `${baseUrl}/${finalPath}`;
    
    return fullUrl;
  };

  // Smart image source that prevents errors
  const getSafeImageSrc = (animal) => {
    // If we already know this image is invalid, return placeholder
    if (animal.hasValidImage === false) {
      return placeholderImage;
    }
    
    // Otherwise try the actual image URL
    return getImageUrl(animal.image);
  };

  // Handle image error and fallback to placeholder
  const handleImageError = (event, animal) => {
    event.target.src = placeholderImage;
    // Mark this animal as having invalid image to prevent repeated attempts
    animal.hasValidImage = false;
  };



  const handleAdoptClick = (animal) => {

    setSelectedAnimal(animal);

  };



  const handleCloseModal = () => {

    setSelectedAnimal(null);

  };



  const handleCloseAdoptionForm = () => {

    setShowAdoptionForm(false);

    setSelectedAnimal(null);

  };



  const handleShowShelterModal = () => {

    setShowShelterModal(true);

  };



  const handleCloseShelterModal = () => {

    setShowShelterModal(false);

  };



  const handleImageClick = () => {

    setShowImagePopup(true);

  };



  const handleCloseImagePopup = () => {

    setShowImagePopup(false);

  };



  return (

    <div className="adoption-container">

      {/* Header */}

      <div className="header">

        <button className="back-btn" onClick={() => navigate('/')}>

          <span className="back-icon">←</span>

          <span className="back-text">Back to Home</span>

        </button>

        

      </div>



      {/* Search and Filter Bar */}

      <div className="search-filter-bar">

        <div className="search-inputs">

          <div className="search-box">

            <span className="search-icon">🔍</span>

            <input

              type="text"

              placeholder="Search by name or breed..."

              value={searchTerm}

              onChange={(e) => setSearchTerm(e.target.value)}

              className="search-input"

            />

          </div>



          <div className="search-box location-search-box">

            <span className="search-icon">📍</span>

            <input

              type="text"

              placeholder="Search by location..."

              value={locationTerm}

              onChange={(e) => setLocationTerm(e.target.value)}

              className="search-input"

            />

          </div>

        </div>

        <div className="filter-buttons">

          <button 

            className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}

            onClick={() => setSelectedType('all')}

          >

            All

          </button>

          <button 

            className={`filter-btn ${selectedType === 'dog' ? 'active' : ''}`}

            onClick={() => setSelectedType('dog')}

          >

            Dogs

          </button>

          <button 

            className={`filter-btn ${selectedType === 'cat' ? 'active' : ''}`}

            onClick={() => setSelectedType('cat')}

          >

            Cats

          </button>

          <button 

            className={`filter-btn ${selectedType === 'farm' ? 'active' : ''}`}

            onClick={() => setSelectedType('farm')}

          >

            Farm

          </button>

          <button 

            className={`filter-btn ${selectedType === 'bird' ? 'active' : ''}`}

            onClick={() => setSelectedType('bird')}

          >

            Birds

          </button>

        </div>

      </div>



      {/* Animals Grid */}

      <div className="animals-grid">

        {isLoading ? (

          <div className="loading-state">

            <p>Loading animals for adoption...</p>

          </div>

        ) : error ? (

          <div className="error-state">

            <p>Failed to load animals: {error}</p>

            <button type="button" className="retry-btn" onClick={fetchAnimals}>

              Try again

            </button>

          </div>

        ) : filteredAnimals.length === 0 ? (

          <div className="no-animals-message">

            <p>No animals found matching your filter criteria.</p>

          </div>

        ) : (

          <>

          {filteredAnimals.slice(0, visibleCount).map((animal) => (

          <div key={animal._id} className="adoption-card">

            <div className="card-header">

              <div className="animal-badge">{animal.type.toUpperCase()}</div>

              <div className="animal-status">

                {animal.vaccinated && <span className="status-icon">💉</span>}

                {animal.neutered && <span className="status-icon">✓</span>}

              </div>

            </div>

            <div className="animal-image">
              <img 
                src={getSafeImageSrc(animal)} 
                alt={animal.name}
                loading="lazy"
                onError={(e) => handleImageError(e, animal)}
              />

              <div className="image-overlay">

                <button className="quick-view-btn" onClick={() => handleAdoptClick(animal)}>

                  Quick View

                </button>

              </div>

            </div>

            

            <div className="animal-info">

              <div className="animal-details">

                <h3 className="animal-name">{animal.name}</h3>

                <p className="animal-breed">{animal.breed}</p>

                <div className="animal-meta">

                  <span className="meta-item">📍 {animal.location}</span>

                  <span className="meta-item">👤 {animal.gender}</span>

                  <span className="meta-item">📏 {animal.size}</span>

                </div>

                <p className="animal-age">Age: {animal.age}</p>

                <p className="animal-description">{animal.description}</p>

                <p className="animal-price">Adoption Fee: ₹{animal.price}</p>

              </div>

              <button className="adopt-btn" onClick={() => handleAdoptClick(animal)}>

                <span className="btn-icon">❤️</span>

                Adopt Now

              </button>

            </div>

          </div>

          ))}

          {visibleCount < filteredAnimals.length && (

            <div className="load-more-wrapper">

              <button
                type="button"
                className="load-more-btn"
                onClick={() => setVisibleCount((prev) => prev + 12)}
              >

                Load more

              </button>

            </div>

          )}

          </>

        )}

      </div>



      {/* Modal */}

      {selectedAnimal && (

        <div className="modal-overlay" onClick={handleCloseModal}>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close" onClick={handleCloseModal} aria-label="Close">×</button>



            <section className="modal-profile">

              <div className="modal-profile-image-wrap">

                <img 
                  src={getSafeImageSrc(selectedAnimal)} 
                  alt={selectedAnimal.name} 
                  className="modal-image" 
                  onClick={handleImageClick}
                  style={{ cursor: 'pointer' }}
                  loading="lazy"
                  onError={(e) => handleImageError(e, selectedAnimal)}
                />

              </div>

              <div className="modal-profile-info">

                <h2 className="modal-name">{selectedAnimal.name}</h2>

                <p className="modal-breed">{selectedAnimal.breed}</p>

                <p className="modal-location">

                  <span className="modal-location-icon" aria-hidden>📍</span>

                  {selectedAnimal.location}

                </p>

                <div className="modal-attributes">

                  <span className="modal-attr"><span className="modal-attr-icon" aria-hidden>👤</span>{selectedAnimal.gender}</span>

                  <span className="modal-attr"><span className="modal-attr-icon" aria-hidden>📏</span>{selectedAnimal.size}</span>

                  <span className="modal-attr"><span className="modal-attr-icon" aria-hidden>🎂</span>Age: {selectedAnimal.age}</span>

                </div>

              </div>

            </section>



            <section className="modal-about">

              <h3 className="modal-about-title">About {selectedAnimal.name}</h3>

              <p className="modal-about-desc">{selectedAnimal.description}</p>

              <div className="modal-health-tags">

                <span className="modal-health-tag">

                  <span className="modal-health-icon" aria-hidden>💉</span>

                  {selectedAnimal.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}

                </span>

                <span className="modal-health-tag">

                  <span className="modal-health-icon" aria-hidden>✓</span>

                  {selectedAnimal.neutered ? 'Neutered/Spayed' : 'Not Neutered/Spayed'}

                </span>

              </div>

            </section>



            <footer className="modal-actions">

              <button type="button" className="modal-contact-btn" onClick={handleShowShelterModal}>Contact Shelter</button>

            </footer>

          </div>

        </div>

      )}



      {showAdoptionForm && selectedAnimal && (

        <AdoptionForm animal={selectedAnimal} onClose={handleCloseAdoptionForm} />

      )}



      {showShelterModal && selectedAnimal && (

        <ShelterModal animal={selectedAnimal} onClose={handleCloseShelterModal} />

      )}



      {/* Image Popup */}

      {showImagePopup && selectedAnimal && (

        <div className="image-popup-overlay" onClick={handleCloseImagePopup}>

          <button className="image-popup-close" onClick={handleCloseImagePopup} aria-label="Close">×</button>

          <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>

            <img 
              src={getSafeImageSrc(selectedAnimal)} 
              alt={selectedAnimal.name} 
              className="image-popup-img"
              loading="lazy"
              onError={(e) => handleImageError(e, selectedAnimal)}
            />

          </div>

        </div>

      )}

    </div>

  );

};



export default Adoption;

