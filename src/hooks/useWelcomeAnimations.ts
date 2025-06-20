import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export const useWelcomeAnimations = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // Animaciones
  const titlePositionY = useRef(new Animated.Value(1)).current;
  const titleFontSize = useRef(new Animated.Value(1)).current;
  const backgroundOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Animación de entrada
  useEffect(() => {
    if (isFirstLoad) {
      // Comenzar la animación después de un pequeño delay
      const timer = setTimeout(() => {
        // Fase 1: Esperar 1 segundo quieto, luego mover el título hacia arriba (2 segundos)
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(titlePositionY, {
              toValue: 0, // Mover hacia la posición final (arriba)
              duration: 1000,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Animación más suave tipo ease-out
            }),
            Animated.timing(titleFontSize, {
              toValue: 0, // Reducir fontSize a medida que sube
              duration: 1000,
              useNativeDriver: false, // fontSize no se puede animar con nativeDriver
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
          ]).start(() => {
            // Fase 2: Esperar 1 segundo, luego fade out del fondo
            setTimeout(() => {
              Animated.parallel([
                Animated.timing(backgroundOpacity, {
                  toValue: 0,
                  duration: 500,
                  useNativeDriver: true,
                }),
                Animated.timing(contentOpacity, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                setIsFirstLoad(false);
              });
            }, 100);
          });
        }, 1500); // Quieto 1 segundo antes de empezar a moverse
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  return {
    isFirstLoad,
    titlePositionY,
    titleFontSize,
    backgroundOpacity,
    contentOpacity,
  };
}; 