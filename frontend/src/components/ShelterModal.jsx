import React from 'react';
import './ShelterModal.css';

const ShelterModal = ({ animal, onClose }) => {
  if (!animal) return null;

  return (
    <div className="shelter-modal-overlay" onClick={onClose}>
      <div className="shelter-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Shelter Information</h2>
          <button className="shelter-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="shelter-details">
          <p className="shelter-name">{animal.shelter || 'Happy Paws Shelter'}</p>
          <div className="contact-info">
            <p><span className="icon">📍</span>{animal.location}</p>
            <p><span className="icon">📧</span>{animal.contact || 'contact@happypaws.com'}</p>
            <p><span className="icon">📞</span>{animal.phone || '123-456-7890'}</p>
          </div>
          <p className="footer-note">Please contact the shelter to know more about {animal.name}.</p>
        </div>
      </div>
    </div>
  );
};

export default ShelterModal;
