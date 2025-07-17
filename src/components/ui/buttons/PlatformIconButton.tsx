import React, { useState } from 'react';
import { Platform, ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors } from '../../../constants/Colors';

interface PlatformIconButtonProps {
  icon: string;
  size?: number;
  iconColor?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  rippleColor?: string;
  accessibilityLabel?: string;
  activeOpacity?: number;
  backgroundColor?: string;
}

export const PlatformIconButton: React.FC<PlatformIconButtonProps> = ({
  icon,
  size = 24,
  iconColor = Colors.white,
  onPress,
  onLongPress,
  disabled = false,
  style,
  rippleColor = 'rgba(255, 255, 255, 0.2)',
  accessibilityLabel,
  activeOpacity = 0.7,
  backgroundColor = 'transparent',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  if (Platform.OS === 'android') {
    return (
      <IconButton
        icon={icon}
        size={size}
        iconColor={iconColor}
        onPress={onPress}
        disabled={disabled}
        style={style}
        rippleColor={rippleColor}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  // iOS: usa Pressable con Ionicons
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const defaultStyle: ViewStyle = {
    backgroundColor: isPressed ? 'rgba(255, 255, 255, 0.1)' : backgroundColor,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : (isPressed ? activeOpacity : 1),
  };

  return (
    <IconButton
      icon={icon}
      size={size}
      iconColor={iconColor}
      onPress={onPress}
      disabled={disabled}
      style={style}
      rippleColor='transparent'
      accessibilityLabel={accessibilityLabel}
    />
  );
}; 