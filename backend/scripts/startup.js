const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created at:', uploadsDir);
} else {
  console.log('Uploads directory already exists at:', uploadsDir);
}

// Set proper permissions
try {
  fs.chmodSync(uploadsDir, 0o755);
  console.log('Set proper permissions for uploads directory');
} catch (error) {
  console.warn('Could not set permissions for uploads directory:', error.message);
}

console.log('Startup script completed successfully');
