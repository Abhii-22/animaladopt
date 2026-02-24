import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import './Upload.css';

const Upload = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    breed: '',
    type: 'Dog',
    location: '',
    gender: 'Male',
    size: 'Medium',
    description: '',
    price: '',
    phone: '',
    email: '',
    vaccinated: false,
    neutered: false,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image' && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to upload a pet');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/animals/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        setSuccessMessage('Animal uploaded successfully!');
        // Clear the form
        setFormData({
          name: '',
          age: '',
          breed: '',
          type: 'Dog',
          location: '',
          gender: 'Male',
          size: 'Medium',
          description: '',
          price: '',
          phone: '',
          email: '',
          vaccinated: false,
          neutered: false,
          image: null,
        });
        setImagePreview(null);
        setError(null);
      } else if (response.status === 401) {
        // Token is invalid or user no longer exists
        console.error('Authentication failed - clearing local storage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload animal. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while uploading. Please check your connection and try again.');
    }
  };

  return (
    <div className="upload-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <h2>Upload Your Pet for Adoption</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group form-group-half">
            <label htmlFor="age">Age (Years)</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="breed">Breed</label>
            <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} />
          </div>
          <div className="form-group form-group-half">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange}>
              <option>Dog</option>
              <option>Cat</option>
              <option>Farm</option>
              <option>Bird</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
        </div>

        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="form-group form-group-half">
            <label htmlFor="size">Size</label>
            <select id="size" name="size" value={formData.size} onChange={handleChange}>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="price">Adoption Fee (₹)</label>
            <input 
              type="text" 
              id="price" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              placeholder="e.g., 455555"
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
          <div className="form-group form-group-half">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" name="vaccinated" checked={formData.vaccinated} onChange={handleChange} />
            Vaccinated
          </label>
          <label>
            <input type="checkbox" name="neutered" checked={formData.neutered} onChange={handleChange} />
            Neutered
          </label>
        </div>

        <div className="form-group">
          <label>Image</label>
          <div 
            className="file-upload-area"
            onClick={() => document.getElementById('image').click()}
          >
            <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
            <div className="upload-icon">📷</div>
            <p>Click to browse or drag and drop your image here</p>
          </div>
        </div>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Pet Preview" />
          </div>
        )}

        <button type="submit" className="submit-button">Submit for Adoption</button>
      </form>
    </div>
  );
};

export default Upload;
