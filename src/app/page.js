import React from 'react';
import PhotoGallery from '../components/Gallery';

const HomePage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1
        style={{
          textAlign: 'center',
          fontFamily: 'serif',
          marginBottom: '40px',
        }}
      >
        Our Wedding Memories
      </h1>
      <PhotoGallery />
    </div>
  );
};

export default HomePage;