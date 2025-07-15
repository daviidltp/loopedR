import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Notifier } from 'react-native-notifier';
import { Icon, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { AnimatedVerifiedIcon } from '../layout/AnimatedVerifiedIcon';
import { PlatformTouchable } from '../PlatformTouchable';
import { AppText } from '../Text/AppText';

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

  const handleBookmarkPress = () => {
    Notifier.showNotification({
      title: 'Próximamente en looped... 🤫',
      description: '',
      duration: 2000,
      showAnimationDuration: 300,
      hideAnimationDuration: 300,
      onPress: () => {
        Notifier.hideNotification();
      },
      swipeEnabled: true,
      queueMode: 'next',
      componentProps: {
        containerStyle: {
          backgroundColor: Colors.secondaryGreenDark,
          marginHorizontal: 0,
          marginTop: 0,
          paddingVertical: 16,
          paddingTop: 45,
          borderRadius: 0,
        },
        titleStyle: {
          color: Colors.white,
          fontSize: 20,
          fontWeight: '700',
          fontFamily: 'Raleway',
        },
        descriptionStyle: {
          color: Colors.mutedWhite,
          fontSize: 14,
          fontFamily: 'Raleway',
        },
      },
    });
  };
  
  return (
    <View style={[styles.container]}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <PlatformTouchable
            style={styles.backButton}
            onPress={handleLeftButtonPress}
            rippleColor={Colors.backgroundSoft}
          >
            <Icon
              source="arrow-left"
              size={26}
              color={Colors.white}
            />
          </PlatformTouchable>
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
      
      <View style={styles.rightButtonContainer}>
        {!showBackButton && (
          <IconButton
            icon="bookmark-outline"
            size={22}
            iconColor={Colors.white}
            onPress={handleBookmarkPress}
            style={styles.iconButton}
            rippleColor="rgba(255, 255, 255, 0.2)"
          />
        )}
        <IconButton
          icon={showBackButton ? "dots-vertical" : "menu"}
          size={22}
          iconColor={Colors.white}
          onPress={handleRightButtonPress}
          style={styles.iconButton}
          rippleColor="rgba(255, 255, 255, 0.2)"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal:20,
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
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 0,
  },
}); 