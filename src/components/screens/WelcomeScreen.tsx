import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';
import { useWelcomeAnimations } from '../../hooks/useWelcomeAnimations';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { supabase } from '../../utils/supabase';
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
  const hasNavigated = useRef(false);
  
  const { session, user, isLoading, profileCompletionStep, setProfileCompletionStep } = useAuth();
  const { signInWithSpotify, loading } = useSpotifyAuth();

  // Consulta de prueba al cargar la pantalla
  useEffect(() => {
    const testSupabaseQuery = async () => {
      try {
        console.log('[WelcomeScreen] Iniciando consulta de prueba a Supabase...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, display_name, email, avatar_url, bio, is_verified, is_public')
          .eq('id', '51b4ce83-5fef-4e29-a2e0-26806745c942')
          .single();
        
        console.log('[WelcomeScreen] Respuesta de prueba de Supabase:', { data, error });
        
        if (error) {
          console.error('[WelcomeScreen] Error en consulta de prueba:', error);
        } else {
          console.log('[WelcomeScreen] Datos obtenidos correctamente:', data);
        }
      } catch (error) {
        console.error('[WelcomeScreen] Error en consulta de prueba:', error);
      }
    };

    testSupabaseQuery();
  }, []);

  // Verificar perfil del usuario cuando se autentica
  const checkUserProfile = async (userId: string) => {
    try {
      console.log('[WelcomeScreen] Verificando perfil para usuario:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, display_name, avatar_url')
        .eq('id', userId)
        .single();
      
      console.log('[WelcomeScreen] Respuesta de verificación:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('[WelcomeScreen] Usuario no encontrado en profiles');
          return 0; // Sin perfil
        } else {
          console.error('[WelcomeScreen] Error al verificar perfil:', error);
          return 0; // Sin perfil
        }
      }

      if (data) {
        console.log('[WelcomeScreen] Datos de perfil encontrados:', data);
        
        if (data.username && data.display_name && data.avatar_url) {
          console.log('[WelcomeScreen] Perfil completo detectado');
          return 2; // Perfil completo
        } else if (data.display_name) {
          console.log('[WelcomeScreen] Perfil parcial detectado');
          return 1; // Perfil parcial
        } else {
          console.log('[WelcomeScreen] Perfil incompleto detectado');
          return 0; // Perfil incompleto
        }
      } else {
        console.log('[WelcomeScreen] No hay datos de perfil');
        return 0; // Sin perfil
      }
    } catch (error) {
      console.error('[WelcomeScreen] Error en checkUserProfile:', error);
      return 0; // Sin perfil
    }
  };

  // Detectar cuando el usuario se autentica exitosamente
  useEffect(() => {
    if (session && user && !hasNavigated.current && !isLoading) {
      console.log('[WelcomeScreen] Usuario autenticado, verificando perfil...');
      
      const handleAuthentication = async () => {
        const profileStep = await checkUserProfile(user.id);
        console.log('[WelcomeScreen] Profile step detectado:', profileStep);
        
        // Actualizar el contexto con el step detectado
        setProfileCompletionStep(profileStep);
        
        if (profileStep === 2) {
          // Usuario con perfil completo - no navegar, dejar que AppNavigator maneje
          console.log('[WelcomeScreen] Usuario con perfil completo, no navegando');
          hasNavigated.current = true;
        } else {
          // Usuario sin perfil completo - navegar a CreateProfile
          console.log('[WelcomeScreen] Usuario sin perfil completo, navegando a CreateProfile...');
          hasNavigated.current = true;
          
          setTimeout(() => {
            navigation.navigate('CreateProfile', { initialStep: profileStep });
          }, 100);
        }
      };

      handleAuthentication();
    }
  }, [session, user, isLoading, navigation]);

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
  
  const { renderAnimatedText } = useWelcomeAnimations({ 
    texts,
    intervalDuration: 5000,
    animationDuration: 200
  });

  const handleConnectSpotify = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await signInWithSpotify();
  }, [signInWithSpotify]);

  const handleShowSkipAlert = useCallback(() => {
    setShowSkipAlert(true);
  }, []);

  const handleContinueWithoutConnection = useCallback(() => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    setShowSkipAlert(false);
    navigation.navigate('CreateProfile', { initialStep: 0 });
  }, [navigation]);

  const handleCancelSkipAlert = useCallback(() => {
    setShowSkipAlert(false);
  }, []);

  return (
    <>
      <Layout>
        <View style={styles.container}>
          <View style={styles.mainContent}>
            {/* Contenido principal vacío */}
          </View>

          <View style={styles.animatedTextSection}>
            {renderAnimatedText(styles)}
          </View>

          <View style={styles.bottomSection}>
            <ResizingButton
              onPress={handleShowSkipAlert}
              title="Skip process"
              backgroundColor={Colors.background}
              textColor={Colors.white}
              borderColor={Colors.white}
              isLoading={false}
              isDisabled={loading || isLoading}
            />
            <View style={{paddingBottom: 10}}></View>
            <ResizingButton
              onPress={handleConnectSpotify}
              title="Conectar con Spotify"
              backgroundColor={Colors.white}
              textColor={Colors.background}
              isLoading={loading}
              isDisabled={loading || isLoading}
              icon={<SpotifyIcon size={28} color={Colors.background} />}
            />
          </View>
        </View>
      </Layout>

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
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  animatedTextSection: {
    paddingHorizontal: 24,
    marginBottom: 0,
    alignItems: 'flex-start',
    height: 100,
    width: '80%',
    justifyContent: 'center',
  },
  animatedTextContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
  },
  bottomSection: {
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
});