// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://animaladopt-2.onrender.com' 
  : 'http://localhost:5001';

// Image URL Configuration (always use local backend for development)
const IMAGE_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://animaladopt-2.onrender.com' 
  : 'http://localhost:5001';

export default API_BASE_URL;
export { IMAGE_BASE_URL };
