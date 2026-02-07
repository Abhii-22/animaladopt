import React, { useState } from 'react';
import API_BASE_URL from '../config/api';
import './AdoptionForm.css';

const AdoptionForm = ({ animal, onClose }) => {
  const [formData, setFormData] = useState({
    animalName: animal.name,
    type: animal.type,
    breed: animal.breed,
    vaccinated: animal.vaccinated ? 'Yes' : 'No',
    price: animal.price,
    phone: '',
    email: '',
    paymentMethod: 'cash'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/adoptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to get more specific error from backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong with the adoption request.');
      }

      console.log('Adoption form submitted:', formData);
      alert('Thank you for your adoption request! Your application has been submitted successfully.');
      onClose();
    } catch (error) {
      console.error('Failed to submit adoption form:', error);
      alert(`Failed to submit adoption request: ${error.message}`);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  return (
    <div className="adoption-form-modal-overlay" onClick={onClose}>
      <div className="adoption-form-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="animal-image-container">
          <img 
            src={getImageUrl(animal.image)} 
            alt={animal.name} 
            className="animal-form-image" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }} 
          />
        </div>
        <div className="form-fields-container">
          <h2>Adoption Form for {animal.name}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <span className="icon">🐾</span>
              <label>Animal Name</label>
              <input type="text" name="animalName" value={formData.animalName} readOnly />
            </div>
            <div className="form-group">
              <span className="icon">💉</span>
              <label>Vaccinated</label>
              <input type="text" name="vaccinated" value={formData.vaccinated} readOnly />
            </div>
            <div className="form-group">
              <span className="icon">₹</span>
              <label>Adoption Fee</label>
              <input type="text" name="price" value={`₹${formData.price}`} readOnly />
            </div>
            <div className="form-group">
              <span className="icon">📱</span>
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <span className="icon">✉️</span>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleChange} />
                  Cash on Delivery
                </label>
                <label>
                  <input type="radio" name="paymentMethod" value="online" checked={formData.paymentMethod === 'online'} onChange={handleChange} />
                  Online Payment
                </label>
              </div>
            </div>
            <button type="submit" className="submit-btn">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdoptionForm;
