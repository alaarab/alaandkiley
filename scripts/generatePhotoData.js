// scripts/generatePhotoData.js

const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const directories = [
  '01_gettingready',
  '02_firstlook',
  '03_ceremony',
  '04_reception',
];

const photoData = {};

directories.forEach((dir) => {
  const dirPath = path.join(__dirname, '..', 'public', 'photos', dir);
  const files = fs.readdirSync(dirPath).filter((file) => {
    return /\.(jpg|jpeg|png|gif)$/.test(file.toLowerCase());
  });

  photoData[dir] = files.map((file) => {
    const filePath = path.join(dirPath, file);
    const dimensions = sizeOf(filePath);
    return {
      src: `/photos/${dir}/${file}`,
      width: dimensions.width,
      height: dimensions.height,
    };
  });
});

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'photos.js'),
  `export const photos = ${JSON.stringify(photoData, null, 2)};`
);
