import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Raleway-Light': require('../../assets/fonts/Raleway/static/Raleway-Light.ttf'),
          'Raleway-Regular': require('../../assets/fonts/Raleway/static/Raleway-Regular.ttf'),
          'Raleway-Medium': require('../../assets/fonts/Raleway/static/Raleway-Medium.ttf'),
          'Raleway-SemiBold': require('../../assets/fonts/Raleway/static/Raleway-SemiBold.ttf'),
          'Raleway-Bold': require('../../assets/fonts/Raleway/static/Raleway-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Set to true anyway to avoid blocking the app
      }
    };

    loadFonts();
  }, []);

  return fontsLoaded;
}; 