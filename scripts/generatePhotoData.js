const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

// List of directories to process
const directories = [
  '01_gettingready',
  '02_firstlook',
  '03_ceremony',
  '04_reception',
];

// Paths for SD and HD versions
const basePaths = {
  sd: path.join(__dirname, '..', 'public', 'photos', 'sd'),
  hd: path.join(__dirname, '..', 'public', 'photos', 'hd'),
};

const photoData = { sd: {}, hd: {} };

// Function to get file size in a human-readable format (KB or MB)
const getFileSize = (filePath) => {
  const stats = fs.statSync(filePath); // Get file stats
  const fileSizeInBytes = stats.size;

  // Convert bytes to human-readable format (KB/MB)
  if (fileSizeInBytes < 1024) {
    return `${fileSizeInBytes} bytes`;
  } else if (fileSizeInBytes < 1024 * 1024) {
    return `${(fileSizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(fileSizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};

// Function to generate photo data for SD and HD
const generatePhotoData = (quality, basePath) => {
  directories.forEach((dir) => {
    const dirPath = path.join(basePath, dir);
    const files = fs.readdirSync(dirPath).filter((file) => {
      return /\.(jpg|jpeg|png|gif)$/.test(file.toLowerCase());
    });

    photoData[quality][dir] = files.map((file) => {
      const filePath = path.join(dirPath, file);
      const dimensions = sizeOf(filePath); // Get image dimensions
      const size = getFileSize(filePath); // Get image file size
      return {
        src: `/photos/${quality}/${dir}/${file}`, // Include SD or HD in the path
        width: dimensions.width,
        height: dimensions.height,
        size, // Include the file size in the data
      };
    });
  });
};

// Generate data for both SD and HD
generatePhotoData('sd', basePaths.sd);
generatePhotoData('hd', basePaths.hd);

// Write the combined photo data to photos.js
fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'photos.js'),
  `export const photos = ${JSON.stringify(photoData, null, 2)};`
);

console.log('Photo data generated.');
