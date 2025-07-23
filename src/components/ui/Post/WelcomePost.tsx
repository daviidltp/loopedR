import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ShadowView } from 'react-native-inner-shadow';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
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
  borderColor?: string;
  backgroundColor?: string;
  titleColor?: string;
}

export const WelcomePost: React.FC<SpotifyWrappedContentProps> = ({
  topSongs,
  coverSize = 50,
  borderColor = '#A876FF77',
  backgroundColor = '#A876FF22',
  titleColor = '#CBB9EE',
}) => {
  return (
    <ShadowView style={styles.container}  
    inset
    backgroundColor="000"
    shadowColor={borderColor}
    shadowOffset={{ width: 0, height: 0 }}
    shadowBlur={30}
>
      {/* Gradiente radial real usando SVG */}
      <Svg style={styles.svg} height="100%" width="100%">
        <Defs>
          <RadialGradient
            id="radialGrad"
            cx="100%"
            cy="100%"
            rx="100%"
            ry="80%"
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="0" stopColor={borderColor} stopOpacity={0.67} />
            <Stop offset="1" stopColor={borderColor} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#radialGrad)" />
      </Svg>

      {/* Sombra interna usando ShadowView */}
      <ShadowView
        inset
        backgroundColor="transparent"
        shadowColor={borderColor}
        shadowOffset={{ width: 0, height: 0 }}
        shadowBlur={20}
        style={styles.shadowView}
      />

      {/* Contenido principal */}
      <View style={[styles.content, {     backgroundColor: backgroundColor, }]}>
        <View style={styles.titleContainer}>
          <AppText variant='h2' fontFamily='raleway' fontWeight='bold' color={titleColor} letterSpacing={0}>#WelcomeToLooped</AppText>
        </View>
        <View style={styles.songsContainer}>
        <AppText variant='body' fontFamily='raleway' fontWeight='bold' color={Colors.lessMutedWhite} letterSpacing={0} style={{ marginBottom: 16 }}>Canciones más escuchadas del mes</AppText>
          {topSongs.map((song) => (
            <View key={song.position} style={styles.songItem}>
              <SongCover song={song} size={coverSize} />
              <View style={styles.songInfo}>
                <AppText variant='body' fontFamily='inter' fontWeight='bold' color={Colors.white}>{song.title}</AppText>
                <AppText variant='body' fontFamily='inter' fontWeight='light' color={Colors.lessMutedWhite}>{song.artist}</AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ShadowView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    borderRadius: 30,
    position: 'relative',
    zIndex: 0,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    borderRadius: 30,
  },
  shadowView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderRadius: 30,
  },
  content: {
    zIndex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    height: 500,
    paddingVertical: 32,
    paddingHorizontal: 32,

  },
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  songsContainer: {
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