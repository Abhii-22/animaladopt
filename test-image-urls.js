// Test script to verify image URL construction
const API_BASE_URL = 'http://localhost:5001';
const IMAGE_BASE_URL = 'http://localhost:5001';

// Test image paths from the uploads directory
const testPaths = [
  '/uploads/1759829282965.jpeg',
  '/uploads/1764045201813.jpg',
  'uploads/1771910290131.jpeg',
  'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'
];

function getImageUrl(imagePath) {
  if (!imagePath) {
    return 'placeholder';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle uploaded images that start with /uploads/
  if (imagePath.startsWith('/uploads/')) {
    return `${IMAGE_BASE_URL}${imagePath}`;
  }
  
  // Handle relative paths without leading slash
  if (!imagePath.startsWith('/')) {
    return `${IMAGE_BASE_URL}/${imagePath}`;
  }
  
  // Handle paths with leading slash but not /uploads/
  return `${IMAGE_BASE_URL}${imagePath}`;
}

console.log('Testing image URL construction:');
testPaths.forEach(path => {
  const url = getImageUrl(path);
  console.log(`Path: ${path} -> URL: ${url}`);
});

// Test with sample animal data
const sampleAnimal = {
  name: 'Test Dog',
  image: '/uploads/1759829282965.jpeg'
};

console.log('\nSample animal:');
console.log(`Name: ${sampleAnimal.name}`);
console.log(`Image path: ${sampleAnimal.image}`);
console.log(`Full URL: ${getImageUrl(sampleAnimal.image)}`);
