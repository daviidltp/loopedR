import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text';
import { SongCover } from './SongCover';

export interface SpotifyWrappedContentProps {
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
  headerVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'bodyLarge'
    | 'bodySmall'
    | 'label'
    | 'labelSmall'
    | 'caption'
    | 'overline'
    | 'display'
    | 'displaySmall'
    | 'link'
    | 'linkSmall'
    | 'error'
    | 'success'
    | 'placeholder'
    | undefined;
  songTitleVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'bodyLarge'
    | 'bodySmall'
    | 'label'
    | 'labelSmall'
    | 'caption'
    | 'overline'
    | 'display'
    | 'displaySmall'
    | 'link'
    | 'linkSmall'
    | 'error'
    | 'success'
    | 'placeholder'
    | undefined;
  songArtistVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'bodyLarge'
    | 'bodySmall'
    | 'label'
    | 'labelSmall'
    | 'caption'
    | 'overline'
    | 'display'
    | 'displaySmall'
    | 'link'
    | 'linkSmall'
    | 'error'
    | 'success'
    | 'placeholder'
    | undefined;
  itemGap?: number;
  headerPadding?: number;
  containerMargin?: number;
}

const WelcomePostComponent: React.FC<SpotifyWrappedContentProps> = ({
  topSongs,
  coverSize = 96,
  borderColor = '#A876FF77',
  backgroundColor = '#A876FF22',
  titleColor = '#CBB9EE',
  headerVariant = 'h2',
  songTitleVariant = 'body',
  songArtistVariant = 'body',
  itemGap = 16,
  headerPadding = 40,
  containerMargin = 12,
}) => {
  return (
    <View style={[styles.container, { boxShadow: `0px 0px 20px 1px ${borderColor} inset` }, { marginHorizontal: containerMargin }]}>

      {/* Gradiente radial real usando SVG */}

      {/* Sombra interna usando ShadowView */}

      {/* Contenido principal */}
      <View style={[styles.content, { backgroundColor: backgroundColor, paddingVertical: headerPadding, gap: 16 }]}> 
        <AppText variant={headerVariant} fontFamily='raleway' fontWeight='bold' color={titleColor} letterSpacing={0}>#WelcomeToLooped</AppText>
        <AppText variant={songTitleVariant} fontFamily='raleway' fontWeight='bold' color={Colors.lessMutedWhite} letterSpacing={0} style={{ marginBottom: 0 }}>Canciones más escuchadas del mes</AppText>
        <View style={[styles.songsContainer, { gap: itemGap }]}> 
          {topSongs.map((song) => (
            <View key={song.position} style={[styles.songItem]}> 
              <SongCover song={song} size={coverSize} />
              <View style={styles.songInfo}>
                <AppText variant={songTitleVariant} fontFamily='inter' fontWeight='bold' color={Colors.white}>{song.title}</AppText>
                <AppText variant={songArtistVariant} fontFamily='inter' fontWeight='light' color={Colors.lessMutedWhite}>{song.artist}</AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
    
  );
};

export const WelcomePost = memo(WelcomePostComponent);

const styles = StyleSheet.create({
  container: {
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
    overflow: 'hidden',
    paddingHorizontal: 32,

  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  songsContainer: {

  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16
  },
  songInfo: {
    flex: 1,
    paddingTop: 8,
    gap: 4,
  },

});