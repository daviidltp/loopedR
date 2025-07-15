import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
  console.log('🏠 WelcomeScreen: Component rendered/re-rendered');
  
  const [showSkipAlert, setShowSkipAlert] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const isNavigating = useRef(false);
  const hasNavigated = useRef(false); // Prevenir navegación múltiple
  
  // Detectar mount/unmount del componente
  useEffect(() => {
    console.log('🔄 WelcomeScreen: Component mounted');
    return () => {
      console.log('🔄 WelcomeScreen: Component unmounted');
      // Limpiar refs al desmontar
      isNavigating.current = false;
      hasNavigated.current = false;
    };
  }, []);
  
  // Mantener los dos contextos separados
  const { setUser } = useAuth(); // Para autenticación con Spotify
  const { setUserProfileData } = useAuth(); // Para crear perfil sin Spotify

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
  
  // Usar contexto de autenticación
  const { connectSpotify } = useSpotifyAuth({
    onSuccess: (userProfile) => {
      console.log('🎉 WelcomeScreen: Usuario autenticado con Spotify via Supabase:', {
        id: userProfile.id,
        display_name: userProfile.display_name,
        email: userProfile.email,
        username: userProfile.username,
        hasSpotifyData: !!userProfile.spotify_id
      });
      
      // Prevenir múltiples navegaciones
      if (hasNavigated.current) {
        console.log('⚠️ WelcomeScreen: Navigation already handled, skipping');
        return;
      }
      
      hasNavigated.current = true;
      setIsAuthenticating(false);
      
      console.log('💾 WelcomeScreen: Guardando usuario en contexto...');
      // Guardar usuario en el contexto
      setUser(userProfile);
      
      // Navegar a CreateProfile después de un pequeño delay
      // para asegurar que el estado se actualice correctamente
      setTimeout(() => {
        if (!isNavigating.current) {
          isNavigating.current = true;
          console.log('🚀 WelcomeScreen: Navegando a CreateProfile...');
          try {
            navigation.navigate('CreateProfile');
            console.log('✅ WelcomeScreen: Navegación a CreateProfile exitosa');
          } catch (navError) {
            console.error('❌ WelcomeScreen: Error navegando a CreateProfile:', navError);
          }
        } else {
          console.log('⚠️ WelcomeScreen: Navigation already in progress, skipping');
        }
      }, 100);
    },
    onError: (error) => {
      console.error('❌ WelcomeScreen: Error en autenticación con Supabase:', error);
      setIsAuthenticating(false);
      hasNavigated.current = false; // Permitir reintentos
    },
    onCancel: () => {
      console.log('⏹️ WelcomeScreen: Autenticación cancelada');
      setIsAuthenticating(false);
      hasNavigated.current = false; // Permitir reintentos
    },
  });

  const handleConnectSpotify = useCallback(async () => {
    // Marcar que estamos autenticando
    setIsAuthenticating(true);
    
    // Añadir vibración suave
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Conectar con Spotify directamente
    await connectSpotify();
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
      setUser(baseUser);

      await setUserProfileData(baseUser.username, baseUser.name);
    
      
    } catch (error) {
      console.error('Error al continuar sin conexión:', error);
    } finally {
      isNavigating.current = false;
    }
  }, [setUser, navigation]);

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
              //onPress={handleContinueWithoutConnection}
              title="Skip process"
              backgroundColor={Colors.background}
              textColor={Colors.white}
              borderColor={Colors.white}
              isLoading={false}
              isDisabled={isAuthenticating}
            />
            <View style={{paddingBottom: 10}}></View>
            <ResizingButton
              onPress={handleConnectSpotify}
              //onPress={handleContinueWithoutConnection}
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
    marginBottom: 0,
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