import React from 'react';
import { Image, Platform, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { User } from '../../../utils/mockData';
import { AppText } from '../Text/AppText';

interface UserListItemProps {
  user: User;
  onPress?: (userId: string) => void;
}

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

  const content = (
    <View style={styles.container}>
      {/* Avatar circular */}
      <View style={styles.avatarContainer}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <AppText 
              fontSize={16} 
              fontFamily="inter" 
              fontWeight="semiBold" 
              color={Colors.white}
            >
              {getInitials(user.displayName)}
            </AppText>
          </View>
        )}
      </View>

      {/* Información del usuario */}
      <View style={styles.userInfo}>
        {/* Username con ícono verificado */}
        <View style={styles.usernameRow}>
          <AppText 
            fontSize={16} 
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            style={styles.username}
            numberOfLines={1}
            lineHeight={18}
          >
            {user.username}
          </AppText>
          {user.isVerified && (
            <Image 
              source={require('../../../../assets/icons/verified.png')} 
              style={styles.verifiedIcon}
            />
          )}
        </View>
        
        <AppText 
          fontSize={14} 
          fontFamily="inter" 
          fontWeight="regular" 
          color={Colors.gray[400]}
          style={styles.displayName}
          numberOfLines={1}
        >
          {user.displayName}
        </AppText>
      </View>
    </View>
  );

  // Usar TouchableNativeFeedback en Android para ripple effect
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={handlePress}
        background={TouchableNativeFeedback.Ripple(Colors.gray[700], false)}
      >
        {content}
      </TouchableNativeFeedback>
    );
  }

  // Fallback para iOS
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {content}
    </TouchableOpacity>
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
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  defaultAvatar: {
    width: 48,
    height: 48,
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
    width: 20,
    height: 20,
    marginLeft: 4,
  },
}); 