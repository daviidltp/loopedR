import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { TopMonthlyArtist } from '../../../contexts/ProfileContext';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
import { AppText } from '../Text';

interface ArtistsPostProps {
  artists: TopMonthlyArtist[];
  borderColor?: string;
  backgroundColor?: string;
  titleColor?: string;
  headerVariant?: 
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    | 'body' | 'bodyLarge' | 'bodySmall'
    | 'label' | 'labelSmall'
    | 'caption' | 'overline'
    | 'display' | 'displaySmall'
    | 'link' | 'linkSmall'
    | 'error' | 'success' | 'placeholder'
    | undefined;
  itemGap?: number;
  headerPadding?: number;
  containerMargin?: number;
  }

const ArtistsPostComponent: React.FC<ArtistsPostProps> = ({
  artists,
  borderColor = '#A876FF77',
  backgroundColor = '#A876FF22',
  titleColor = '#CBB9EE',
  headerVariant = 'h2',
  itemGap = 16,
  headerPadding = 40,
  containerMargin = 12,
}) => {
  if (!artists || artists.length === 0) return null;

  const mainArtist = artists[0];
  return (
    <View style={[styles.container, { boxShadow: `0px 0px 20px 1px ${borderColor} inset` }, { marginHorizontal: containerMargin }]}>
      {/* Gradiente radial real usando SVG */}


      {/* Contenido principal */}
      <View style={[styles.content, { backgroundColor: backgroundColor, paddingVertical: headerPadding, gap: 0 }]}> 
        <AppText variant={headerVariant} fontFamily='raleway' fontWeight='bold' color={titleColor} letterSpacing={0}>{mainArtist.artist_name}</AppText>
        <AppText variant='body' fontFamily='raleway' fontWeight='bold' color={Colors.lessMutedWhite} letterSpacing={0} style={{ marginBottom: 0 }}>es tu estrella de la semana</AppText>
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <DefaultAvatar avatarUrl={mainArtist.artist_image_url} size={160} name={mainArtist.artist_name} disabled={true} showUploadButton={false} />
        </View>
        <View style={[styles.artistsList, { gap: itemGap }]}> 
          {artists.map((artist, idx) => (
            <View key={(artist.artist_id || artist.artist_name || '') + '-' + (artist.position || idx)} style={styles.artistItem}> 
              <View style={{width: 50}}>
                <AppText variant='h3' fontFamily='inter' fontWeight='bold' color={Colors.white}>#{idx + 1}</AppText>
              </View>
              <AppText variant='h4' fontFamily='inter' fontWeight='bold' color={Colors.white}>{artist.artist_name}</AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export const ArtistsPost = memo(ArtistsPostComponent);

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
  artistImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  artistsList: {
    width: '100%',
    marginTop: 8,
  },
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}); 