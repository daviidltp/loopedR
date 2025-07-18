// Configuración de fuentes de la aplicación

// Inter (Moderna y legible)
export const INTER_FAMILIES = {
  extraLight: 'Inter-ExtraLight',
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
  black: 'Inter-Black',
} as const;

// Roboto (Principal)
export const ROBOTO_FAMILIES = {
  light: 'Roboto-Light',
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  semiBold: 'Roboto-SemiBold',
  bold: 'Roboto-Bold',
  extraBold: 'Roboto-ExtraBold',
} as const;

// Raleway (Elegante para títulos)
export const RALEWAY_FAMILIES = {
  light: 'Raleway-Light',
  regular: 'Raleway-Regular',
  medium: 'Raleway-Medium',
  semiBold: 'Raleway-SemiBold',
  bold: 'Raleway-Bold',
  extraBold: 'Raleway-ExtraBold',
  black: 'Raleway-Black',
} as const;

// Poppins (Moderna para UI)
export const POPPINS_FAMILIES = {
  light: 'Poppins-Light',
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  extraBold: 'Poppins-ExtraBold',
  black: 'Poppins-Black',
} as const;

// Merriweather Sans (Legible para contenido)
export const MERRIWEATHER_SANS_FAMILIES = {
  light: 'MerriweatherSans-Light',
  regular: 'MerriweatherSans-Regular',
  medium: 'MerriweatherSans-Medium',
  semiBold: 'MerriweatherSans-SemiBold',
  bold: 'MerriweatherSans-Bold',
  extraBold: 'MerriweatherSans-ExtraBold',
} as const;

// Libre Caslon Text (Elegante serif para textos especiales)
export const LIBRE_CASLON_TEXT_FAMILIES = {
  regular: 'LibreCaslonText-Regular',
  italic: 'LibreCaslonText-Italic',
  bold: 'LibreCaslonText-Bold',
} as const;

// Familias unificadas (mantener compatibilidad)
export const FONT_FAMILIES = {
  // Roboto (por defecto)
  light: ROBOTO_FAMILIES.light,
  regular: ROBOTO_FAMILIES.regular,
  medium: ROBOTO_FAMILIES.medium,
  semiBold: ROBOTO_FAMILIES.semiBold,
  bold: ROBOTO_FAMILIES.bold,
  extraBold: ROBOTO_FAMILIES.extraBold,
  
  // Inter
  interExtraLight: INTER_FAMILIES.extraLight,
  interLight: INTER_FAMILIES.light,
  interRegular: INTER_FAMILIES.regular,
  interMedium: INTER_FAMILIES.medium,
  interSemiBold: INTER_FAMILIES.semiBold,
  interBold: INTER_FAMILIES.bold,
  interExtraBold: INTER_FAMILIES.extraBold,
  interBlack: INTER_FAMILIES.black,
  
  // Raleway
  ralewayLight: RALEWAY_FAMILIES.light,
  ralewayRegular: RALEWAY_FAMILIES.regular,
  ralewayMedium: RALEWAY_FAMILIES.medium,
  ralewaySemiBold: RALEWAY_FAMILIES.semiBold,
  ralewayBold: RALEWAY_FAMILIES.bold,
  ralewayExtraBold: RALEWAY_FAMILIES.extraBold,
  ralewayBlack: RALEWAY_FAMILIES.black,
  
  // Poppins
  poppinsLight: POPPINS_FAMILIES.light,
  poppinsRegular: POPPINS_FAMILIES.regular,
  poppinsMedium: POPPINS_FAMILIES.medium,
  poppinsSemiBold: POPPINS_FAMILIES.semiBold,
  poppinsBold: POPPINS_FAMILIES.bold,
  poppinsExtraBold: POPPINS_FAMILIES.extraBold,
  poppinsBlack: POPPINS_FAMILIES.black,
  
  // Merriweather Sans
  merriweatherSansLight: MERRIWEATHER_SANS_FAMILIES.light,
  merriweatherSansRegular: MERRIWEATHER_SANS_FAMILIES.regular,
  merriweatherSansMedium: MERRIWEATHER_SANS_FAMILIES.medium,
  merriweatherSansSemiBold: MERRIWEATHER_SANS_FAMILIES.semiBold,
  merriweatherSansBold: MERRIWEATHER_SANS_FAMILIES.bold,
  merriweatherSansExtraBold: MERRIWEATHER_SANS_FAMILIES.extraBold,
  
  // Libre Caslon Text
  libreCaslonTextRegular: LIBRE_CASLON_TEXT_FAMILIES.regular,
  libreCaslonTextItalic: LIBRE_CASLON_TEXT_FAMILIES.italic,
  libreCaslonTextBold: LIBRE_CASLON_TEXT_FAMILIES.bold,
} as const;

// Configuración de fuentes para Font.loadAsync
export const FONT_ASSETS = {
  // Roboto
  'Roboto-Light': require('../../assets/fonts/Roboto/Roboto-Light.ttf'),
  'Roboto-Regular': require('../../assets/fonts/Roboto/Roboto-Regular.ttf'),
  'Roboto-Medium': require('../../assets/fonts/Roboto/Roboto-Medium.ttf'),
  'Roboto-SemiBold': require('../../assets/fonts/Roboto/Roboto-SemiBold.ttf'),
  'Roboto-Bold': require('../../assets/fonts/Roboto/Roboto-Bold.ttf'),
  'Roboto-ExtraBold': require('../../assets/fonts/Roboto/Roboto-ExtraBold.ttf'),
  
  // Inter
  'Inter-ExtraLight': require('../../assets/fonts/Inter/static/Inter-ExtraLight.ttf'),
  'Inter-Light': require('../../assets/fonts/Inter/static/Inter-Light.ttf'),
  'Inter-Regular': require('../../assets/fonts/Inter/static/Inter-Regular.ttf'),
  'Inter-Medium': require('../../assets/fonts/Inter/static/Inter-Medium.ttf'),
  'Inter-SemiBold': require('../../assets/fonts/Inter/static/Inter-SemiBold.ttf'),
  'Inter-Bold': require('../../assets/fonts/Inter/static/Inter-Bold.ttf'),
  'Inter-ExtraBold': require('../../assets/fonts/Inter/static/Inter-ExtraBold.ttf'),
  'Inter-Black': require('../../assets/fonts/Inter/static/Inter-Black.ttf'),
  
  // Raleway
  'Raleway-Light': require('../../assets/fonts/Raleway/static/Raleway-Light.ttf'),
  'Raleway-Regular': require('../../assets/fonts/Raleway/static/Raleway-Regular.ttf'),
  'Raleway-Medium': require('../../assets/fonts/Raleway/static/Raleway-Medium.ttf'),
  'Raleway-SemiBold': require('../../assets/fonts/Raleway/static/Raleway-SemiBold.ttf'),
  'Raleway-Bold': require('../../assets/fonts/Raleway/static/Raleway-Bold.ttf'),
  'Raleway-ExtraBold': require('../../assets/fonts/Raleway/static/Raleway-ExtraBold.ttf'),
  'Raleway-Black': require('../../assets/fonts/Raleway/static/Raleway-Black.ttf'),
  
  // Poppins
  'Poppins-Light': require('../../assets/fonts/Poppins/Poppins-Light.ttf'),
  'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
  'Poppins-Medium': require('../../assets/fonts/Poppins/Poppins-Medium.ttf'),
  'Poppins-SemiBold': require('../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  'Poppins-Black': require('../../assets/fonts/Poppins/Poppins-Black.ttf'),
  
  // Merriweather Sans
  'MerriweatherSans-Light': require('../../assets/fonts/Merriweather_Sans/MerriweatherSans-Light.ttf'),
  'MerriweatherSans-Regular': require('../../assets/fonts/Merriweather_Sans/MerriweatherSans-Regular.ttf'),
  'MerriweatherSans-Medium': require('../../assets/fonts/Merriweather_Sans/MerriweatherSans-Medium.ttf'),
  'MerriweatherSans-SemiBold': require('../../assets/fonts/Merriweather_Sans/MerriweatherSans-SemiBold.ttf'),
  'MerriweatherSans-Bold': require('../../assets/fonts/Merriweather_Sans/MerriweatherSans-Bold.ttf'),
  'MerriweatherSans-ExtraBold': require('../../assets/fonts/Merriweather_Sans/MerriweatherSans-ExtraBold.ttf'),
  
  'LibreCaslonText-Regular': require('../../assets/fonts/Libre_Caslon_Text/LibreCaslonText-Regular.ttf'),
  'LibreCaslonText-Italic': require('../../assets/fonts/Libre_Caslon_Text/LibreCaslonText-Italic.ttf'),
  'LibreCaslonText-Bold': require('../../assets/fonts/Libre_Caslon_Text/LibreCaslonText-Bold.ttf'),
} as const;

// Tipos para TypeScript
export type FontFamily = keyof typeof FONT_FAMILIES;
export type InterFamily = keyof typeof INTER_FAMILIES;
export type RobotoFamily = keyof typeof ROBOTO_FAMILIES;
export type RalewayFamily = keyof typeof RALEWAY_FAMILIES;
export type PoppinsFamily = keyof typeof POPPINS_FAMILIES;
export type MerriweatherSansFamily = keyof typeof MERRIWEATHER_SANS_FAMILIES;
export type LibreCaslonTextFamily = keyof typeof LIBRE_CASLON_TEXT_FAMILIES; 