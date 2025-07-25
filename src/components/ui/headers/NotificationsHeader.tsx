import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text/AppText';

interface NotificationsHeaderProps {
  onBackPress?: () => void;
}

export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({ 
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();

  
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
            <View style={styles.privacyIcon}>
              <Icon
                source="bell"
                size={20}
                color={Colors.gray[400]}
              />
            </View>
        
        <View style={styles.titleContainer}>
          <AppText 
            fontSize={20} 
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            style={styles.usernameText}
          >
            Notificaciones
          </AppText>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    minHeight: 48, // Asegurar altura mínima consistente
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40, // Altura mínima para alineamiento
  },

  titleContainer: {
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