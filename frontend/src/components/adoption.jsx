import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import API_BASE_URL from '../config/api';

import './adoption.css';

import AdoptionForm from './AdoptionForm';

import ShelterModal from './ShelterModal';





const Adoption = () => {

  const navigate = useNavigate();

  const [animals, setAnimals] = useState([]);

  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const [showAdoptionForm, setShowAdoptionForm] = useState(false);

  const [showShelterModal, setShowShelterModal] = useState(false);

  const [showImagePopup, setShowImagePopup] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [locationTerm, setLocationTerm] = useState('');

  const [filterType, setFilterType] = useState('all');



  useEffect(() => {

    fetch(`${API_BASE_URL}/api/animals`)

      .then(response => response.json())

      .then(data => {

        console.log('Animals data received:', data);

        setAnimals(data);

      })

      .catch(error => console.error('Error fetching animals:', error));

  }, []);



  const normalizeText = (text = '') =>

    text.toLowerCase().replace(/[^a-z0-9]/g, '');



  const isFuzzyMatch = (source = '', query = '') => {

    const src = normalizeText(source);

    const q = normalizeText(query);



    if (!q) return true;



    if (src.includes(q)) return true;



    // Simple Levenshtein distance for short strings

    const len1 = src.length;

    const len2 = q.length;

    if (!len1 || !len2) return false;



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

  };



  const filteredAnimals = animals.filter(animal => {

    const matchesSearch =

      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

      animal.breed.toLowerCase().includes(searchTerm.toLowerCase());



    const matchesLocation = isFuzzyMatch(animal.location, locationTerm);



    const matchesFilter =

      filterType === 'all' ||

      animal.type?.toLowerCase() === filterType.toLowerCase();



    return matchesSearch && matchesLocation && matchesFilter;

  });



  const getImageUrl = (imagePath) => {

    if (!imagePath) return ''; // or a placeholder image

    if (imagePath.startsWith('http')) {

      return imagePath;

    }

    // Convert backslashes to forward slashes and remove leading slash if present

    const normalizedPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');

    const fullUrl = `${API_BASE_URL}/${normalizedPath}`;

    console.log('Image path:', imagePath, '-> Normalized:', normalizedPath, '-> Full URL:', fullUrl);

    return fullUrl;

  };



  const handleAdoptClick = (animal) => {

    setSelectedAnimal(animal);

  };



  const handleCloseModal = () => {

    setSelectedAnimal(null);

  };



  const handleShowAdoptionForm = () => {

    setShowAdoptionForm(true);

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

            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}

            onClick={() => setFilterType('all')}

          >

            All

          </button>

          <button 

            className={`filter-btn ${filterType === 'dog' ? 'active' : ''}`}

            onClick={() => setFilterType('dog')}

          >

            Dogs

          </button>

          <button 

            className={`filter-btn ${filterType === 'cat' ? 'active' : ''}`}

            onClick={() => setFilterType('cat')}

          >

            Cats

          </button>

          <button 

            className={`filter-btn ${filterType === 'farm' ? 'active' : ''}`}

            onClick={() => setFilterType('farm')}

          >

            Farm

          </button>

          <button 

            className={`filter-btn ${filterType === 'bird' ? 'active' : ''}`}

            onClick={() => setFilterType('bird')}

          >

            Birds

          </button>

        </div>

      </div>



      {/* Animals Grid */}

      <div className="animals-grid">

        {filteredAnimals.length === 0 ? (

          <div className="no-animals-message">

            <p>No animals found matching your filter criteria.</p>

          </div>

        ) : (

          filteredAnimals.map((animal) => (

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

                              src={getImageUrl(animal.image)} 

                              alt={animal.name}

                              onError={(e) => {

                                console.error('Image failed to load:', getImageUrl(animal.image));

                                e.target.onerror = null;

                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';

                              }}

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

                <p className="animal-age">{animal.age}</p>

                <p className="animal-description">{animal.description}</p>

                <p className="animal-price">Adoption Fee: ₹{animal.price}</p>

              </div>

              <button className="adopt-btn" onClick={() => handleAdoptClick(animal)}>

                <span className="btn-icon">❤️</span>

                Adopt Now

              </button>

            </div>

          </div>

          ))

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

                  src={getImageUrl(selectedAnimal.image)} 

                  alt={selectedAnimal.name} 

                  className="modal-image" 

                  onClick={handleImageClick}

                  style={{ cursor: 'pointer' }}

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

                  <span className="modal-attr"><span className="modal-attr-icon" aria-hidden>🎂</span>{selectedAnimal.age}</span>

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

              src={getImageUrl(selectedAnimal.image)} 

              alt={selectedAnimal.name} 

              className="image-popup-img"

            />

          </div>

        </div>

      )}

    </div>

  );

};



export default Adoption;

