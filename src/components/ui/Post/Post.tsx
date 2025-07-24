import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LoopColorName, LoopColors } from '../../../constants/LoopColors';
import type { Post as Top3SongsPost } from '../../../utils/mockData';
import { PostDescription } from './PostDescription';
import { PostHeader } from './PostHeader';
import { WeeklyLoops } from './WeeklyLoops';
import { WelcomePost } from './WelcomePost';

interface PostProps {
  post: Top3SongsPost;
  colorName?: LoopColorName;
  type?: 'top-3-songs' | 'top-3-albums' | 'top-3-artists' | 'welcome';
  showHeader?: boolean;
  showDescription?: boolean;
  style?: any; // Nuevo prop para estilos externos
  preview?: boolean; // Nuevo prop para versión mini
}

// Definir tipos para variantes
import type {
  SpotifyWrappedContentProps as WeeklyLoopsProps
} from './WeeklyLoops';

export const Post: React.FC<PostProps> = ({ post, colorName, type, showHeader = true, showDescription = true, style, preview = false }) => {
  // Si colorName está definido, sobrescribe los colores
  const postColor = colorName ? LoopColors[colorName] : LoopColors.purple;

  // Definir constantes de layout y variantes según tipo y preview
  let headerVariant: WeeklyLoopsProps['headerVariant'] = 'h2';
  let songTitleVariant: WeeklyLoopsProps['songTitleVariant'] = 'body';
  let songArtistVariant: WeeklyLoopsProps['songArtistVariant'] = 'body';
  let itemCoverSize = 96;
  let itemGap = 16;
  let headerPadding = 40;

  if (preview) {
    headerVariant = type === 'top-3-songs' ? 'h3' : 'h3';
    songTitleVariant = 'bodySmall';
    songArtistVariant = 'bodySmall';
    itemCoverSize = 84;
    itemGap = 12;
    headerPadding = 32;
  }

  let content = null;
  if (type === 'top-3-songs') {
    content = (
      <WeeklyLoops
        topSongs={post.topSongs}
        coverSize={itemCoverSize}
        backgroundColor={postColor.backgroundColor}
        borderColor={postColor.borderColor}
        titleColor={postColor.titleColor}
        headerVariant={headerVariant}
        songTitleVariant={songTitleVariant}
        songArtistVariant={songArtistVariant}
        itemGap={itemGap}
        headerPadding={headerPadding}
      />
    );
  } else if (type === 'welcome') {
    content = (
      <WelcomePost
        topSongs={post.topSongs}
        coverSize={itemCoverSize}
        backgroundColor={postColor.backgroundColor}
        borderColor={postColor.borderColor}
        titleColor={postColor.titleColor}
        headerVariant={headerVariant}
        songTitleVariant={songTitleVariant}
        songArtistVariant={songArtistVariant}
        itemGap={itemGap}
        headerPadding={headerPadding}
      />
    );
  }
  if (!content) return null;
  return (
    <View style={[styles.container, preview && { padding: 8 }, style]}>
      <View style={styles.headerContainer} >
        {showHeader && <PostHeader user={post.user} />}
        {showDescription && <PostDescription description={post.description} />}
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