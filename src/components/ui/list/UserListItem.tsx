import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { User } from '../../../utils/mockData';
import { VerifiedIcon } from '../../icons/VerifiedIcon';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface UserListItemProps {
  user: User;
  onPress?: (userId: string) => void;
}



const UserListItemComponent: React.FC<UserListItemProps> = ({
  user,
  onPress,
}) => {

  const handlePress = useMemo(() => () => onPress?.(user.id), [onPress, user.id]);

  return (
    <PlatformTouchable
      onPress={handlePress}
      rippleColor={Colors.gray[700]}
    >
      <View style={styles.container}>
        <DefaultAvatar
          name={user.displayName}
          size={56}
          avatarUrl={user.avatarUrl}
          showUploadButton={false}
          disabled={true}
        />
        <View style={styles.userInfo}>
          <View style={styles.usernameRow}>
            <AppText 
              variant='body'
              fontFamily="roboto" 
              fontWeight="semiBold" 
              color={Colors.white}
              style={styles.username}
              numberOfLines={1}
            >
              {user.username}
              
            </AppText>
            {user.isVerified && (
              <VerifiedIcon
                size={12}
              />
            )}
            
            {user.followStatus === 'accepted' && (
              <AppText
                variant='bodySmall'
                fontFamily="inter"
                fontWeight="regular"
                color={Colors.mutedWhite}
                style={styles.siguiendoText}
                numberOfLines={1}
              >
                {'· Siguiendo'}
              </AppText>
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
    </PlatformTouchable>
  );
};

function areEqual(prevProps: UserListItemProps, nextProps: UserListItemProps) {
  const prevUser = prevProps.user;
  const nextUser = nextProps.user;
  return (
    prevUser.id === nextUser.id &&
    prevUser.isVerified === nextUser.isVerified &&
    prevUser.username === nextUser.username &&
    prevUser.displayName === nextUser.displayName &&
    prevUser.avatarUrl === nextUser.avatarUrl &&
    prevProps.onPress === nextProps.onPress
  );
}

export const UserListItem = React.memo(UserListItemComponent, areEqual);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 2
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginRight: 6,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  siguiendoText: {
    marginLeft: 2,
  },
  displayName: {
    opacity: 0.8,
  },
}); 