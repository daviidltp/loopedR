import React from 'react';
import { Image, ImageStyle, StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';

export interface Song {
  position: number;
  title: string;
  artist: string;
  plays: string;
  albumCover: string;
}

interface SongCoverProps {
  song: Song;
  size?: number;
  style?: ImageStyle;
}

export const SongCover: React.FC<SongCoverProps> = ({ song, size = 50, style }) => {
  return (
    <View style={[styles.coverContainer, { width: size, height: size }, style]}>
      <Image
        source={{ uri: song.albumCover }}
        style={[styles.cover, { width: size, height: size }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    borderRadius: 12,
    backgroundColor: Colors.gray[700],
    overflow: 'hidden',
  },
  cover: {
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
}); 