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
}

export const Post: React.FC<PostProps> = ({ post, colorName, type, showHeader = true, showDescription = true }) => {
  // Si colorName está definido, sobrescribe los colores
  const postColor = colorName ? LoopColors[colorName] : LoopColors.purple;
  let content = null;
  if (type === 'top-3-songs') {
    content = (
      <WeeklyLoops topSongs={post.topSongs} coverSize={96} backgroundColor={postColor.backgroundColor} borderColor={postColor.borderColor} titleColor={postColor.titleColor} />
    );
  } else if (type === 'welcome') {
    content = (
      <WelcomePost topSongs={post.topSongs} coverSize={96} backgroundColor={postColor.backgroundColor} borderColor={postColor.borderColor} titleColor={postColor.titleColor} />
    );
  }
  if (!content) return null;
  return (
    <View style={styles.container}>
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
  },
  headerContainer: {
    paddingBottom: 4,
    gap: 4
  },
  // innerShadow eliminado
  contentContainer: {

  },
}); 