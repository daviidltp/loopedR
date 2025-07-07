import { StackNavigationProp } from '@react-navigation/stack';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useRef, useState } from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';
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
          Cada <AppText variant="h1" fontWeight="bold" color={Colors.secondaryGreen}>domingo</AppText> a las <AppText variant="h1" fontWeight="bold" color={Colors.secondaryGreen}>21:00</AppText>
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
  
  // Usar contexto de autenticación
  const { setUser } = useAuth();
  
  const { connectSpotify } = useSpotifyAuth({
    onSuccess: (userProfile) => {
      console.log('Usuario autenticado:', userProfile);
      setIsAuthenticating(false);
      // Guardar usuario en el contexto
      setUser(userProfile);
      navigation.reset({
        index: 0,
        routes: [{ name: 'CreateProfile' }],
      });
    },
    onError: (error) => {
      console.error('Error en autenticación:', error);
      setIsAuthenticating(false);
    },
    onCancel: () => {
      console.log('Autenticación cancelada');
      setIsAuthenticating(false);
    },
  });

  const handleConnectSpotify = useCallback(async () => {
    // Marcar que estamos autenticando
    setIsAuthenticating(true);
    
    // Añadir vibración suave
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Conectar con Spotify directamente
    await connectSpotify();
  }, [connectSpotify]);

  const handleShowSkipAlert = useCallback(() => {
    setShowSkipAlert(true);
  }, []);

  const handleContinueWithoutConnection = useCallback(() => {
    if (isNavigating.current) return;
    
    isNavigating.current = true;
    setShowSkipAlert(false);

    // Esperar a que termine cualquier interacción antes de navegar
    InteractionManager.runAfterInteractions(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'CreateProfile' }],
      });
    });
  }, [navigation]);

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
              //onPress={handleConnectSpotify}
              onPress={handleContinueWithoutConnection}
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