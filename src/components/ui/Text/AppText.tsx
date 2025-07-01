import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { TextStyleName, getTextStyle, textStyles } from '../../../constants/TextStyles';

type FontFamilyType = 'raleway' | 'poppins' | 'merriweatherSans' | 'libreCaslonText' | 'roboto';
type FontWeightType = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 
                     'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black';

interface AppTextProps extends Omit<TextProps, 'style'> {
  variant?: TextStyleName;
  fontFamily?: FontFamilyType;
  fontSize?: number;
  fontWeight?: FontWeightType;
  fontStyle?: 'normal' | 'italic';
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  style?: TextProps['style'];
}

// Mapeo de pesos numéricos/descriptivos a nombres de archivo de fuente
const getFontFamily = (family: FontFamilyType = 'roboto', weight: FontWeightType = 400, isItalic: boolean = false): string => {
  const weightMap: Record<FontWeightType, string> = {
    100: 'Thin',
    200: 'ExtraLight',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'SemiBold',
    700: 'Bold',
    800: 'ExtraBold',
    900: 'Black',
    thin: 'Thin',
    extraLight: 'ExtraLight',
    light: 'Light',
    regular: 'Regular',
    medium: 'Medium',
    semiBold: 'SemiBold',
    bold: 'Bold',
    extraBold: 'ExtraBold',
    black: 'Black'
  };

  const familyMap: Record<FontFamilyType, string> = {
    raleway: 'Raleway',
    poppins: 'Poppins',
    merriweatherSans: 'MerriweatherSans',
    libreCaslonText: 'LibreCaslonText',
    roboto: 'Roboto'
  };

  const baseFamily = familyMap[family];
  const weightSuffix = weightMap[weight];
  const italicSuffix = isItalic ? 'Italic' : '';

  // Manejo especial para Libre Caslon Text que solo tiene Regular, Bold e Italic
  if (family === 'libreCaslonText') {
    if (isItalic && weight !== 700) return 'LibreCaslonText-Italic';
    // Convertir weight a número si es string
    const numericWeight = typeof weight === 'number' ? weight : 
      weight === 'bold' || weight === 'extraBold' || weight === 'black' ? 700 : 400;
    return numericWeight >= 700 ? 'LibreCaslonText-Bold' : 'LibreCaslonText-Regular';
  }

  return `${baseFamily}-${weightSuffix}${italicSuffix}`;
};

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  fontFamily = 'roboto',
  fontSize,
  fontWeight = 400 as FontWeightType,
  fontStyle = 'normal',
  color,
  letterSpacing,
  lineHeight,
  textAlign,
  textTransform,
  textDecorationLine,
  style,
  children,
  ...props
}) => {
  // Obtener estilo base del variant
  const baseStyle = color ? getTextStyle(variant, color) : textStyles[variant];
  
  // Crear estilo personalizado
  const customStyle: TextStyle = {
    fontFamily: getFontFamily(fontFamily, fontWeight, fontStyle === 'italic'),
  };
  
  if (fontSize) customStyle.fontSize = fontSize;
  if (color) customStyle.color = color;
  if (letterSpacing !== undefined) customStyle.letterSpacing = letterSpacing;
  if (lineHeight) customStyle.lineHeight = lineHeight;
  if (textAlign) customStyle.textAlign = textAlign;
  if (textTransform) customStyle.textTransform = textTransform;
  if (textDecorationLine) customStyle.textDecorationLine = textDecorationLine;

  // Combinar todos los estilos
  const finalStyle = [baseStyle, customStyle, style].filter(Boolean);

  return (
    <Text style={finalStyle} {...props}>
      {children}
    </Text>
  );
}; 