import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { PostComments } from './PostComments';
import { PostDescription } from './PostDescription';
import { PostHeader } from './PostHeader';
import { SpotifyWrappedContent } from './SpotifyWrappedContent';

interface PostData {
  id: string;
  user: {
    username: string;
    avatarUrl: string;
    isVerified?: boolean;
  };
  description: string;
  topSongs: Array<{
    position: number;
    title: string;
    artist: string;
    plays: string;
    albumCover: string;
  }>;
  comments: Array<{
    id: string;
    username: string;
    avatarUrl: string;
    comment: string;
    isVerified?: boolean;
  }>;
}

interface PostProps {
  data: PostData;
}

export const Post: React.FC<PostProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <PostHeader
        username={data.user.username}
        avatarUrl={data.user.avatarUrl}
        isVerified={data.user.isVerified}
      />
      
      <PostDescription description={data.description} />
      
      <View style={styles.contentContainer}>
        <SpotifyWrappedContent topSongs={data.topSongs} />
      </View>
      
      <PostComments comments={data.comments} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundUltraSoft,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
}); 