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
  
  // Configuración para transiciones de pantalla
  screen: {
    push: {
      duration: 300,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    },
    stack: {
      duration: 250,
      easing: Easing.out(Easing.quad),
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

// Configuraciones de escala para botones
export const ButtonScale = {
  pressed: 0.95,
  normal: 1.0,
  hover: 1.02,
} as const; 