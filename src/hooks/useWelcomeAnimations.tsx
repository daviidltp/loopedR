import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { AppText } from '../components/ui/Text/AppText';
import { Colors } from '../constants/Colors';

interface TextItem {
  content: React.ReactNode;
}

interface UseWelcomeAnimationsProps {
  texts: TextItem[];
  intervalDuration?: number;
  animationDuration?: number;
}

interface WelcomeAnimationStyles {
  animatedTextContainer: any;
}

export const useWelcomeAnimations = ({
  texts,
  intervalDuration = 5000,
  animationDuration = 200,
}: UseWelcomeAnimationsProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  // Función para animar el cambio de texto
  const animateTextChange = useCallback(() => {
    // Fase 1: Fade out y bajar el texto actual
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 50, // Baja 50 píxeles
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Cambiar al siguiente texto
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      
      // Resetear posición para que el nuevo texto entre desde abajo
      translateYAnim.setValue(50);
      
      // Fase 2: Fade in y subir el nuevo texto
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [fadeAnim, translateYAnim, texts.length, animationDuration]);

  // Efecto para el temporizador de cambio de texto
  useEffect(() => {
    const interval = setInterval(animateTextChange, intervalDuration);
    return () => clearInterval(interval);
  }, [animateTextChange, intervalDuration]);

  // Renderizar el texto actual
  const renderAnimatedText = useCallback((styles: WelcomeAnimationStyles) => {
    const currentText = texts[currentTextIndex];
    
    return (
      <Animated.View
        style={[
          styles.animatedTextContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        <AppText variant="h1" fontWeight="bold" fontFamily='inter' color={Colors.white} textAlign="left" lineHeight={36}>
          {currentText.content}
        </AppText>
      </Animated.View>
    );
  }, [currentTextIndex, fadeAnim, translateYAnim, texts]);

  return {
    renderAnimatedText,
    currentTextIndex,
  };
}; 