import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { FONT_FAMILIES } from '../../../constants/Fonts';

interface Comment {
  id: string;
  username: string;
  avatarUrl: string;
  comment: string;
  isVerified?: boolean;
}

interface PostCommentsProps {
  comments: Comment[];
}

export const PostComments: React.FC<PostCommentsProps> = ({ comments }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios</Text>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentItem}>
          <Image source={{ uri: comment.avatarUrl }} style={styles.avatar} />
          <View style={styles.commentContent}>
            <View style={styles.nameContainer}>
              <Text style={styles.username}>{comment.username}</Text>
              {comment.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.commentText}>{comment.comment}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.semiBold,
    color: Colors.white,
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray[700],
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.semiBold,
    color: Colors.white,
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    backgroundColor: Colors.spotifyGreen,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  verifiedIcon: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: FONT_FAMILIES.bold,
  },
  commentText: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.regular,
    color: Colors.gray[300],
    lineHeight: 18,
  },
}); 