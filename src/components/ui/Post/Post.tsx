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
}

export const Post: React.FC<PostProps> = ({ post, colorName, type }) => {
  // Si colorName está definido, sobrescribe los colores
  const postColor = colorName ? LoopColors[colorName] : LoopColors.purple;
  if (type === 'top-3-songs') {
    return (
      <View style={styles.container}>
        {/* Quitar inner shadow aquí */}
        <View style={styles.headerContainer} >
          <PostHeader user={post.user} />
          <PostDescription description={post.description} />
        </View>
        <View style={styles.contentContainer}>
          <WeeklyLoops topSongs={post.topSongs} coverSize={96} backgroundColor={postColor.backgroundColor} borderColor={postColor.borderColor} titleColor={postColor.titleColor} />
        </View>
      </View>
    );
  }
  if (type === 'welcome') {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer} >
          <PostHeader user={post.user} />
          <PostDescription description={post.description} />
          <View style={styles.contentContainer}>
            <WelcomePost topSongs={post.topSongs} coverSize={96} backgroundColor={postColor.backgroundColor} borderColor={postColor.borderColor} titleColor={postColor.titleColor} />
          </View>
        </View>
      </View>
    );
  }
  return null;
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