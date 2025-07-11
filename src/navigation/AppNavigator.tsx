import { Ionicons } from '@expo/vector-icons';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, Easing, Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { CreateProfileScreen, WelcomeScreen } from '../components';
import { SettingsScreen } from '../components/screens/SettingsScreen';
import { UserProfileScreen } from '../components/screens/UserProfileScreen';
import { BottomNavigationBar } from '../components/ui/navigation/BottomNavigationBar';
import { Colors } from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
  Welcome: undefined;
  CreateProfile: undefined;
  MainApp: undefined;
  Settings: undefined;
  UserProfile: { userId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

// Componente del botón de header optimizado
const HeaderBackButton: React.FC<{ onPress: () => void }> = React.memo(({ onPress }) => {
  const button = (
    <View style={{
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8, // Más padding por la izquierda
    }}>
      <Ionicons name="arrow-back" size={28} color={Colors.white} />
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(Colors.white, true, 24)}
      >
        {button}
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity onPress={onPress}>
      {button}
    </TouchableOpacity>
  );
});

// Pantalla de carga mientras se determina el estado de autenticación
const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    backgroundColor: Colors.background, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <ActivityIndicator size="large" color={Colors.white} />
  </View>
);

export const AppNavigator = () => {
  const { isLoading, hasCompletedProfile } = useAuth();

  // Log para debugging
  useEffect(() => {
    console.log('AppNavigator - Estado de autenticación:', { 
      isLoading, 
      hasCompletedProfile,
    });
  }, [isLoading, hasCompletedProfile]);

  // Mostrar pantalla de carga mientras se determina el estado
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!hasCompletedProfile) {
    // Usuario sin perfil completado - mostrar welcome y create profile
    return (
      <Stack.Navigator
        key="welcome-stack"
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          // Prevenir flash blanco
          cardStyle: { backgroundColor: Colors.background },
          // Optimizaciones para react-native-screens
          detachPreviousScreen: true,
          freezeOnBlur: true,
          presentation: 'card',
          // Optimizaciones adicionales de transición
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 300,
                easing: Easing.out(Easing.cubic),
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 300,
                easing: Easing.out(Easing.cubic),
              },
            },
          },
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
        />
        <Stack.Screen 
          name="CreateProfile" 
          component={CreateProfileScreen}
          options={({ navigation }) => ({
            headerShown: false,
            headerStyle: {
              backgroundColor: Colors.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              height: 100,
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
      </Stack.Navigator>
    );
  }

  // Usuario con perfil completado - mostrar app principal
  return (
    <Stack.Navigator
      key="main-app-stack"
      initialRouteName="MainApp"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        // Prevenir flash blanco
        cardStyle: { backgroundColor: Colors.background },
        // Optimizaciones para react-native-screens
        detachPreviousScreen: false,
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen 
          name="MainApp" 
          component={BottomNavigationBar}
          options={{
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
            animationTypeForReplace: 'push',
            // Optimización adicional para evitar flash
            cardStyle: { backgroundColor: Colors.background },
          }}
        />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Settings',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.goBack()} />
          ),
          headerLeftContainerStyle: {
            paddingLeft: 8,
          },
          headerStyle: {
            backgroundColor: Colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          cardStyle: { backgroundColor: Colors.background },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: Colors.white,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        })}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={({ navigation }) => ({
          headerShown: false,
          cardStyle: { backgroundColor: Colors.background },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          // Optimización para área de gesto
          gestureResponseDistance: 50, // Área sensible al gesto desde el borde
        })}
      />
    </Stack.Navigator>
  );
}; 