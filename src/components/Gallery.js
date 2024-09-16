'use client';

import React, { useState, useRef } from 'react';
import PhotoAlbum from "react-photo-album"; // Use the aggregate component
import "react-photo-album/styles.css"; // Import the necessary CSS for the layout
import Lightbox from 'yet-another-react-lightbox'; // Correct Lightbox import
import 'yet-another-react-lightbox/styles.css'; // Lightbox CSS
import { Thumbnails, Fullscreen, Zoom } from 'yet-another-react-lightbox/plugins'; // Correct plugin import
import 'yet-another-react-lightbox/plugins/thumbnails.css'; // Thumbnails CSS
import { photos } from '../data/photos';
import DownloadIcon from '@mui/icons-material/Download';

const PhotoGallery = () => {
  const allPhotosSD = Object.values(photos['sd']).flat();
  const allPhotosHD = Object.values(photos['hd']).flat();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const downloadFile = (quality) => {
    const selectedPhoto = quality === 'hd' ? allPhotosHD[photoIndex] : allPhotosSD[photoIndex];
    const fileExtension = selectedPhoto.src.split('.').pop(); // Get the file extension (jpg, png, etc.)
    const originalFilename = selectedPhoto.src.split('/').pop().split('.')[0]; // Extract the original filename

    const link = document.createElement('a');
    link.href = selectedPhoto.src;
    link.download = `${originalFilename}-${quality.toUpperCase()}.${fileExtension}`; // Set the new filename with -SD or -HD
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
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
          open={isOpen}
          close={() => {
            setIsOpen(false);
            setShowMenu(false);
          }}
          slides={allPhotosSD.map(photo => ({
            src: photo.src,
          }))}
          index={photoIndex}
          on={{
            view: ({ index: currentIndex }) => {
              setPhotoIndex(currentIndex);
            },
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
                  <DownloadIcon />
                </button>

                {/* Dropdown Menu */}
                {
                  showMenu && (
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
                        style={{
                          background: 'none',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          // fontSize: '16px', // Adjusted font size
                          // fontWeight: 'bold', // Makes the "Download SD" text bold
                          textAlign: 'left', // Aligns the text to the left
                        }}
                        onClick={() => downloadFile('sd')}
                      >
                        Download SD{' '}
                        <span
                          style={{
                            // fontSize: '14px', // Slightly smaller for the size info
                            // fontWeight: 'normal',
                            color: '#bbb', // Lighter color for the size info
                          }}
                        >
                          ({allPhotosSD[photoIndex].size})
                        </span>
                      </button>
                      <button
                        style={{
                          background: 'none',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          // fontSize: '16px',
                          // fontWeight: 'bold',
                          textAlign: 'left',
                        }}
                        onClick={() => downloadFile('hd')}
                      >
                        Download HD{' '}
                        <span
                          style={{
                            // fontSize: '14px',
                            // fontWeight: 'normal',
                            color: '#bbb',
                          }}
                        >
                          ({allPhotosHD[photoIndex].size})
                        </span>
                      </button>
                    </div>
                  )
                }

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
