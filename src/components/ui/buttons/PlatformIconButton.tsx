import React from 'react';
import { Platform, Pressable, View, ViewStyle } from 'react-native';
import { Colors } from '../../../constants/Colors';

interface PlatformIconButtonProps {
  icon: React.ReactNode;
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
  rippleColor = Colors.foregroundSoft,
  accessibilityLabel,
  activeOpacity = 0.7,
  backgroundColor = 'transparent',
}) => {
  const defaultStyle: ViewStyle = {
    backgroundColor: backgroundColor,
    borderRadius: size * 2,
    width: size * 2,
    height: size * 2,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={[defaultStyle, style]}
      accessibilityLabel={accessibilityLabel}
      android_ripple={Platform.OS === 'android' ? {
        color: rippleColor,
        borderless: false,
        radius: size
      } : undefined}
    >
      <View>
        {icon}
      </View>
    </Pressable>
  );
};