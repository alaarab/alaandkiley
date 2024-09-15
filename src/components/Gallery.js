
'use client'; // Add this line
import React, { useState } from 'react';
import Gallery from 'react-photo-gallery';
import Photo from './Photo';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { photos } from '../data/photos';
import Lightbox from 'react-image-lightbox';

const PhotoGallery = () => {
  const allPhotos = Object.values(photos).flat();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = (event, { index }) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <div>
      <Gallery photos={allPhotos} onClick={openLightbox} />
      {isOpen && (
        <Lightbox
          mainSrc={allPhotos[photoIndex].src}
          nextSrc={allPhotos[(photoIndex + 1) % allPhotos.length].src}
          prevSrc={allPhotos[(photoIndex + allPhotos.length - 1) % allPhotos.length].src}
          imageTitle={`Image ${photoIndex + 1}`}
          imageCaption={`Dimensions: ${allPhotos[photoIndex].width} x ${allPhotos[photoIndex].height}`}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + allPhotos.length - 1) % allPhotos.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % allPhotos.length)
          }
        />
      )}
    </div>
  );
};

export default PhotoGallery;