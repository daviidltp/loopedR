import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { currentUser } from '../../utils/mockData';
import { ResizingButton } from '../ui/buttons';
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
  
  // Toggle switch state management
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // User preference selections state
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [selectedPrivacy, setSelectedPrivacy] = useState('public');
  
  // Logout operation state management to prevent race conditions and provide user feedback
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Bottom sheet modal references for option selection
  const languageBottomSheetRef = useRef<OptionsBottomSheetRef>(null);
  const privacyBottomSheetRef = useRef<OptionsBottomSheetRef>(null);

  // Mock user data source - TODO: Replace with actual user data from authentication context
  const userData = currentUser;

  // Configuration options for bottom sheet modals
  const languageOptions = [
    { id: 'es', label: 'Español', value: 'es' },
    { id: 'en', label: 'English', value: 'en' },
  ];

  const privacyOptions = [
    { id: 'public', label: 'Público', value: 'public' },
    { id: 'private', label: 'Privado', value: 'private' },
  ];

  // Utility functions to get display labels for current selections
  const getLanguageLabel = (value: string) => {
    const option = languageOptions.find(opt => opt.value === value);
    return option ? option.label : 'Español';
  };

  const getPrivacyLabel = (value: string) => {
    const option = privacyOptions.find(opt => opt.value === value);
    return option ? option.label : 'Público';
  };

  // Android hardware back button handler setup
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Cleanup listener on component unmount
    return () => backHandler.remove();
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditProfile = () => {
    console.log('Edit profile pressed');
    navigation.navigate('EditProfile');
  };

  /**
   * Safely clears the Spotify session with platform-specific handling.
   * 
   * iOS: Uses Promise.race with a 2-second timeout to prevent indefinite hanging
   * that can occur with WebBrowser.dismissBrowser() on iOS devices.
   * 
   * Android: Uses standard WebBrowser.dismissBrowser() with error handling.
   * 
   * @returns Promise<void> - Always resolves, never throws to prevent logout blocking
   */
  const clearSpotifySessionSafe = async (): Promise<void> => {
    try {
      console.log('SettingsScreen: Initiating Spotify session cleanup');
      
      if (Platform.OS === 'ios') {
        // iOS-specific timeout mechanism to prevent WebBrowser.dismissBrowser() hanging
        const timeoutPromise = new Promise<void>((resolve) => {
          setTimeout(() => {
            console.log('SettingsScreen: iOS timeout reached, proceeding with logout');
            resolve();
          }, 2000);
        });
        
        const dismissPromise = WebBrowser.dismissBrowser().catch((error) => {
          console.log('SettingsScreen: Expected iOS browser dismissal error:', error.message);
          // Error is caught and logged but not re-thrown to prevent blocking
        });
        
        // Race condition ensures logout proceeds regardless of browser dismissal success
        await Promise.race([dismissPromise, timeoutPromise]);
      } else {
        // Android platform uses standard implementation with graceful error handling
        await WebBrowser.dismissBrowser().catch((error) => {
          console.log('SettingsScreen: Android browser dismissal error:', error.message);
        });
      }
      
      console.log('SettingsScreen: Spotify session cleanup completed');
    } catch (error) {
      console.log('SettingsScreen: Unexpected error during Spotify cleanup:', error);
      // Errors are logged but not re-thrown to ensure logout process continues
    }
  };

  /**
   * Handles the user logout process with protection against concurrent executions.
   * 
   * The logout process consists of two main steps:
   * 1. Clear Spotify authentication session (platform-specific handling)
   * 2. Clear application authentication state and local storage
   * 
   * @returns Promise<void> - Completes logout process or handles errors gracefully
   */
  const handleLogout = async () => {
    // Prevent concurrent logout operations to avoid race conditions
    if (isLoggingOut) {
      console.log('SettingsScreen: Logout already in progress, ignoring duplicate request');
      return;
    }

    try {
      setIsLoggingOut(true);
      console.log('SettingsScreen: Initiating logout sequence');
      
      // Step 1: Clear Spotify session with platform-specific error handling
      await clearSpotifySessionSafe();
      
      // Step 2: Clear application authentication state and persistent storage
      console.log('SettingsScreen: Clearing application authentication state');
      await logout();
      
      console.log('SettingsScreen: Logout sequence completed successfully');
    } catch (error) {
      console.error('SettingsScreen: Error during logout sequence:', error);
    } finally {
      // Reset loading state with delay to provide visual feedback
      // and prevent immediate re-triggering of the logout action
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 1000);
    }
  };

  const handleDeleteAccount = () => {
    console.log('SettingsScreen: Delete account action triggered');
    // TODO: Implement account deletion confirmation dialog
    // Should include user verification and irreversible action warning
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

  /**
   * Handles selection of various settings options including modal displays and external links.
   * 
   * @param option - The settings option identifier
   * @returns Promise<void> - Completes the action or handles errors gracefully
   */
  const handleOptionPress = async (option: string) => {
    console.log(`SettingsScreen: Option selected - ${option}`);
    
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
          // Handle navigation to other screens based on option selection
          console.log(`SettingsScreen: Navigating to - ${option}`);
          break;
      }
    } catch (error) {
      console.error('SettingsScreen: Error handling option selection:', error);
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
              icon="account-remove"
              title="Eliminar cuenta"
              onPress={handleDeleteAccount}
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

          {/* Botón de cerrar sesión */}
          <View style={styles.logoutContainer}>
            <ResizingButton
              title={isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
              onPress={handleLogout}
              backgroundColor="#151515"
              textColor={Colors.appleRed}
              icon={<Icon source="logout" size={20} color={Colors.appleRed} />}
              isLoading={isLoggingOut}
            />
          </View>
          
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
  logoutContainer: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 20,
  },
}); 