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
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || animal.type === filterType;
    return matchesSearch && matchesFilter;
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
        {filteredAnimals.map((animal) => (
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
        ))}
      </div>

      {/* Modal */}
      {selectedAnimal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <div className="modal-header">
                            <img src={getImageUrl(selectedAnimal.image)} alt={selectedAnimal.name} className="modal-image" />
              <div className="modal-info">
                <h2>{selectedAnimal.name}</h2>
                <p className="modal-breed">{selectedAnimal.breed}</p>
                <div className="modal-meta">
                  <span>📍 {selectedAnimal.location}</span>
                  <span>👤 {selectedAnimal.gender}</span>
                  <span>📏 {selectedAnimal.size}</span>
                  <span>🎂 {selectedAnimal.age}</span>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <h3>About {selectedAnimal.name}</h3>
              <p>{selectedAnimal.description}</p>
              <div className="modal-features">
                <div className="feature-item">
                  <span className="feature-icon">💉</span>
                  <span>{selectedAnimal.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>{selectedAnimal.neutered ? 'Neutered/Spayed' : 'Not Neutered/Spayed'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-adopt-btn" onClick={handleShowAdoptionForm}>
                <span className="btn-icon">❤️</span>
                Adopt {selectedAnimal.name}
              </button>
              <button className="modal-contact-btn" onClick={handleShowShelterModal}>Contact Shelter</button>
            </div>
          </div>
        </div>
      )}

      {showAdoptionForm && selectedAnimal && (
        <AdoptionForm animal={selectedAnimal} onClose={handleCloseAdoptionForm} />
      )}

      {showShelterModal && selectedAnimal && (
        <ShelterModal animal={selectedAnimal} onClose={handleCloseShelterModal} />
      )}
    </div>
  );
};

export default Adoption;
