import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text/AppText';

interface DefaultAvatarProps {
  name: string;
  size?: number;
  borderStyle?: 'solid' | 'dashed';
  onPress?: () => void;
  disabled?: boolean;
  selectedImage?: any;
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ 
  name, 
  size = 160,
  borderStyle = 'solid',
  onPress,
  disabled = false,
  selectedImage,
}) => {
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] + (words[0][1] || '')).toUpperCase();
  };

  const initials = getInitials(name);

  return (
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
          backgroundColor: "#1A1A1A",
          opacity: disabled ? 0.5 : 1,
          overflow: 'hidden',
        }
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Avatar de ${name}`}
    >
      {selectedImage ? (
        <Image 
          source={selectedImage}
          style={styles.selectedImage}
          resizeMode="cover"
        />
      ) : (
        <AppText 
          variant="h2" 
          fontFamily="raleway" 
          fontWeight="light"
          letterSpacing={0}
          style={[
            styles.text,
            { fontSize: size * 0.25 }
          ]}
        >
          {initials}
        </AppText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 60,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
}); 