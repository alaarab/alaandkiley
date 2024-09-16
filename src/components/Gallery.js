'use client';

import React, { useState, useRef, useCallback } from 'react';
import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Thumbnails, Fullscreen, Zoom } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { photos } from '../data/photos'; // This now points to your generated photo data
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';

const PhotoGallery = () => {
  const allPhotosSD = Object.values(photos['sd']).flat();
  const allPhotosHD = Object.values(photos['hd']).flat();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const lightboxRef = useRef(null); // Reference to the Lightbox container

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

  // Handle menu open/close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Correctly reference the clicked button
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle Lightbox close
  const handleLightboxClose = () => {
    setIsOpen(false);
    handleMenuClose(); // Close the menu when lightbox is closed
  };

  // Handle lightbox view changes
  const handleView = ({ index: currentIndex }) => {
    setPhotoIndex(currentIndex);
    handleMenuClose(); // Close the menu when navigating left or right
  };

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
          ref={lightboxRef} // Add a reference to the Lightbox
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
              <>
                <IconButton
                  key="download"
                  aria-label="Download"
                  onClick={handleMenuOpen}
                  size="large"
                  style={{ color: 'grey' }}  // Change icon color to grey
                >
                  <DownloadIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl} // Tie to the clicked button
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  disablePortal // Prevents the Menu from rendering in the document body
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',  // Adjust based on the layout of your toolbar
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',  // Adjust based on the layout of your toolbar
                  }}
                >
                  <MenuItem onClick={() => downloadFile('sd')}>
                    Download SD ({allPhotosSD[photoIndex].size})
                  </MenuItem>
                  <MenuItem onClick={() => downloadFile('hd')}>
                    Download HD ({allPhotosHD[photoIndex].size})
                  </MenuItem>
                </Menu>
              </>,
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
