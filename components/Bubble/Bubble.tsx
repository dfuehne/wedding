// src/components/Bubble/Bubble.tsx (or wherever it is)
'use client';

<<<<<<< HEAD
import React, { useEffect, useRef, useState } from 'react';
import styles from './BubblingPhotoGallery.module.css';
import { fisherYatesShuffle } from '../../lib/shuffle'; // Assuming this path is correct
=======
import React, { useState, useEffect, useRef } from 'react';
import { fisherYatesShuffle } from '../../lib/shuffle'; // Assuming this path is correct
import styles from './BubblingPhotoGallery.module.css';
>>>>>>> 6ef141151146df4d1386e303b8afcab1869007ec

// Define the shape of the photo prop
interface Photo {
  url: string;
}

interface BubbleProps {
  photos: Photo[];
}

export default function Bubble({ photos }: BubbleProps) {
    if (!photos || photos.length === 0) {
        return null;
    }
    const initialIndices = Array.from(Array(photos.length).keys());
    const [photoSizes, setPhotoSizes] = useState(Array(photos.length).fill('normal'));
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const shuffledIndicesRef = useRef(fisherYatesShuffle([...initialIndices]));
    const currentIndexRef = useRef(0);

    useEffect(() => {
        if (photos.length === 0) return;

        const interval = setInterval(() => {
            if (hoveredIndex !== null) return; // Pause animation if hovering

            setPhotoSizes(() => {
                const newSizes = Array(photos.length).fill('normal');
                newSizes[shuffledIndicesRef.current[currentIndexRef.current]] = 'large';
                return newSizes;
            });

            currentIndexRef.current += 1;
            if (currentIndexRef.current >= photos.length) {
                shuffledIndicesRef.current = fisherYatesShuffle([...initialIndices]);
                currentIndexRef.current = 0;
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [photos.length, hoveredIndex]);

    // Update photoSizes immediately on hover
    useEffect(() => {
        if (hoveredIndex !== null) {
            setPhotoSizes(() => {
                const newSizes = Array(photos.length).fill('normal');
                newSizes[hoveredIndex] = 'large';
                return newSizes;
            });
        }
    }, [hoveredIndex, photos.length]);

    return (
        <div className={styles.gallery}>
            {photos.map((photo, index) => (
                <div
                    key={index}
                    className={`${styles.photo} ${photoSizes[index] === 'large' ? styles.large : styles.normal}`}
                    style={{ backgroundImage: `url(${photo.url})` }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                />
            ))}
        </div>
    );
}
