import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';
import { useWelcomeAnimations } from '../../hooks/useWelcomeAnimations';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { OnboardingCarousel } from '../ui/carousels/OnboardingCarousel';
import { Layout } from '../ui/layout/Layout';
import { ConfirmationDialog } from '../ui/modals/ConfirmationDialog';
import { ConnectionBottomSheet, ConnectionBottomSheetRef } from '../ui/modals/ConnectionBottomSheet';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const bottomSheetRef = useRef<ConnectionBottomSheetRef>(null);
  const [showSkipAlert, setShowSkipAlert] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Usar contexto de autenticación
  const { setUser } = useAuth();
  
  // Usar hooks personalizados
  const { isFirstLoad, titlePositionY, titleFontSize, backgroundOpacity, contentOpacity } = useWelcomeAnimations();
  
  const { connectSpotify } = useSpotifyAuth({
    onSuccess: (userProfile) => {
      console.log('Usuario autenticado:', userProfile);
      setIsAuthenticating(false);
      // Guardar usuario en el contexto
      setUser(userProfile);
      // Navegar a la pantalla de creación de perfil
      navigation.navigate('CreateProfile');
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

  const handleOpenSheet = useCallback(() => {
    // No abrir el sheet si ya estamos autenticando
    if (isAuthenticating) return;
    
    setTimeout(() => {
      bottomSheetRef.current?.expand();
      // Añadir vibración suave al abrir
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 100);
  }, [isAuthenticating]);

  const handleConnectSpotify = useCallback(async () => {
    // Marcar que estamos autenticando para evitar reabrir el sheet
    setIsAuthenticating(true);
    
    // Cerrar el BottomSheet
    bottomSheetRef.current?.close();
    
    // Esperar un poco para que se cierre el BottomSheet antes de abrir el navegador
    setTimeout(async () => {
      await connectSpotify();
    }, 100);
  }, [connectSpotify]);

  const handleConnectAppleMusic = useCallback(() => {
    // Cerrar el BottomSheet primero
    bottomSheetRef.current?.close();
    
    try {
      Notifier.showNotification({
        title: 'Próximamente en looped',
        description: 'Apple Music estará disponible pronto',
        duration: 3000,
        queueMode: 'reset',
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'info',
          backgroundColor: Colors.appleRed,
          textColor: Colors.white,
          titleStyle: {
            paddingTop: 24,
            fontSize: 20,
            fontWeight: '900',
            color: Colors.white,
            marginBottom: 4,
          },
          descriptionStyle: {
            fontSize: 14,
            fontWeight: '500',
            color: Colors.white,
          },
        },
        containerStyle: () => ({
          minHeight: 80,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          shadowColor: Colors.white,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }),
      });
      console.log('Notificación enviada correctamente');
    } catch (error) {
      console.error('Error mostrando notificación:', error);
    }
  }, []);

  const handleShowSkipAlert = useCallback(() => {
    // No cerrar el BottomSheet, solo mostrar la alerta
    setShowSkipAlert(true);
  }, []);

  const handleContinueWithoutConnection = useCallback(() => {
    setShowSkipAlert(false);
    // Cerrar el BottomSheet después de confirmar
    bottomSheetRef.current?.close();
    // Aquí puedes agregar la lógica para continuar sin conexión
  }, []);

  const handleCancelSkipAlert = useCallback(() => {
    setShowSkipAlert(false);
  }, []);

  return (
    <>
      <Layout>
        {/* Overlay negro para la animación inicial */}
        {isFirstLoad && (
          <Animated.View 
            style={[
              styles.blackOverlay,
              { opacity: backgroundOpacity }
            ]}
          />
        )}
        
        <View style={styles.container}>
          {/* Título fijo */}
          <Animated.View 
            style={[
              styles.titleContainer,
              {
                transform: [{
                  translateY: titlePositionY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 300], // 0 = posición final (arriba), 300 = centro de pantalla
                  })
                }]
              }
            ]}
          >
            <Animated.Text 
              style={[
                styles.title,
                {
                  fontSize: titleFontSize.interpolate({
                    inputRange: [0, 1],
                    outputRange: [32, 48], // De 48rpx (inicial) a 32px (final)
                  })
                }
              ]}
            >
              looped
            </Animated.Text>
          </Animated.View>

          {/* Contenido principal con carrusel */}
          <Animated.View 
            style={[
              styles.mainContent,
              { opacity: isFirstLoad ? contentOpacity : 1 }
            ]}
          >
            <OnboardingCarousel />
          </Animated.View>

          {/* Botón fijo abajo */}
          <Animated.View 
            style={[
              styles.bottomSection,
              { opacity: isFirstLoad ? contentOpacity : 1 }
            ]}
          >
            <ResizingButton
              onPress={handleOpenSheet}
              title="Conecta tu cuenta"
              backgroundColor={Colors.white}
              textColor={Colors.background}
            />
          </Animated.View>

          <ConnectionBottomSheet
            ref={bottomSheetRef}
            onConnectSpotify={handleConnectSpotify}
            onConnectAppleMusic={handleConnectAppleMusic}
            onShowSkipAlert={handleShowSkipAlert}
          />
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
  blackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  titleContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    zIndex: 11,
  },
  title: {
    fontWeight: '300',
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
    letterSpacing: -1,
    color: Colors.white,
  },
  mainContent: {
    flex: 1,
    width: '100%',
  },
  bottomSection: {
    paddingVertical: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
});