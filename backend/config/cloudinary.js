const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name', // You'll need to set this
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key', // You'll need to set this
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret' // You'll need to set this
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
