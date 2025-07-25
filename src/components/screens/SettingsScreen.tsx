import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ResizingButton } from '../ui/buttons';
import { GlobalHeader } from '../ui/headers/GlobalHeader';
import { Layout } from '../ui/layout/Layout';
import { ConfirmationDialog } from '../ui/modals/ConfirmationDialog';
import { OptionsBottomSheet, OptionsBottomSheetRef } from '../ui/modals/OptionsBottomSheet';
import {
  SettingsItem,
  SettingsProfileSection,
  SettingsSectionTitle
} from '../ui/sections';

// Importar iconos personalizados
import DocumentIcon from '../../../assets/icons/document.svg';
import LanguageIcon from '../../../assets/icons/language.svg';
import UserLockIcon from '../../../assets/icons/user-lock.svg';
import verifiedBlue from '../../../assets/icons/verified_blue.png';
import { AppText } from '../ui/Text/AppText';


type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { user, session, logout } = useAuth();
  const { profile: currentUser } = useProfile();
  
  // Toggle switch state management
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetNotificationsEnabled = (value: boolean) => {
    if (isMounted.current) {
      setNotificationsEnabled(value);
    }
  };
  
  // User preference selections state
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  // const [selectedPrivacy, setSelectedPrivacy] = useState('public'); // Eliminar este estado
  
  // Logout operation state management to prevent race conditions and provide user feedback
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // Estado para mostrar el diálogo de confirmación
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Bottom sheet modal references for option selection
  const [showOptionsSheet, setShowOptionsSheet] = useState<null | 'language' | 'privacy'>(null);
  const optionsBottomSheetRef = useRef<OptionsBottomSheetRef>(null);

  // Elimina el estado openSheet

  // Estado para el BottomSheet de prueba
  const [testSheetOpen, setTestSheetOpen] = useState(false);

  // (Elimina el useEffect de apertura automática)

  // Obtener datos del usuario autenticado desde Supabase
  const userData = {
    displayName: currentUser?.display_name || 'Usuario',
    username: currentUser?.username || 'usuario',
    avatarUrl: currentUser?.avatar_url || undefined,
  };

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

  // Obtener el valor real de privacidad del contexto
  const getPrivacyLabel = () => {
    if (currentUser && typeof currentUser.is_public === 'boolean') {
      return currentUser.is_public ? 'Público' : 'Privado';
    }
    return 'Público';
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



  // Ahora se usan las funciones utilitarias importadas

  const handleLanguagePress = () => {
    if (showOptionsSheet === 'language') {
      setShowOptionsSheet(null);
      setTimeout(() => setShowOptionsSheet('language'), 20);
    } else {
      setShowOptionsSheet('language');
    }
  };

  const handlePrivacyPress = () => {
    if (showOptionsSheet === 'privacy') {
      setShowOptionsSheet(null);
      setTimeout(() => setShowOptionsSheet('privacy'), 20);
    } else {
      setShowOptionsSheet('privacy');
    }
  };

  const handleOptionsSelect = (value: string) => {
    if (showOptionsSheet === 'language') {
      setSelectedLanguage(value);
      console.log('Idioma seleccionado:', value);
    } else if (showOptionsSheet === 'privacy') {
      // setSelectedPrivacy(value); // Eliminar esta línea
      console.log('Privacidad seleccionada:', value);
    }
    setShowOptionsSheet(null);
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

  const handleLogoutPress = async () => {
    try {
      await logout();
      // Aquí puedes navegar a la pantalla de login si es necesario
    } catch (error) {
      // Maneja el error si lo necesitas
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    if (showOptionsSheet && optionsBottomSheetRef.current) {
      setTimeout(() => {
        optionsBottomSheetRef.current?.expand();
      }, 10); // 10ms suele ser suficiente para que el ref se asigne
    }
  }, [showOptionsSheet]);

  return (
    <Layout excludeBottomSafeArea>
      <View style={styles.container}>
        <GlobalHeader 
        goBack={true} onLeftIconPress={handleBackPress} 
        centerContent={<AppText variant='h4' fontFamily='raleway' fontWeight='bold' color="#fff">Ajustes</AppText>} 
        />
        
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
              onSwitchChange={safeSetNotificationsEnabled}
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
              subtitle={getPrivacyLabel()}
              iconColor={Colors.mutedWhite}
              onPress={() => navigation.navigate('AccountPrivacy' as never)}
            />
            <SettingsItem
              customIcon={
                <Image 
                  source={verifiedBlue} 
                  style={[styles.verifiedIcon, { tintColor: Colors.mutedWhite }]}
                />
              }
              title="Verificado"
              onPress={() => handleOptionPress('Verificado')}
            />
            <SettingsItem
              icon="account-remove"
              title="Eliminar cuenta"
              onPress={() => {
                // No action for now, as handleDeleteAccount is removed
                console.log('Eliminar cuenta presionado');
              }}
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
              onPress={() => setShowLogoutDialog(true)}
              backgroundColor={Colors.backgroundSoft}
              textColor={Colors.appleRed}
              icon={<Icon source="logout" size={20} color={Colors.appleRed} />}
              isLoading={isLoggingOut}
            />
          </View>
          
          {/* Espacio adicional para el tab bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      {/* Bottom Sheets - Optimizado: solo uno y solo se monta cuando se necesita */}
      {showOptionsSheet && (
        <OptionsBottomSheet
          ref={optionsBottomSheetRef}
          title={showOptionsSheet === 'language' ? 'Idioma' : 'Privacidad'}
          options={showOptionsSheet === 'language' ? languageOptions : privacyOptions}
          selectedValue={showOptionsSheet === 'language' ? selectedLanguage : 'public'} // Asumiendo un valor por defecto para la privacidad
          onOptionSelect={handleOptionsSelect}
        />
      )}

      {/* ConfirmationDialog para cerrar sesión */}
      <ConfirmationDialog
        visible={showLogoutDialog}
        title="¿Cerrar sesión?"
        description="¿Estás seguro de que quieres cerrar sesión?"
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={async () => {
          setShowLogoutDialog(false);
          setTimeout(async () => {
            await handleLogoutPress();
          }, 300);
        }}
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
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
    backgroundColor: Colors.backgroundSoft,
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