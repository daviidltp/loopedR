import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import verifiedBlue from '../../../../assets/icons/verified_blue.png';
import { Colors } from '../../../constants/Colors';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { User, mockUserRelations } from '../../../utils/mockData';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface UserListItemProps {
  user: User;
  onPress?: (userId: string) => void;
}

// Función helper para verificar si seguimos a un usuario
const isFollowing = (currentUserId: string | undefined, userId: string): boolean => {
  if (!currentUserId) return false;
  return mockUserRelations.some(
    (rel) => rel.followerId === currentUserId && rel.followingId === userId
  );
};

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onPress,
}) => {
  const { currentUser } = useCurrentUser();

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] + (words[0][1] || '')).toUpperCase();
  };

  const handlePress = () => onPress?.(user.id);

  const siguiendo = isFollowing(currentUser?.id, user.id);

  const content = (
    <View style={styles.container}>
      {/* Avatar circular */}
      <View style={styles.avatarContainer}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <AppText 
              variant='body'
              fontFamily="inter" 
              fontWeight="semiBold" 
              color={Colors.white}
              numberOfLines={1}
            >
              {getInitials(user.displayName)}
            </AppText>
          </View>
        )}
      </View>

      {/* Información del usuario */}
      <View style={styles.userInfo}>
        {/* Username con ícono verificado y texto "· Siguiendo" si corresponde */}
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
            <Image 
              source={verifiedBlue} 
              style={styles.verifiedIcon}
            />
          )}
          {siguiendo && (
            <AppText
              variant='bodySmall'
              fontFamily="inter"
              fontWeight="regular"
              color={Colors.mutedWhite}
              style={styles.siguiendoText}
              numberOfLines={1}
            >
              {'󠁯· Siguiendo'}
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
  );

  // Usar TouchableNativeFeedback en Android para ripple effect

  return (
    <PlatformTouchable
      onPress={handlePress}
      rippleColor={Colors.gray[700]}
    >
      {content}
    </PlatformTouchable>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
    borderRadius: 40,
    overflow: 'hidden',
    width: 48,
    height: 48,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  defaultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
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