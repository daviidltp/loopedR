import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { CreateProfileScreen, WelcomeScreen } from '../components';
import { MainTabNavigator } from './MainTabNavigator';

export type RootStackParamList = {
  Welcome: undefined;
  CreateProfile: undefined;
  MainApp: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
      />
      <Stack.Screen 
        name="CreateProfile" 
        component={CreateProfileScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen 
        name="MainApp" 
        component={MainTabNavigator}
        options={{
          gestureEnabled: false, // No permitir volver atrás con gestos
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
    </Stack.Navigator>
  );
}; 