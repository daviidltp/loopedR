import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { FONT_FAMILIES } from '../../../constants/Fonts';

interface SpotifyWrappedContentProps {
  topSongs: Array<{
    position: number;
    title: string;
    artist: string;
    plays: string;
    albumCover: string;
  }>;
}

export const SpotifyWrappedContent: React.FC<SpotifyWrappedContentProps> = ({
  topSongs,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus canciones más escuchadas</Text>
      </View>
      
      <View style={styles.songsContainer}>
        {topSongs.map((song) => (
          <View key={song.position} style={styles.songItem}>
            <Text style={styles.position}>{song.position}</Text>
            <Image 
              source={{ uri: song.albumCover }} 
              style={styles.albumCover} 
            />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.artistName}>{song.artist}</Text>
              <Text style={styles.plays}>{song.plays} reproducciones</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSoft,
    marginHorizontal: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    backgroundColor: '#FF006E',
  },
  title: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.bold,
    color: Colors.white,
    textAlign: 'left',
  },
  songsContainer: {
    backgroundColor: Colors.backgroundSoft,
    padding: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  position: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.bold,
    color: Colors.white,
    width: 30,
    marginRight: 16,
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.gray[700],
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.semiBold,
    color: Colors.white,
    marginBottom: 2,
  },
  artistName: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.regular,
    color: Colors.gray[400],
    marginBottom: 2,
  },
  plays: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.regular,
    color: Colors.gray[500],
  },
}); 