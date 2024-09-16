const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Get PHOTOS_PATH from environment variables
const photosDirectory = process.env.PHOTOS_PATH;

// Check if PHOTOS_PATH is defined
if (!photosDirectory) {
  throw new Error('PHOTOS_PATH environment variable is not defined.');
}

// List of directories to process
const directories = [
  '01_gettingready',
  '02_firstlook',
  '03_ceremony',
  '04_reception',
];

// Photo data object
const photoData = { sd: {}, hd: {} };

// Function to get file size in a human-readable format (KB or MB)
const getFileSize = (filePath) => {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;

  if (fileSizeInBytes < 1024) {
    return `${fileSizeInBytes} bytes`;
  } else if (fileSizeInBytes < 1024 * 1024) {
    return `${(fileSizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(fileSizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};

// Function to generate photo data for SD and HD
const generatePhotoData = (quality) => {
  const basePath = path.join(photosDirectory, quality);

  directories.forEach((dir) => {
    const dirPath = path.join(basePath, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file.toLowerCase()));

      photoData[quality][dir] = files.map((file) => {
        const filePath = path.join(dirPath, file);
        const dimensions = sizeOf(filePath);
        const size = getFileSize(filePath);

        return {
          src: `/api/photos/${quality}/${dir}/${file}`,
          width: dimensions.width,
          height: dimensions.height,
          size,
        };
      });
    } else {
      console.error(`Directory not found: ${dirPath}`);
    }
  });
};

// Generate photo data for both SD and HD
generatePhotoData('sd');
generatePhotoData('hd');

// Write the photo data to `photos.js`
fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'photos.js'),
  `export const photos = ${JSON.stringify(photoData, null, 2)};`
);

console.log('Photo data generated.');
