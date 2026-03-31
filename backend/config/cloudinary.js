const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Check if all required environment variables are set
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('Cloudinary credentials not found. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  module.exports = { cloudinary: null, storage: null };
  return;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// Configure storage for images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'animal-adoption', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    public_id: (req, file) => {
      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}-${timestamp}`;
    }
  }
});

module.exports = { cloudinary, storage };
