'use client';

import React, { useState, useRef, useCallback } from 'react';
import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Thumbnails, Fullscreen, Zoom } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { photos } from '../data/photos'; // This now points to your generated photo data
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const PhotoGallery = () => {
  const allPhotosSD = Object.values(photos['sd']).flat();
  const allPhotosHD = Object.values(photos['hd']).flat();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  // Open Lightbox function using useCallback to avoid unnecessary re-renders
  const openLightbox = useCallback((index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  }, []);

  // Download file function with dynamic quality handling
  const downloadFile = useCallback((quality) => {
    const selectedPhoto = quality === 'hd' ? allPhotosHD[photoIndex] : allPhotosSD[photoIndex];
    const fileExtension = selectedPhoto.src.split('.').pop();
    const originalFilename = selectedPhoto.src.split('/').pop().split('.')[0];

    const link = document.createElement('a');
    link.href = selectedPhoto.src; // Use the API-based src
    link.download = `${originalFilename}-${quality.toUpperCase()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [photoIndex, allPhotosSD, allPhotosHD]);

  // Handle mouse enter and leave for the download menu
  const handleMouseEnter = useCallback(() => {
    setShowMenu(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowMenu(false);
  }, []);

  // Handle Lightbox close
  const handleLightboxClose = useCallback(() => {
    setIsOpen(false);
    setShowMenu(false); // Close menu when lightbox is closed
  }, []);

  // Handle lightbox view changes
  const handleView = useCallback(({ index: currentIndex }) => {
    setPhotoIndex(currentIndex);
    setShowMenu(false); // Close the menu when navigating left or right
  }, [setPhotoIndex, setShowMenu]);

  return (
    <div>
      <PhotoAlbum
        layout="rows"
        photos={allPhotosSD}
        targetRowHeight={300}
        spacing={10}
        onClick={({ index }) => openLightbox(index)}
      />

      {isOpen && (
        <Lightbox
          open={isOpen}
          close={handleLightboxClose}
          slides={allPhotosSD.map(photo => ({
            src: photo.src,
          }))}
          index={photoIndex}
          on={{
            view: handleView,
          }}
          plugins={[Thumbnails, Fullscreen, Zoom]}
          toolbar={{
            buttons: [
              <div
                key="download"
                className="yarl__button"
                style={{ position: 'relative' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Download button */}
                <button
                  type="button"
                  aria-label="Download"
                  className="yarl__button"
                >
                  <FontAwesomeIcon icon={faDownload} size="lg" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div
                    ref={menuRef}
                    style={{
                      position: 'absolute',
                      top: '30px',
                      right: '0px',
                      zIndex: '10000',
                      backgroundColor: '#333',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '5px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      minWidth: '180px',
                    }}
                  >
                    <button
                      style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      onClick={() => downloadFile('sd')}
                    >
                      Download SD ({allPhotosSD[photoIndex].size})
                    </button>
                    <button
                      style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      onClick={() => downloadFile('hd')}
                    >
                      Download HD ({allPhotosHD[photoIndex].size})
                    </button>
                  </div>
                )}
              </div>,
              "zoom",
              "fullscreen",
              "close",
            ],
          }}
        />
      )}
    </div>
  );
};

export default PhotoGallery;
