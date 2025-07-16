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
  const [showSkipAlert, setShowSkipAlert] = useState(false);
  const hasNavigated = useRef(false);
  
  const { session, user, isLoading } = useAuth();
  const { signInWithSpotify, loading } = useSpotifyAuth();

  // Detectar cuando el usuario se autentica exitosamente
  useEffect(() => {
    console.log('[WelcomeScreen] ===== ESTADO DE AUTENTICACIÓN =====');
    console.log('[WelcomeScreen] Tiene sesión:', !!session);
    console.log('[WelcomeScreen] Tiene usuario:', !!user);
    console.log('[WelcomeScreen] Está cargando:', isLoading);
    console.log('[WelcomeScreen] Ya navegó:', hasNavigated.current);
    
    if (session && user && !hasNavigated.current && !isLoading) {
      console.log('[WelcomeScreen] ✅ CONDICIONES CUMPLIDAS - NAVEGANDO');
      console.log('[WelcomeScreen] Usuario autenticado detectado:');
      console.log('[WelcomeScreen] - ID:', user.id);
      console.log('[WelcomeScreen] - Email:', user.email);
      console.log('[WelcomeScreen] - Provider:', user.app_metadata?.provider);
      
      hasNavigated.current = true;
      
      setTimeout(() => {
        console.log('[WelcomeScreen] 🚀 Navegando a CreateProfile...');
        navigation.navigate('CreateProfile');
      }, 100);
    } else {
      console.log('[WelcomeScreen] ❌ Condiciones no cumplidas para navegar');
      if (!session) console.log('[WelcomeScreen] - Falta sesión');
      if (!user) console.log('[WelcomeScreen] - Falta usuario');
      if (hasNavigated.current) console.log('[WelcomeScreen] - Ya navegó');
      if (isLoading) console.log('[WelcomeScreen] - Aún cargando');
    }
    console.log('[WelcomeScreen] =======================================');
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
    navigation.navigate('CreateProfile');
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