'use client';

import React, { useState, useRef } from 'react';
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

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const downloadFile = (quality) => {
    const selectedPhoto = quality === 'hd' ? allPhotosHD[photoIndex] : allPhotosSD[photoIndex];
    const fileExtension = selectedPhoto.src.split('.').pop();
    const originalFilename = selectedPhoto.src.split('/').pop().split('.')[0];

    const link = document.createElement('a');
    link.href = selectedPhoto.src; // Use the API-based src
    link.download = `${originalFilename}-${quality.toUpperCase()}.${fileExtension}`;
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
