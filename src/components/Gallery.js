
'use client'; // Add this line
import React from 'react';
import Gallery from 'react-photo-gallery';
import Photo from './Photo';
import { photos } from '../data/photos';

const PhotoGallery = () => {
  const allPhotos = Object.values(photos).flat();

  return (
    <Gallery
      photos={allPhotos}
      margin={5}
      renderImage={Photo}
    />
  );
};

export default PhotoGallery;