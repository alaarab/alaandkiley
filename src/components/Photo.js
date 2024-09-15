// src/components/Photo.js

'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Gallery.module.css';

const Photo = ({ index, photo, margin }) => {
  return (
    <div
      style={{ margin }}
      className={styles.gallery}
    >
      <a href={photo.src} download>
        <Image
          src={photo.src}
          alt=""
          width={photo.width}
          height={photo.height}
          placeholder="blur"
          blurDataURL={photo.src}
          style={{ width: '100%', height: 'auto' }}
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
        />
      </a>
    </div>
  );
};

export default Photo;
