import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text/AppText';
import { AnimatedVerifiedIcon } from '../layout/AnimatedVerifiedIcon';

interface ProfileHeaderProps {
  username: string;
  onMenuPress?: () => void;
  onBackPress?: () => void;
  onMorePress?: () => void; // Para el botón de 3 puntos
  isVerified?: boolean;
  showBackButton?: boolean; // true = mostrar flecha atrás, false = mostrar menú
  isPublicProfile?: boolean; // true = público (mundo), false = privado (candado)
  showPrivacyIndicator?: boolean; // Solo mostrar en mi perfil
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  username, 
  onMenuPress,
  onBackPress,
  onMorePress,
  isVerified = true,
  showBackButton = false,
  isPublicProfile = true,
  showPrivacyIndicator = false
}) => {
  const insets = useSafeAreaInsets();
  
  const handleLeftButtonPress = () => {
    if (showBackButton && onBackPress) {
      onBackPress();
    }
  };

  const handleRightButtonPress = () => {
    if (showBackButton && onMorePress) {
      onMorePress();
    } else if (!showBackButton && onMenuPress) {
      onMenuPress();
    }
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <Pressable
            style={styles.backButton}
            onPress={handleLeftButtonPress}
            android_ripple={{ 
              color: 'rgba(255, 255, 255, 0.2)',
              borderless: true,
              radius: 20
            }}
          >
            <Icon
              source="arrow-left"
              size={26}
              color={Colors.white}
            />
          </Pressable>
        )}

        {showPrivacyIndicator && (
            <View style={styles.privacyIcon}>
              <Icon
                source={isPublicProfile ? "earth" : "lock"}
                size={20}
                color={Colors.gray[400]}
              />
            </View>
          )}
        
        <View style={styles.usernameContainer}>
          <AppText 
            fontSize={20} 
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            style={styles.usernameText}
          >
            {username}
          </AppText>
          {isVerified && (
            <View style={styles.verifiedIcon}>
              <AnimatedVerifiedIcon size={20} />
            </View>
          )}

        </View>
      </View>
      
      <Pressable
        style={styles.rightButton}
        onPress={handleRightButtonPress}
        android_ripple={{ 
          color: 'rgba(255, 255, 255, 0.2)',
          borderless: true,
          radius: 20
        }}
      >
        <Icon
          source={showBackButton ? "dots-vertical" : "menu"}
          size={22}
          color={Colors.white}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 48, // Asegurar altura mínima consistente
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40, // Altura mínima para alineamiento
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40, // Misma altura que los botones
  },
  usernameText: {
    lineHeight: 24, // Controlar línea específicamente
    includeFontPadding: false, // Eliminar padding interno del font
    textAlignVertical: 'center', // Centrar verticalmente
    marginLeft: 8,
    marginRight: 6,
  },
  verifiedIcon: {
    alignSelf: 'center', // Centrar el icono
  },
  privacyIcon: {
    alignSelf: 'center', // Centrar el icono
  },
  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 