import { Easing, withSpring, withTiming } from 'react-native-reanimated';

// Configuraciones de animación predefinidas
export const AnimationConfig = {
  // Configuración para botones
  button: {
    press: {
      duration: 150,
      dampingRatio: 0.8,
    },
    release: {
      duration: 150,
      dampingRatio: 0.8,
    },
  },
  
  // Configuración para transiciones de pantalla (optimizada)
  screen: {
    push: {
      duration: 250, // Reducido para mejor rendimiento
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    },
    stack: {
      duration: 200, // Reducido para mejor rendimiento
      easing: Easing.out(Easing.quad),
    },
    // Nueva configuración para navegación rápida
    fast: {
      duration: 150,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
    },
  },
  
  // Configuración para elementos UI
  ui: {
    fade: {
      duration: 200,
      easing: Easing.linear,
    },
    scale: {
      duration: 300,
      easing: Easing.out(Easing.back(1.2)),
    },
  },
} as const;

// Helpers para animaciones comunes
export const createSpringAnimation = (
  value: number,
  config = AnimationConfig.button.press
) => {
  'worklet';
  return withSpring(value, config);
};

export const createTimingAnimation = (
  value: number,
  config = AnimationConfig.screen.push
) => {
  'worklet';
  return withTiming(value, config);
};

// Nueva función para animaciones de navegación optimizadas
export const createFastNavAnimation = (
  value: number,
  config = AnimationConfig.screen.fast
) => {
  'worklet';
  return withTiming(value, config);
};

// Configuraciones de escala para botones
export const ButtonScale = {
  pressed: 0.95,
  normal: 1.0,
  hover: 1.02,
} as const; 