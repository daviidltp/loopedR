import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import verifiedBlue from '../../../../assets/icons/verified_blue.png';
import { Colors } from '../../../constants/Colors';
import { useProfile } from '../../../contexts/ProfileContext';
import { User, mockUserRelations } from '../../../utils/mockData';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
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

// Función para obtener la imagen del avatar
const getAvatarImage = (avatarUrl: string) => {
  // Si es null, undefined o vacío, usar avatar por defecto
  if (!avatarUrl || avatarUrl === 'default_avatar') {
    return null;
  }

  // Si es una URL externa, usar directamente
  if (avatarUrl.startsWith('http')) {
    return { uri: avatarUrl };
  }

  // Si es un avatar preset, cargar desde assets locales
  const presetAvatars: Record<string, any> = {
    'profileicon1.png': require('@assets/images/profilePics/profileicon1.png'),
    'profileicon2.png': require('@assets/images/profilePics/profileicon2.png'),
    'profileicon6.png': require('@assets/images/profilePics/profileicon6.png'),
    'profileicon4.png': require('@assets/images/profilePics/profileicon4.png'),
    'profileicon5.png': require('@assets/images/profilePics/profileicon5.png'),
  };

  if (presetAvatars[avatarUrl]) {
    return presetAvatars[avatarUrl];
  }

  // Si no se reconoce, usar avatar por defecto
  return null;
};

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onPress,
}) => {
  const { profile: currentUser } = useProfile();

  const handlePress = () => onPress?.(user.id);

  const siguiendo = isFollowing(currentUser?.id, user.id);

  // Obtener la imagen del avatar
  const avatarImage = getAvatarImage(user.avatarUrl);

  const content = (
    <View style={styles.container}>
      {/* Avatar circular */}
      <DefaultAvatar
        name={user.displayName}
        size={52}
        avatarUrl={user.avatarUrl}
        showUploadButton={false}
      />

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