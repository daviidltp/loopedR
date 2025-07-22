import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Post as Top3SongsPost } from '../../../utils/mockData';
import { PostHeader } from './PostHeader';
import { WeeklyLoops } from './WeeklyLoops';

interface PostProps {
  post: Top3SongsPost;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  if (post.type === 'top-3-songs') {
    return (
      <View style={styles.container}>
        {/* Quitar inner shadow aquí */}
        <PostHeader user={post.user} />
        <View style={styles.contentContainer}>
          <WeeklyLoops topSongs={post.topSongs} coverSize={96} />
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
  // innerShadow eliminado
  contentContainer: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
}); 