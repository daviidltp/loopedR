import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface ArtistCircleProps {
  artist: {
    position: number;
    name: string;
    imageUrl: string;
    plays: string;
  };
  zIndex: number;
}

export const ArtistCircle: React.FC<ArtistCircleProps> = ({ artist, zIndex }) => {
  const getSizeForPosition = (position: number) => {
    const baseSize = 210; // Aumentado de 120 a 180
    const sizeMultiplier = 1 - (position - 1) * 0.35;
    return Math.max(baseSize * sizeMultiplier, 90); // Mínimo aumentado de 60 a 90
  };

  const getBlurForPosition = (position: number) => {
    const blurValues = [0, 2, 4, 6, 8];
    return blurValues[position - 1] || 0;
  };

  const getRotationForPosition = (position: number) => {
    const rotations = [-8, 12, -5, 15, -10, 8, -12, 6, -15, 10];
    return rotations[position - 1] || 0;
  };

  const size = getSizeForPosition(artist.position);
  const blur = getBlurForPosition(artist.position);
  const rotation = getRotationForPosition(artist.position);

  return (
    <Image
      source={{ uri: artist.imageUrl }}
      style={[
        styles.artistImage,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          zIndex,
          transform: [
            { scale: 1 - (artist.position - 1) * 0.1 },
            { rotate: `${rotation * (artist.position - 1)}deg` },
          ],
        },
      ]}
      blurRadius={blur}
    />
  );
};

const styles = StyleSheet.create({
  artistImage: {
    width: '100%',
    height: '100%',
  },
}); 