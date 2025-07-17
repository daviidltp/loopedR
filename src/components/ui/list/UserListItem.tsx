import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { User, currentUser, mockUserRelations } from '../../../utils/mockData';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface UserListItemProps {
  user: User;
  onPress?: (userId: string) => void;
}

// Función para saber si el usuario actual sigue al usuario mostrado
const isFollowing = (userId: string): boolean => {
  return mockUserRelations.some(
    (rel) => rel.followerId === currentUser.id && rel.followingId === userId
  );
};

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onPress,
}) => {
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] + (words[0][1] || '')).toUpperCase();
  };

  const handlePress = () => onPress?.(user.id);

  const siguiendo = isFollowing(user.id);

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
              source={require('@assets/icons/verified_blue.png')} 
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
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 24,
  },
  defaultAvatar: {
    width: 52,
    height: 52,
    borderRadius: 24,
    backgroundColor: Colors.gray[700],
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
    marginBottom: 0,
  },
  username: {
    marginBottom: 0,
    marginRight: 2,
  },
  displayName: {
    // Sin margin adicional
  },
  verifiedIcon: {
    width: 18,
    height: 18,
    marginLeft: 4,
  },
  siguiendoText: {
    marginLeft: 6,
  },
}); 