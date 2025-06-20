// Configuración de fuentes de la aplicación
export const FONT_FAMILIES = {
  light: 'Raleway-Light',
  regular: 'Raleway-Regular',
  medium: 'Raleway-Medium',
  semiBold: 'Raleway-SemiBold',
  bold: 'Raleway-Bold',
} as const;

// Configuración de fuentes para Font.loadAsync
export const FONT_ASSETS = {
  'Raleway-Light': require('../../assets/fonts/Raleway/static/Raleway-Light.ttf'),
  'Raleway-Regular': require('../../assets/fonts/Raleway/static/Raleway-Regular.ttf'),
  'Raleway-Medium': require('../../assets/fonts/Raleway/static/Raleway-Medium.ttf'),
  'Raleway-SemiBold': require('../../assets/fonts/Raleway/static/Raleway-SemiBold.ttf'),
  'Raleway-Bold': require('../../assets/fonts/Raleway/static/Raleway-Bold.ttf'),
} as const;

// Tipos para TypeScript
export type FontFamily = keyof typeof FONT_FAMILIES; 