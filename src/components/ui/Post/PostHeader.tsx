import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { VerifiedIcon } from '../../icons/VerifiedIcon';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
import { AppText } from '../Text/AppText';

interface PostHeaderProps {
  user: {
    username: string;
    avatarUrl: string;
    isVerified?: boolean;
    displayName?: string;
  };
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  user,
}) => {
  return (
    <View style={styles.container}>
      <DefaultAvatar
        name={user.displayName || user.username}
        size={40}
        avatarUrl={user.avatarUrl}
        showUploadButton={false}
        disabled={true}
      />
      <View style={styles.userInfo}>
        <View style={styles.usernameRow}>
          <AppText
            variant='body'
            fontFamily="inter"
            fontWeight="semiBold"
            color={Colors.white}
            style={styles.username}
            numberOfLines={1}
          >
            {user.username}
          </AppText>
          {user.isVerified && (
            <VerifiedIcon size={16} />
          )}
        </View>
        <AppText
          variant='bodySmall'
          fontFamily="inter"
          fontWeight="regular"
          color={Colors.mutedWhite}
          style={styles.displayName}
          numberOfLines={1}
        >
          {user.displayName}
        </AppText>
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
    gap: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    marginRight: 6,
  },
  displayName: {
    opacity: 0.8,
  },
}); 