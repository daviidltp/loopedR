import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text/AppText';

interface UserAvatarProps {
  avatarUrl: string;
  displayName: string;
  size?: number;
  style?: any;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  avatarUrl, 
  displayName, 
  size = 88,
  style 
}) => {
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] + (words[0][1] || '')).toUpperCase();
  };

  const getImageSource = (avatarUrl: string) => {
    // Si es el avatar por defecto, mostrar iniciales
    if (avatarUrl === 'default_avatar') {
      return null;
    }

    // Si es un avatar preset, cargar desde assets locales
    const presetAvatars = {
      'profileicon1.png': require('@assets/images/profilePics/profileicon1.png'),
      'profileicon2.png': require('@assets/images/profilePics/profileicon2.png'),
      'profileicon6.png': require('@assets/images/profilePics/profileicon6.png'),
      'profileicon4.png': require('@assets/images/profilePics/profileicon4.png'),
      'profileicon5.png': require('@assets/images/profilePics/profileicon5.png'),
    };

    if (presetAvatars[avatarUrl as keyof typeof presetAvatars]) {
      return presetAvatars[avatarUrl as keyof typeof presetAvatars];
    }

    // Si es una URL remota, usarla directamente
    if (avatarUrl.startsWith('http')) {
      return { uri: avatarUrl };
    }

    // Fallback: mostrar iniciales
    return null;
  };

  const imageSource = getImageSource(avatarUrl);
  const initials = getInitials(displayName);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {imageSource ? (
        <Image
          source={imageSource}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.initialsContainer, { width: size, height: size, borderRadius: size / 2 }]}>
          <AppText 
            variant="h2" 
            fontFamily="raleway" 
            fontWeight="bold"
            letterSpacing={0}
            style={[styles.initials, { fontSize: size * 0.25 }]}
          >
            {initials}
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: Colors.white,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
}); 