import React, { useRef, useState } from 'react';
import { Platform, Pressable, View, ViewStyle } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { Colors } from '../../../constants/Colors';

interface PlatformTouchableProps {
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  rippleColor?: string;
  borderless?: boolean;
  children: React.ReactNode;
  activeOpacity?: number;
  underlayColor?: string;
}

export const PlatformTouchable: React.FC<PlatformTouchableProps> = ({
  style,
  onPress,
  onLongPress,
  disabled = false,
  rippleColor = Colors.foregroundSoft,
  borderless = false,
  children,
  activeOpacity = 0.7,
  underlayColor = Colors.backgroundSoft,
}) => {
  const [isLongPressed, setIsLongPressed] = useState(false);
  const longPressTimer = useRef<number | undefined>(undefined);

  if (Platform.OS === 'android') {
    return (
      <TouchableRipple
        style={style}
        onPress={onPress}
        disabled={disabled}
        rippleColor={rippleColor}
        borderless={borderless}
      >
        {children}
      </TouchableRipple>
    );
  }

  const handlePressIn = () => {
    // Solo activar el efecto visual después del delay del longpress
    longPressTimer.current = setTimeout(() => {
      setIsLongPressed(true);
    }, 200); // mismo delay que delayLongPress
  };

  const handlePressOut = () => {
    // Limpiar el timer y quitar el efecto visual
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPressed(false);
  };

  // iOS: usa Pressable con fondo personalizado que solo se activa en longpress
  return (
    <Pressable
      style={style}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      delayLongPress={500}
    >
      <View
        style={[
          { backgroundColor: isLongPressed ? underlayColor : 'transparent' },
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
}; 