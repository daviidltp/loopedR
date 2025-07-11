import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierWrapper } from 'react-native-notifier';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/contexts/AuthContext';
import { useFonts } from './src/hooks/useFonts';
import { AppNavigator } from './src/navigation/AppNavigator';

// Habilitar react-native-screens para mejor rendimiento
enableScreens();

// Prevenir que la splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const { fontsLoaded, fontError } = useFonts();

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Esperar a que las fuentes se carguen
        if (fontsLoaded) {
          if (fontError) {
            console.warn('⚠️ App iniciando con errores de fuentes:', fontError);
          }
          setIsAppReady(true);
        }
      } catch (e) {
        console.warn('Error preparando la app:', e);
        // En caso de error, permitir que la app continue
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      // Ocultar la splash screen cuando la app esté lista
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer theme={{
            dark: true,
            colors: {
              primary: '#ffffff',
              background: '#000000',
              card: '#000000',
              text: '#ffffff',
              border: '#000000',
              notification: '#ff453a',
            },
            fonts: {
              regular: {
                fontFamily: 'System',
                fontWeight: 'normal' as const,
              },
              medium: {
                fontFamily: 'System',
                fontWeight: '500' as const,
              },
              bold: {
                fontFamily: 'System',
                fontWeight: 'bold' as const,
              },
              heavy: {
                fontFamily: 'System',
                fontWeight: '900' as const,
              },
            },
          }}>
            <NotifierWrapper>
              <AppNavigator />
            </NotifierWrapper>
          </NavigationContainer>
        </AuthProvider>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
