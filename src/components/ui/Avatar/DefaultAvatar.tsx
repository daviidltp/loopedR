import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text/AppText';
import { UploadButton } from './UploadButton';

interface DefaultAvatarProps {
  name: string;
  size?: number;
  borderStyle?: 'solid' | 'dashed';
  onPress?: () => void;
  disabled?: boolean;
  selectedImage?: any;
  avatarUrl?: string; // Puede ser preset, url o default_avatar
  backgroundColor?: string;
  showUploadButton?: boolean;
  uploadButtonSize?: number;
  onUploadPress?: () => void;
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ 
  name, 
  size = 160,
  borderStyle = 'solid',
  onPress,
  disabled = false,
  selectedImage,
  avatarUrl,
  backgroundColor = Colors.backgroundSoft,
  showUploadButton = true,
  uploadButtonSize = 40,
  onUploadPress,
}) => {
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] + (words[0][1] || '')).toUpperCase();
  };

  // Función para obtener el source correcto del avatar
  const getImageSource = (avatarUrl?: string) => {
    if (!avatarUrl || avatarUrl === 'default_avatar') return undefined;
    
    // Verificar si es una URL válida
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      return { uri: avatarUrl };
    }
    
    // Verificar si es un avatar predefinido
    const presetAvatars: Record<string, any> = {
      'profileicon1.png': require('@assets/images/profilePics/profileicon1.png'),
      'profileicon2.png': require('@assets/images/profilePics/profileicon2.png'),
      'profileicon6.png': require('@assets/images/profilePics/profileicon6.png'),
      'profileicon4.png': require('@assets/images/profilePics/profileicon4.png'),
      'profileicon5.png': require('@assets/images/profilePics/profileicon5.png'),
    };
    if (presetAvatars[avatarUrl]) return presetAvatars[avatarUrl];
    
    return undefined;
  };

  const initials = getInitials(name);
  const imageSource = avatarUrl ? getImageSource(avatarUrl) : selectedImage;

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>  
      <Pressable
        android_ripple={{
          color: Colors.gray[700],
          borderless: true,
          radius: size / 2,
        }}
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: 100,
            backgroundColor: backgroundColor || '#1A1A1A',
            opacity: disabled ? 0.5 : 1,
            overflow: 'hidden',
            borderWidth: borderStyle === 'dashed' ? 2 : 0,
            borderColor: borderStyle === 'dashed' ? Colors.gray[700] : undefined,
            borderStyle: borderStyle,
          },
        ]}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Avatar de ${name}`}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={[
              styles.selectedImage,
              // Si es una URL remota, usar 100% de width y height
              avatarUrl && (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) 
                ? { width: '100%', height: '100%' }
                : {}
            ]}
            resizeMode="cover"
          />
        ) : (
          <AppText
            fontFamily="raleway"
            fontWeight="bold"
            letterSpacing={0}
            style={[
              styles.text,
              { fontSize: size * 0.3 },
              { lineHeight: size * 0.3 },
            ]}
          >
            {initials}
          </AppText>
        )}
      </Pressable>
      {showUploadButton && (
        <View style={[styles.uploadButtonOverlay, { right: '6%', bottom: '4%' }]}> 
          <UploadButton size={uploadButtonSize} disabled={disabled} onPress={onUploadPress} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  selectedImage: {
    width: '50%',
    height: '50%',
    position: 'absolute',
  },
  uploadButtonOverlay: {
    position: 'absolute',
    zIndex: 2,
  },
}); 