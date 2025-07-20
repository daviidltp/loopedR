import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { ActivityIndicator, Easing, View } from 'react-native';
import { CreateProfileScreen, WelcomeScreen } from '../components';
import { EditProfileScreen } from '../components/screens/EditProfileScreen';
import { EditProfileElement } from '../components/screens/EditProfileScreens/EditProfileElement';
import { SettingsScreen } from '../components/screens/SettingsScreen';
import { UserProfileScreen } from '../components/screens/UserProfileScreen';
import { BottomNavigationBar } from '../components/ui/navigation/BottomNavigationBar';
import { Colors } from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
  Welcome: undefined;
  CreateProfile: { initialStep?: number };
  MainApp: undefined;
  Settings: undefined;
  EditProfile: undefined;
  EditProfileElement: { field: 'name' | 'username' | 'bio'; currentValue: string; title: string };
  UserProfile: { userId: string };
};

const Stack = createStackNavigator<RootStackParamList>();



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
  const { isLoading, profileCompletionStep, isOnboardingCompleted, onboardingLoading, session } = useAuth();



  // Mostrar pantalla de carga mientras se determina el estado
  if (isLoading || onboardingLoading) {
    return <LoadingScreen />;
  }

  // Si el usuario ya completó el onboarding, ir directo a la app (sin verificar profileCompletionStep)
  if (isOnboardingCompleted === true) {
    return (
      <Stack.Navigator
        key="main-app-stack"
        initialRouteName="MainApp"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyle: { backgroundColor: Colors.background },
          detachPreviousScreen: false,
          animationTypeForReplace: 'push',
          freezeOnBlur: false,
          presentation: 'card',
        }}
      >
        <Stack.Screen 
          name="MainApp" 
          component={BottomNavigationBar}
          options={{
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
            animationTypeForReplace: 'push',
            cardStyle: { backgroundColor: Colors.background },
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={({ navigation }) => ({
            headerShown: false,
            headerTitle: 'Settings',
            headerTitleAlign: 'left',
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

            detachPreviousScreen: false,
            freezeOnBlur: false,
          })}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={({ navigation }) => ({
            headerShown: false,
            cardStyle: { backgroundColor: Colors.background },
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromRightAndroid,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            detachPreviousScreen: false,
            freezeOnBlur: false,
          })}
        />
        <Stack.Screen 
          name="EditProfileElement" 
          component={EditProfileElement}
          options={({ navigation }) => ({
            headerShown: false,
            cardStyle: { backgroundColor: Colors.background },
            cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            detachPreviousScreen: false,
            freezeOnBlur: false,
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
            gestureResponseDistance: 50,
            detachPreviousScreen: false,
            freezeOnBlur: false,
          })}
        />
      </Stack.Navigator>
    );
  }

  // Si no hay sesión, mostrar welcome
  if (!session) {
    return (
      <Stack.Navigator
        key="welcome-stack"
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: { backgroundColor: Colors.background },
          detachPreviousScreen: true,
          freezeOnBlur: true,
          presentation: 'card',
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
          initialParams={{ initialStep: profileCompletionStep }}
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

  if (profileCompletionStep < 2) {
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
          initialParams={{ initialStep: profileCompletionStep }}
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
        cardStyle: { backgroundColor: Colors.background },
        detachPreviousScreen: false,
        freezeOnBlur: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen 
        name="MainApp" 
        component={BottomNavigationBar}
        options={{
          gestureEnabled: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
          animationTypeForReplace: 'push',
          cardStyle: { backgroundColor: Colors.background },
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={({ navigation }) => ({
          headerShown: false,
          headerTitle: 'Settings',
          headerTitleAlign: 'left',
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
          detachPreviousScreen: false,
          freezeOnBlur: false,
        })}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={({ navigation }) => ({
          headerShown: false,
          cardStyle: { backgroundColor: Colors.background },
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromRightAndroid,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          detachPreviousScreen: false,
          freezeOnBlur: false,
        })}
      />
      <Stack.Screen 
        name="EditProfileElement" 
        component={EditProfileElement}
        options={({ navigation }) => ({
          headerShown: false,
          cardStyle: { backgroundColor: Colors.background },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          detachPreviousScreen: false,
          freezeOnBlur: false,
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
          gestureResponseDistance: 50,
          detachPreviousScreen: false,
          freezeOnBlur: false,
        })}
      />
    </Stack.Navigator>
  );
}; 