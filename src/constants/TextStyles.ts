import { StyleSheet, TextStyle } from 'react-native';
import { Colors } from './Colors';
import { FONT_FAMILIES } from './Fonts';

// Tipos para los estilos de texto
export type TextStyleName = keyof typeof textStyles;

// Estilos de texto centralizados
export const textStyles = StyleSheet.create({
  // Títulos principales
  h1: {
    fontFamily: FONT_FAMILIES.interBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: Colors.white,
  } as TextStyle,

  h2: {
    fontFamily: FONT_FAMILIES.interSemiBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: Colors.white,
  } as TextStyle,

  h3: {
    fontFamily: FONT_FAMILIES.interSemiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
    color: Colors.white,
  } as TextStyle,

  h4: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.1,
    color: Colors.white,
  } as TextStyle,

  h5: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.white,
  } as TextStyle,

  h6: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.white,
  } as TextStyle,

  // Texto de cuerpo
  bodyLarge: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 18,
    lineHeight: 26,
    color: Colors.white,
  } as TextStyle,

  body: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.white,
  } as TextStyle,

  bodySmall: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  } as TextStyle,

  // Texto de interfaz
  button: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    color: Colors.white,
  } as TextStyle,

  buttonSmall: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.3,
    color: Colors.white,
  } as TextStyle,

  label: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.1,
    color: Colors.white,
  } as TextStyle,

  labelSmall: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: Colors.white,
  } as TextStyle,

  // Texto secundario
  caption: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.gray[400],
  } as TextStyle,

  overline: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.gray[400],
  } as TextStyle,

  // Estilos especiales
  display: {
    fontFamily: FONT_FAMILIES.extraBold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1,
    color: Colors.white,
  } as TextStyle,

  displaySmall: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.8,
    color: Colors.white,
  } as TextStyle,

  // Enlaces
  link: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.white,
    textDecorationLine: 'underline',
  } as TextStyle,

  linkSmall: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
    textDecorationLine: 'underline',
  } as TextStyle,

  // Variantes de error/éxito
  error: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.appleRed,
  } as TextStyle,

  success: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.spotifyGreen,
  } as TextStyle,

  // Texto de placeholder
  placeholder: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray[500],
  } as TextStyle,

  // ===============================================
  // ESTILOS CON RALEWAY (Elegante para títulos)
  // ===============================================
  
  // Títulos con Raleway
  displayRaleway: {
    fontFamily: FONT_FAMILIES.ralewayBlack,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1,
    color: Colors.white,
  } as TextStyle,

  h1Raleway: {
    fontFamily: FONT_FAMILIES.ralewayBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: Colors.white,
  } as TextStyle,

  h2Raleway: {
    fontFamily: FONT_FAMILIES.ralewaySemiBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: Colors.white,
  } as TextStyle,

  h3Raleway: {
    fontFamily: FONT_FAMILIES.ralewaySemiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
    color: Colors.white,
  } as TextStyle,

  // Texto elegante con Raleway
  bodyRaleway: {
    fontFamily: FONT_FAMILIES.ralewayRegular,
    fontSize: 17,
    lineHeight: 24,
    color: Colors.white,
  } as TextStyle,

  captionRaleway: {
    fontFamily: FONT_FAMILIES.ralewayLight,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.gray[400],
  } as TextStyle,

  // ===============================================
  // ESTILOS CON POPPINS (Moderna para UI)
  // ===============================================
  
  // Títulos con Poppins
  displayPoppins: {
    fontFamily: FONT_FAMILIES.poppinsBlack,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1,
    color: Colors.white,
  } as TextStyle,

  h1Poppins: {
    fontFamily: FONT_FAMILIES.poppinsBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: Colors.white,
  } as TextStyle,

  h2Poppins: {
    fontFamily: FONT_FAMILIES.poppinsSemiBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: Colors.white,
  } as TextStyle,

  h3Poppins: {
    fontFamily: FONT_FAMILIES.poppinsSemiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
    color: Colors.white,
  } as TextStyle,

  // UI moderna con Poppins
  buttonPoppins: {
    fontFamily: FONT_FAMILIES.poppinsSemiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    color: Colors.white,
  } as TextStyle,

  bodyPoppins: {
    fontFamily: FONT_FAMILIES.poppinsRegular,
    fontSize: 17,
    lineHeight: 24,
    color: Colors.white,
  } as TextStyle,

  labelPoppins: {
    fontFamily: FONT_FAMILIES.poppinsMedium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.1,
    color: Colors.white,
  } as TextStyle,

  captionPoppins: {
    fontFamily: FONT_FAMILIES.poppinsLight,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.gray[400],
  } as TextStyle,

  // ===============================================
  // ESTILOS ESPECIALES COMBINADOS
  // ===============================================
  
  // Para logotipo/marca
  logoText: {
    fontFamily: FONT_FAMILIES.ralewayBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -1,
    color: Colors.white,
  } as TextStyle,

  logoTextLarge: {
    fontFamily: FONT_FAMILIES.ralewayBold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1.5,
    color: Colors.white,
  } as TextStyle,

  // Para navegación y UI
  navText: {
    fontFamily: FONT_FAMILIES.poppinsMedium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
    color: Colors.white,
  } as TextStyle,

  // Para cards y contenido
  cardTitle: {
    fontFamily: FONT_FAMILIES.poppinsSemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.1,
    color: Colors.white,
  } as TextStyle,

  cardSubtitle: {
    fontFamily: FONT_FAMILIES.poppinsRegular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray[300],
  } as TextStyle,
});

// Función helper para obtener estilos con colores personalizados
export const getTextStyle = (
  styleName: TextStyleName,
  customColor?: string
): TextStyle => {
  const baseStyle = textStyles[styleName];
  if (customColor) {
    return { ...baseStyle, color: customColor };
  }
  return baseStyle;
};

// Función helper para combinar estilos
export const combineTextStyles = (...styles: TextStyle[]): TextStyle => {
  return StyleSheet.flatten(styles);
};

export const textVariants = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  body: { fontSize: 16, fontWeight: 'normal' },
  // ...
};
export type TextVariant = keyof typeof textVariants; 