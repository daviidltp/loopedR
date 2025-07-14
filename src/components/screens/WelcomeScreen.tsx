import { StackNavigationProp } from '@react-navigation/stack';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useWelcomeAnimations } from '../../hooks/useWelcomeAnimations';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { SpotifyIcon } from '../icons/SpotifyIcon';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { Layout } from '../ui/layout/Layout';
import { ConfirmationDialog } from '../ui/modals/ConfirmationDialog';
import { AppText } from '../ui/Text/AppText';


type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [showSkipAlert, setShowSkipAlert] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const isNavigating = useRef(false);
  
  // Usar solo el contexto de autenticación
  const { connectSpotify, setUserProfileData } = useAuth();

  // Obtener el URI de redirección para mostrarlo
  const redirectUri = Constants.appOwnership === 'expo' 
    ? AuthSession.makeRedirectUri() 
    : 'loopedr://callback';

  // Textos que se van alternando
  const texts = [
    {
      content: (
        <>
          Bienvenido a <AppText variant="h1" fontWeight="bold" fontFamily='raleway' color={Colors.secondaryGreen}>looped</AppText>
        </>
      )
    },
    {
      content: "Tus canciones más escuchadas"
    },
    {
      content: (
        <>
          Cada <AppText variant="h1" fontWeight="bold" fontFamily='inter' color={Colors.secondaryGreen}>domingo</AppText> a las <AppText variant="h1" fontWeight="bold" color={Colors.secondaryGreen}>21:00</AppText>
        </>
      )
    },
    {
      content: (
        <>
            Comparte{'\n'}<AppText 
            variant="h1" 
            fontStyle="italic"
            fontFamily='libreCaslonText'
            style={{ 
              letterSpacing: 0.1,
            }}
          >
            lo que quieras
          </AppText>
        </>
      )
     },
  ];
  
  // Hook para las animaciones del texto
  const { renderAnimatedText } = useWelcomeAnimations({ 
    texts,
    intervalDuration: 5000,
    animationDuration: 200
  });
  
  const handleConnectSpotify = useCallback(async () => {
    console.log('WelcomeScreen: Starting Spotify connection process with Supabase');
    
    try {
      // Marcar que estamos autenticando
      setIsAuthenticating(true);
      
      // Añadir vibración suave
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      // iOS timeout mechanism
      let timeoutId: number | undefined;
      const isIOS = require('react-native').Platform.OS === 'ios';
      
      if (isIOS) {
        console.log('WelcomeScreen: Setting iOS maximum attempt timeout (8 seconds)');
        timeoutId = setTimeout(() => {
          console.log('WelcomeScreen: iOS timeout reached - stopping authentication attempt');
          setIsAuthenticating(false);
        }, 8000);
      }
      
      // Conectar con Spotify usando Supabase
      await connectSpotify();
      console.log('WelcomeScreen: Spotify OAuth initiated, waiting for session');
      
      // Clear timeout if successful
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
    } catch (error) {
      console.error('WelcomeScreen: Error connecting to Spotify:', error);
      setIsAuthenticating(false);
    }
  }, [connectSpotify]);

  const handleShowSkipAlert = useCallback(() => {
    setShowSkipAlert(true);
  }, []);

  const handleContinueWithoutConnection = useCallback(async () => {
    if (isNavigating.current) return;
    
    isNavigating.current = true;
    setShowSkipAlert(false);
  
    try {
      // Pequeño delay para asegurar que el diálogo se cierre
      await new Promise(resolve => setTimeout(resolve, 0));

      // Primero crear un usuario base
      const baseUser = {
        username: 'usuario_' + Math.random().toString(36).substr(2, 9),
        name: 'Usuario sin conexión'
      };
      
      // Establecer el usuario base
      // setUser(baseUser); // This line was removed as per the new_code

      await setUserProfileData(baseUser.username, baseUser.name);
    
      
    } catch (error) {
      console.error('Error al continuar sin conexión:', error);
    } finally {
      isNavigating.current = false;
    }
  }, [setUserProfileData, navigation]); // Added setUserProfileData to dependencies

  const handleCancelSkipAlert = useCallback(() => {
    setShowSkipAlert(false);
  }, []);

  return (
    <>
      <Layout>
        <View style={styles.container}>

          {/* Contenido principal */}
          <View style={styles.mainContent}>
            {/* Contenido principal vacío o puedes agregar descripción aquí */}
          </View>

          {/* Texto animado */}
          <View style={styles.animatedTextSection}>
            {renderAnimatedText(styles)}
          </View>

          {/* Botón fijo abajo */}
          <View style={styles.bottomSection}>
            <ResizingButton
              onPress={handleShowSkipAlert}
              title="Continuar sin Spotify"
              backgroundColor={Colors.background}
              textColor={Colors.white}
              borderColor={Colors.white}
              isLoading={false}
              isDisabled={isAuthenticating}
            />
            <View style={{paddingBottom: 8}}></View>
            <ResizingButton
              onPress={handleConnectSpotify}
              title="Conectar con Spotify"
              backgroundColor={Colors.white}
              textColor={Colors.background}
              isLoading={isAuthenticating}
              isDisabled={isAuthenticating}
              icon={<SpotifyIcon size={28} color={Colors.background} />}
            />
          </View>
        </View>
      </Layout>

      {/* Modal completamente independiente */}
      {showSkipAlert && (
        <ConfirmationDialog
          visible={showSkipAlert}
          title="Continuar sin vinculación"
          description="Si continúas, en todas tus publicaciones se alertará de que esa puede no ser tu música más escuchada realmente"
          onCancel={handleCancelSkipAlert}
          onConfirm={handleContinueWithoutConnection}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  debugContainer: {
    padding: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.white + '40',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  animatedTextSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'flex-start', // Alineado a la izquierda
    height: 100, // Aumentado para evitar que se corte el texto largo
    width: '80%',
    justifyContent: 'center',
  },
  animatedTextContainer: {
    alignItems: 'flex-start', // Alineado a la izquierda
    justifyContent: 'center',
    width: '100%',
  },

  bottomSection: {
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
});