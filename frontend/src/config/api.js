// API Configuration

const API_BASE_URL = process.env.NODE_ENV === 'production' 

  ? 'https://animaladopt-2.onrender.com' 

  : 'http://localhost:5001';



// Image URL Configuration with fallback for production

const IMAGE_BASE_URL = process.env.NODE_ENV === 'production' 

  ? 'https://animaladopt-2.onrender.com' 

  : 'http://localhost:5001';



// Fallback image service for production when images aren't available
const FALLBACK_IMAGE_SERVICE = 'https://picsum.photos/seed/animal/300/200.jpg';



export default API_BASE_URL;

export { IMAGE_BASE_URL, FALLBACK_IMAGE_SERVICE };

