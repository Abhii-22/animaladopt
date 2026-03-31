// Simple test script to verify image loading
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

console.log('Checking uploads directory...');
console.log('Path:', uploadsDir);

if (fs.existsSync(uploadsDir)) {
  const files = fs.readdirSync(uploadsDir);
  console.log(`Found ${files.length} files in uploads directory:`);
  files.slice(0, 5).forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} (${stats.size} bytes)`);
  });
  
  if (files.length > 5) {
    console.log(`... and ${files.length - 5} more files`);
  }
} else {
  console.log('Uploads directory does not exist!');
}
