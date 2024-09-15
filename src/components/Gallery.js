'use client'; // Add this line

import React, { useState } from 'react';
import PhotoAlbum from "react-photo-album"; // Use the aggregate component
import "react-photo-album/styles.css"; // Import the necessary CSS for the layout
import Lightbox from 'yet-another-react-lightbox'; // Correct Lightbox import
import 'yet-another-react-lightbox/styles.css'; // Lightbox CSS
import { Thumbnails, Fullscreen, Zoom, Download } from 'yet-another-react-lightbox/plugins'; // Correct plugin import
import 'yet-another-react-lightbox/plugins/thumbnails.css'; // Thumbnails CSS
import { photos } from '../data/photos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'; // Import icons

const PhotoGallery = () => {
  const allPhotos = Object.values(photos).flat();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <div>
      <PhotoAlbum
        layout="rows"
        photos={allPhotos}
        targetRowHeight={300} // Increased target row height for larger images
        spacing={10} // Adjust the spacing between images
        onClick={({ index }) => openLightbox(index)} // Lightbox opening logic here
      />
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={allPhotos.map(photo => ({
            src: photo.src,
            download: true, // Enable download for each image
          }))}
          index={photoIndex}
          plugins={[Thumbnails, Fullscreen, Zoom, Download]} // Enable the Download and Thumbnails plugin
          onIndexChange={setPhotoIndex} // Keep track of current photo index
          render={{
            buttonPrev: () => (
              <button
                type="button"
                aria-label="Previous"
                style={{
                  background: 'none',
                  border: 'none',
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '30px',
                  transform: 'translateY(-50%)',
                }}
                onClick={() => setPhotoIndex((photoIndex + allPhotos.length - 1) % allPhotos.length)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            ),
            buttonNext: () => (
              <button
                type="button"
                aria-label="Next"
                style={{
                  background: 'none',
                  border: 'none',
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '30px',
                  transform: 'translateY(-50%)',
                }}
                onClick={() => setPhotoIndex((photoIndex + 1) % allPhotos.length)}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            ),
          }}
        />
      )}
    </div>
  );
};

export default PhotoGallery;
