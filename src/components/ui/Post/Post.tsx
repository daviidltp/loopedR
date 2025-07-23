import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Post as Top3SongsPost } from '../../../utils/mockData';
import { PostDescription } from './PostDescription';
import { PostHeader } from './PostHeader';
import { WeeklyLoops } from './WeeklyLoops';

interface PostProps {
  post: Top3SongsPost;
  backgroundColor?: string;
  borderColor?: string;
  borderOpacity?: string;
}

export const Post: React.FC<PostProps> = ({ post, backgroundColor, borderColor }) => {
  if (post.type === 'top-3-songs') {
    return (
      <View style={styles.container}>
        {/* Quitar inner shadow aquí */}
        <View style={styles.headerContainer} >
          <PostHeader user={post.user} />
          <PostDescription description={post.description} />
        </View>
        <View style={styles.contentContainer}>
          <WeeklyLoops topSongs={post.topSongs} coverSize={96} backgroundColor={backgroundColor} borderColor={borderColor} />
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