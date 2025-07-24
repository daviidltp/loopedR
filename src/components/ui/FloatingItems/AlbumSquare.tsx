import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface AlbumSquareProps {
  album: {
    position: number;
    title: string;
    artist: string;
    imageUrl: string;
    plays: string;
  };
  zIndex: number;
}

export const AlbumSquare: React.FC<AlbumSquareProps> = ({ album, zIndex }) => {
  const getSizeForPosition = (position: number) => {
    const baseSize = 175; // Aumentado de 100 a 150
    const sizeMultiplier = 1 - (position - 1) * 0.25;
    return Math.max(baseSize * sizeMultiplier, 75); // Mínimo aumentado de 60 a 75
  };

  const getBlurForPosition = (position: number) => {
    const blurValues = [0, 2, 4, 6, 8];
    return blurValues[position - 1] || 0;
  };

  const getRotationForPosition = (position: number) => {
    const rotations = [5, -12, 8, -15, 10, -8, 12, -6, 15, -10];
    return rotations[position - 1] || 0;
  };

  const size = getSizeForPosition(album.position);
  const blur = getBlurForPosition(album.position);
  const rotation = getRotationForPosition(album.position);

  return (
    <Image
      source={{ uri: album.imageUrl }}
      style={[
        styles.albumImage,
        {
          width: size,
          height: size,
          borderRadius: 12,
          zIndex,
          transform: [
            { scale: 1 - (album.position - 1) * 0.1 },
            { rotate: `${rotation}deg` },
          ],
        },
      ]}
      blurRadius={blur}
    />
  );
};

const styles = StyleSheet.create({
  albumImage: {
    width: '100%',
    height: '100%',
  },
}); 