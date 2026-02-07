import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCamera, FaSignOutAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import API_BASE_URL from '../../config/api';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, signout } = useAuth();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    profilePhoto: null,
  });
  
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  // Load user data and pets
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setUser({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          profilePhoto: currentUser.profilePhoto || null,
        });
        setFormData({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          profilePhoto: currentUser.profilePhoto || null,
        });

        // Fetch user's pets
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token found');
            setLoading(false);
            return;
          }

          const response = await fetch(`${API_BASE_URL}/api/animals/my-pets`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setPets(data.data?.animals || []);
          } else {
            console.error('Failed to fetch pets:', await response.text());
          }
        } catch (error) {
          console.error('Error fetching pets:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);


  // Handle file selection for profile photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile photo upload
  const handlePhotoUpload = () => {
    // TODO: Implement actual file upload to server
    if (selectedFile) {
      // Simulate upload
      setTimeout(() => {
        setUser(prev => ({
          ...prev,
          profilePhoto: preview
        }));
        setSelectedFile(null);
        alert('Profile photo updated successfully!');
      }, 1000);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Update user data on the server
    setUser(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  // Handle pet deletion
  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to remove this pet?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/animals/${petId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setPets(pets.filter(pet => pet._id !== petId));
          alert('Pet removed successfully!');
        } else {
          const errorData = await response.json();
          alert('Failed to remove pet: ' + errorData.message);
        }
      } catch (error) {
        console.error('Error deleting pet:', error);
        alert('Error removing pet. Please try again.');
      }
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    signout();
    navigate('/signin');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo-container">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder">
              <FaUser size={40} />
            </div>
          )}
          <div className="photo-upload">
            <input
              type="file"
              id="profile-photo"
              accept="image/*"
              onChange={handleFileChange}
              className="photo-upload-input"
            />
            <label htmlFor="profile-photo" className="upload-button">
              <FaCamera /> Change Photo
            </label>
            {selectedFile && (
              <button onClick={handlePhotoUpload} className="save-photo-button">
                Save Photo
              </button>
            )}
          </div>
        </div>
        
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="edit-profile-button"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <button onClick={handleSignOut} className="sign-out-button">
          <FaSignOutAlt /> Sign Out
        </button>
      </div>

      {isEditing ? (
        <div className="edit-profile-form">
          <h3>Edit Profile</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email (Cannot be changed)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                disabled
                className="disabled-input"
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small className="form-hint">Email cannot be changed for security reasons</small>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value="••••••••"
                readOnly
                disabled
                className="disabled-input"
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small className="form-hint">Password cannot be changed here. Contact support if you need to change it.</small>
            </div>
            <button type="submit" className="save-button">Save Changes</button>
          </form>
        </div>
      ) : (
        <div className="pets-section">
          <div className="section-header">
            <h3>My Pets</h3>
            <div className="adoption-reminder">
              <p><strong>Important Reminder</strong></p>
              <p>Please remove pets that have been adopted to keep the platform organized and prevent unnecessary calls from potential adopters. <FaTrash className="trash-icon" /> Click the trash icon next to a pet's image to remove it.</p>
            </div>
            <button 
              className="add-pet-button"
              onClick={() => navigate('/upload')}
            >
              <FaPlus /> Upload your pet
            </button>
          </div>
          
          {loading ? (
            <div className="loading-pets">
              <p>Loading your pets...</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="no-pets">
              <p>You haven't added any pets yet.</p>
              <button 
                className="add-pet-button"
                onClick={() => navigate('/upload')}
              >
                <FaPlus /> Upload your first pet
              </button>
            </div>
          ) : (
            <div className="pets-grid">
              {pets.map((pet) => (
                <div key={pet._id} className="pet-card">
                  <div className="pet-actions">
                    <button className="icon-button" title="Edit">
                      <FaEdit />
                    </button>
                    <button 
                      className="icon-button delete" 
                      title="Remove"
                      onClick={() => handleDeletePet(pet._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="pet-image">
                    <img 
                      src={pet.image.startsWith('http') ? pet.image : `${API_BASE_URL}/${pet.image.replace(/^[/]+/, '')}`} 
                      alt={pet.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="pet-info">
                    <h4>{pet.name}</h4>
                    <p>{pet.type} • {pet.age}</p>
                    <p>{pet.breed} • {pet.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
