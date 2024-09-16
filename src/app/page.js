import React from 'react';
import PhotoGallery from '../components/Gallery';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Image
          src="/logo.png" // Replace with the correct path to your logo
          alt="Our Wedding Memories"
          width={100} // Set the desired width for the image
          height={100} // Set the desired height for the image
        />
      </div>
      <PhotoGallery />
    </div>
  );
};

export default HomePage;