import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { currentUser } from '../../utils/mockData';
import { clearSpotifySession } from '../../utils/spotifyAuth';
import { DangerButton } from '../ui/buttons/DangerButton';
import { SettingsHeader } from '../ui/headers/SettingsHeader';
import { Layout } from '../ui/layout/Layout';
import { OptionsBottomSheet, OptionsBottomSheetRef } from '../ui/modals';
import {
  SettingsItem,
  SettingsProfileSection,
  SettingsSectionTitle
} from '../ui/sections';

// Importar iconos personalizados
import DocumentIcon from '../../../assets/icons/document.svg';
import LanguageIcon from '../../../assets/icons/language.svg';
import UserLockIcon from '../../../assets/icons/user-lock.svg';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { logout } = useAuth();
  
  // Estados para los switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Estados para opciones seleccionadas
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [selectedPrivacy, setSelectedPrivacy] = useState('public');
  
  // Referencias a los bottom sheets
  const languageBottomSheetRef = useRef<OptionsBottomSheetRef>(null);
  const privacyBottomSheetRef = useRef<OptionsBottomSheetRef>(null);

  // Usar los datos del currentUser del mockData, como hace ProfileScreen
  const userData = currentUser;

  // Opciones para los bottom sheets
  const languageOptions = [
    { id: 'es', label: 'Español', value: 'es' },
    { id: 'en', label: 'English', value: 'en' },
  ];

  const privacyOptions = [
    { id: 'public', label: 'Público', value: 'public' },
    { id: 'private', label: 'Privado', value: 'private' },
  ];

  // Funciones para obtener labels actuales
  const getLanguageLabel = (value: string) => {
    const option = languageOptions.find(opt => opt.value === value);
    return option ? option.label : 'Español';
  };

  const getPrivacyLabel = (value: string) => {
    const option = privacyOptions.find(opt => opt.value === value);
    return option ? option.label : 'Público';
  };

  // Manejar el botón físico de Android
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditProfile = () => {
    console.log('Edit profile pressed');
    navigation.navigate('EditProfile');
  };

  const handleLogout = async () => {
    try {
      console.log('Cerrando sesión...');
      await clearSpotifySession();
      await logout();
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleDeleteAccount = () => {
    console.log('Delete account pressed');
    // Mostrar confirmación para eliminar cuenta
  };

  const handleLanguagePress = () => {
    languageBottomSheetRef.current?.expand();
  };

  const handlePrivacyPress = () => {
    privacyBottomSheetRef.current?.expand();
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    console.log('Idioma seleccionado:', language);
  };

  const handlePrivacySelect = (privacy: string) => {
    setSelectedPrivacy(privacy);
    console.log('Privacidad seleccionada:', privacy);
  };

  const handleOptionPress = async (option: string) => {
    console.log(`Pressed: ${option}`);
    
    try {
      switch (option) {
        case 'Idioma':
          handleLanguagePress();
          break;
        case 'Privacidad':
          handlePrivacyPress();
          break;
        case 'Política de privacidad':
          await WebBrowser.openBrowserAsync('https://looped-web.pages.dev/privacidad/');
          break;
        case 'Términos y condiciones':
          await WebBrowser.openBrowserAsync('https://looped-web.pages.dev/terminos/');
          break;
        default:
          // Navegación a diferentes pantallas según la opción
          console.log(`Navegando a: ${option}`);
          break;
      }
    } catch (error) {
      console.error('Error al abrir el enlace:', error);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <SettingsHeader onBackPress={handleBackPress} />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Sección de perfil */}
          <SettingsProfileSection
            name={userData.displayName}
            username={userData.username}
            avatarUrl={userData.avatarUrl}
            onEditPress={handleEditProfile}
          />

          {/* Sección Preferencias */}
          <SettingsSectionTitle title="Preferencias" />
          <View style={styles.section}>
            <SettingsItem
              icon="bell"
              title="Notificaciones"
              iconColor={Colors.mutedWhite}
              hasSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            <SettingsItem
              customIcon={<LanguageIcon width={24} height={24} fill={Colors.background} stroke={Colors.mutedWhite}/>}
              title="Idioma"
              subtitle={getLanguageLabel(selectedLanguage)}
              onPress={() => handleOptionPress('Idioma')}
              isLast={true}
            />
          </View>

          {/* Sección Cuenta */}
          <SettingsSectionTitle title="Cuenta" />
          <View style={styles.section}>
            <SettingsItem
              icon="lock"
              title="Privacidad"
              subtitle={getPrivacyLabel(selectedPrivacy)}
              iconColor={Colors.mutedWhite}
              onPress={() => handleOptionPress('Privacidad')}
            />
            <SettingsItem
              customIcon={
                <Image 
                  source={require('../../../assets/icons/verified_blue.png')} 
                  style={[styles.verifiedIcon, { tintColor: Colors.mutedWhite }]}
                />
              }
              title="Verificado"
              onPress={() => handleOptionPress('Verificado')}
            />
            <SettingsItem
              icon="logout"
              title="Cerrar sesión"
              iconColor={Colors.mutedWhite}
              onPress={handleLogout}
              isLast={true}
            />
          </View>

          {/* Sección Legal */}
          <SettingsSectionTitle title="Legal" />
          <View style={styles.section}>
            <SettingsItem
              customIcon={<UserLockIcon width={22} height={22} fill={Colors.mutedWhite} />}
              title="Política de privacidad"
              onPress={() => handleOptionPress('Política de privacidad')}
            />
            <SettingsItem
              customIcon={<DocumentIcon width={22} height={22} fill={Colors.mutedWhite} />}
              title="Términos y condiciones"
              onPress={() => handleOptionPress('Términos y condiciones')}
              isLast={true}
            />
          </View>

          {/* Botón de eliminar cuenta */}
          <DangerButton
            icon="account-remove"
            title="Eliminar cuenta"
            onPress={handleDeleteAccount}
          />
          
          {/* Espacio adicional para el tab bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      {/* Bottom Sheets */}
      <OptionsBottomSheet
        ref={languageBottomSheetRef}
        title="Idioma"
        options={languageOptions}
        selectedValue={selectedLanguage}
        onOptionSelect={handleLanguageSelect}
      />

      <OptionsBottomSheet
        ref={privacyBottomSheetRef}
        title="Privacidad"
        options={privacyOptions}
        selectedValue={selectedPrivacy}
        onOptionSelect={handlePrivacySelect}
      />
    </Layout>
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
  section: {
    backgroundColor: '#151515',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#22222200',
    marginHorizontal: 20,
    marginBottom: 8,
    overflow: 'hidden',
  },
  verifiedIcon: {
    width: 20,
    height: 20,
  },
  bottomSpacer: {
    height: 50,
  },
}); 