import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LoopColorName, LoopColors } from '../../../constants/LoopColors';
import { ArtistsPost } from './ArtistsPost';
import { PostDescription } from './PostDescription';
import { PostHeader } from './PostHeader';
import { WeeklyLoops } from './WeeklyLoops';
import { WelcomePost } from './WelcomePost';

interface PostProps {
  colorName?: LoopColorName;
  type?: 'top-3-songs' | 'top-3-albums' | 'top-3-artists' | 'welcome';
  showHeader?: boolean;
  showDescription?: boolean;
  style?: any; // Nuevo prop para estilos externos
  preview?: boolean; // Nuevo prop para versión mini
  // Props de datos
  topSongs?: Array<{
    position: number;
    title: string;
    artist: string;
    plays: string; // Siempre string, no opcional
    albumCover: string;
  }>;
  artists?: Array<{
    position: number;
    artist_name: string;
    artist_image_url: string;
    plays?: string;
  }>;
  description?: string;
  user?: any;
}

// Definir tipos para variantes
import type {
  SpotifyWrappedContentProps as WeeklyLoopsProps
} from './WeeklyLoops';

export const Post: React.FC<PostProps> = ({ colorName, type, showHeader = true, showDescription = true, style, preview = false, topSongs, artists, description, user}) => {
  // Si colorName está definido, sobrescribe los colores
  const postColor = colorName ? LoopColors[colorName] : LoopColors.purple;

  // Definir constantes de layout y variantes según tipo y preview
  let headerVariant: WeeklyLoopsProps['headerVariant'] = 'h2';
  let songTitleVariant: WeeklyLoopsProps['songTitleVariant'] = 'body';
  let songArtistVariant: WeeklyLoopsProps['songArtistVariant'] = 'body';
  let itemCoverSize = 96;
  let itemGap = 16;
  let headerPadding = 40;
  let containerMargin = 12;

  if (preview) {
    headerVariant = type === 'top-3-songs' ? 'h3' : 'h3';
    songTitleVariant = 'bodySmall';
    songArtistVariant = 'bodySmall';
    itemCoverSize = 84;
    itemGap = 12;
    headerPadding = 32;
    containerMargin = 12;
  }

  let content = null;
  if (type === 'top-3-songs' && topSongs && topSongs.length > 0) {
    content = (
      <WeeklyLoops
        topSongs={topSongs}
        coverSize={itemCoverSize}
        backgroundColor={postColor.backgroundColor}
        borderColor={postColor.borderColor}
        titleColor={postColor.titleColor}
        headerVariant={headerVariant}
        songTitleVariant={songTitleVariant}
        songArtistVariant={songArtistVariant}
        itemGap={itemGap}
        headerPadding={headerPadding}
        containerMargin={containerMargin}
      />
    );
  } else if (type === 'welcome' && topSongs && topSongs.length > 0) {
    content = (
      <WelcomePost
        topSongs={topSongs}
        coverSize={itemCoverSize}
        backgroundColor={postColor.backgroundColor}
        borderColor={postColor.borderColor}
        titleColor={postColor.titleColor}
        headerVariant={headerVariant}
        songTitleVariant={songTitleVariant}
        songArtistVariant={songArtistVariant}
        itemGap={itemGap}
        headerPadding={headerPadding}
        containerMargin={containerMargin}
      />
    );
  } else if (type === 'top-3-artists' && artists && artists.length > 0) {
    content = (
      <ArtistsPost
        artists={artists as any} // Forzamos el tipo para evitar error de tipado, ya que ArtistsPost solo usa estas props
        borderColor={postColor.borderColor}
        backgroundColor={postColor.backgroundColor}
        titleColor={postColor.titleColor}
        headerVariant={headerVariant}
        itemGap={itemGap}
        headerPadding={headerPadding}
        containerMargin={containerMargin}
      />
    );
  }
  if (!content) return null;
  return (
    <View style={[styles.container, preview && { paddingHorizontal: 8}, style]}>
      <View style={styles.headerContainer} >
        {showHeader && user && <PostHeader user={user} />}
        {showDescription && description && <PostDescription description={description} />}
      </View>
      <View style={styles.contentContainer}>
        {content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
    position: 'relative',
    width: '100%',
  },
  headerContainer: {
    paddingBottom: 4,
    gap: 4
  },
  // innerShadow eliminado
  contentContainer: {

  },
}); 