import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { FONT_ASSETS } from '../constants/Fonts';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<string | null>(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync(FONT_ASSETS);
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontError(error instanceof Error ? error.message : 'Error desconocido');
        setFontsLoaded(true); // Set to true anyway to avoid blocking the app
      }
    };

    loadFonts();
  }, []);

  return { fontsLoaded, fontError };
}; 