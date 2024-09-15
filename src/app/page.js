import React from 'react';
import PhotoGallery from '../components/Gallery';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Image
          src="/photos/logo.png" // Replace with the correct path to your logo
          alt="Our Wedding Memories"
          width={100} // Set the desired width for the image
          height={100} // Set the desired height for the image
        />
      </div>
      <PhotoGallery />
      <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px 0', fontSize: '16px', color: '#555' }}>
        <hr style={{ margin: '20px 0', borderColor: '#ddd' }} />
        <p>July 13, 2024</p>
      </footer>
    </div>
  );
};

export default HomePage;