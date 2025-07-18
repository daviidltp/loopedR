import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Colors } from '../../../constants/Colors';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface SettingsProfileSectionProps {
  name: string;
  username: string;
  avatarUrl?: string; // Puede ser preset, url o default_avatar
  onEditPress?: () => void;
}

export const SettingsProfileSection: React.FC<SettingsProfileSectionProps> = ({
  name,
  username,
  avatarUrl,
  onEditPress,
}) => {
  // Función para obtener el source correcto
  const getImageSource = (avatarUrl?: string) => {
    if (!avatarUrl || avatarUrl === 'default_avatar') return null;
    const presetAvatars: Record<string, any> = {
      'profileicon1.png': require('@assets/images/profilePics/profileicon1.png'),
      'profileicon2.png': require('@assets/images/profilePics/profileicon2.png'),
      'profileicon6.png': require('@assets/images/profilePics/profileicon6.png'),
      'profileicon4.png': require('@assets/images/profilePics/profileicon4.png'),
      'profileicon5.png': require('@assets/images/profilePics/profileicon5.png'),
    };
    if (presetAvatars[avatarUrl]) return presetAvatars[avatarUrl];
    if (avatarUrl.startsWith('http')) return { uri: avatarUrl };
    return null;
  };

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] + (words[0][1] || '')).toUpperCase();
  };

  const imageSource = getImageSource(avatarUrl);

  return (
    <PlatformTouchable 
      style={styles.container}
      onPress={onEditPress}
      rippleColor={Colors.gray[700]}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {imageSource ? (
            <Image 
              source={imageSource}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <AppText 
                variant="h2"
                fontFamily="raleway"
                fontWeight="bold"
                color={Colors.white}
                style={{ fontSize: 28 }}
              >
                {getInitials(name)}
              </AppText>
            </View>
          )}
        </View>
        
        <View style={styles.textContainer}>
          <AppText 
            variant='body'
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            style={styles.nameText}
          >
            {name}
          </AppText>
          <AppText 
            variant='bodySmall'
            fontFamily="inter" 
            fontWeight="regular" 
            color={Colors.mutedWhite}
            style={styles.usernameText}
          >
            @{username}
          </AppText>
        </View>
        
        <View style={styles.editButton}>
          <Icon source="chevron-right" size={16} color={Colors.mutedWhite} />
        </View>
      </View>
    </PlatformTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  defaultAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.gray[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    marginBottom: 4,
  },
  usernameText: {
    lineHeight: 18,
    marginBottom: 4,
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
}); 