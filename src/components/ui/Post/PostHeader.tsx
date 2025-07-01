import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { FONT_FAMILIES } from '../../../constants/Fonts';

interface PostHeaderProps {
  username: string;
  avatarUrl: string;
  isVerified?: boolean;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  username,
  avatarUrl,
  isVerified = false,
}) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.username}>{username}</Text>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[700],
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.semiBold,
    color: Colors.white,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    backgroundColor: Colors.spotifyGreen,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  verifiedIcon: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: FONT_FAMILIES.bold,
  },
}); 