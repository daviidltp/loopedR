import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
    BackHandler,
    Image,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { SettingsOption } from '../ui/sections/SettingsSection';

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Manejar el botón físico de Android
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true; // Indica que hemos manejado el evento
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleOptionPress = (option: string) => {
    console.log(`Pressed: ${option}`);
    // Aquí irá la navegación
  };

  const handleLogout = () => {
    console.log('Cerrar sesión');
    // Aquí irá la lógica de cerrar sesión
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar de Cristiano */}
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: 'https://pbs.twimg.com/profile_images/1594446880498401282/o4L2z8Ay_400x400.jpg' }}
            style={styles.avatar}
          />
        </View>

        {/* Opciones de configuración */}
        <View style={styles.optionsContainer}>
          <SettingsOption
            iconName="account"
            title="Detalles Personales"
            subtitle="Edita tu información personal"
            onPress={() => handleOptionPress('Detalles Personales')}
          />
          
          <SettingsOption
            iconName="bell"
            title="Notificaciones"
            subtitle="Configura tus alertas"
            onPress={() => handleOptionPress('Notificaciones')}
          />
          
          <SettingsOption
            iconName="shield-lock"
            title="Privacidad y Seguridad"
            subtitle="Gestiona tu privacidad"
            onPress={() => handleOptionPress('Privacidad y Seguridad')}
          />
          
          <SettingsOption
            iconName="music"
            title="Música"
            subtitle="Configuración de audio"
            onPress={() => handleOptionPress('Música')}
          />
          
          <SettingsOption
            iconName="palette"
            title="Apariencia"
            subtitle="Temas y personalización"
            onPress={() => handleOptionPress('Apariencia')}
          />
          
          <SettingsOption
            iconName="help-circle"
            title="Ayuda y Soporte"
            subtitle="Centro de ayuda"
            onPress={() => handleOptionPress('Ayuda y Soporte')}
          />
          
          <SettingsOption
            iconName="information"
            title="Acerca de"
            subtitle="Información de la app"
            onPress={() => handleOptionPress('Acerca de')}
          />
        </View>

        {/* Botón de cerrar sesión */}
        <View style={styles.logoutContainer}>
          <ResizingButton
            title="Cerrar Sesión"
            onPress={handleLogout}
            backgroundColor="#FF3B30"
            textColor="#FFFFFF"
            borderColor="#FF3B30"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  optionsContainer: {
    paddingBottom: 32,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Espacio para el tab bar
  },
}); 