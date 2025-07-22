import { LinearGradient } from 'expo-linear-gradient'; // o react-native-linear-gradient
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text';
import { SongCover } from './SongCover';

interface SpotifyWrappedContentProps {
  topSongs: Array<{
    position: number;
    title: string;
    artist: string;
    plays: string;
    albumCover: string;
  }>;
  coverSize?: number;
}

export const WeeklyLoops: React.FC<SpotifyWrappedContentProps> = ({
  topSongs,
  coverSize = 50,
}) => {
  return (
    <View style={styles.container}>
      {/* Sombra externa mejorada con más blur */}
      <View pointerEvents="none" style={styles.outerShadow} />
      
      {/* Sombra interna simulada con gradiente */}
      <LinearGradient
        colors={[
          'rgba(118, 209, 255, 0.15)',
          'rgba(118, 209, 255, 0.08)',
          'rgba(118, 209, 255, 0.03)',
          'transparent'
        ]}
        style={styles.innerGradientShadow}
        pointerEvents="none"
      />
      
      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <AppText variant='h2' fontFamily='raleway' fontWeight='bold' color={Colors.white}>Bucles de</AppText>
          <AppText variant='h2' fontFamily='raleway' fontWeight='bold' color={Colors.white}>la semana</AppText>
        </View>
        <View style={styles.songsContainer}>
          {topSongs.map((song) => (
            <View key={song.position} style={styles.songItem}>
              <SongCover song={song} size={coverSize} />
              <View style={styles.songInfo}>
                <AppText variant='body' fontFamily='inter' fontWeight='bold' color={Colors.white}>{song.title}</AppText>
                <AppText variant='body' fontFamily='inter' fontWeight='regular' color={Colors.gray[400]}>{song.artist}</AppText>
                <AppText variant='caption' fontFamily='inter' fontWeight='regular' color={Colors.gray[500]}>{song.plays} reproducciones</AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSoft,
    marginHorizontal: 12,
    borderRadius: 28,
    overflow: 'visible', // Cambiado para permitir sombras externas
    position: 'relative',
  },
  outerShadow: {

  },
  innerGradientShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    zIndex: 1,
    // Gradiente radial para simular sombra interna
    backgroundColor: 'radial-gradient(circle at center, rgba(118, 209, 255, 0.15) 0%, transparent 70%)',
  },
  content: {
    zIndex: 2,
    borderRadius: 28,
    overflow: 'hidden',
  },
  titleContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  songsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },
  songInfo: {
    flex: 1,
    paddingTop: 8,
    gap: 4,
  },
});