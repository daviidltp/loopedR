import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';

/**
 * CustomSwitch Props
 * @param value Estado del switch (on/off)
 * @param onValueChange Callback al cambiar el valor
 * @param disabled Deshabilita el switch
 * @param activeColor Color del fondo cuando está activo
 * @param inactiveColor Color del fondo cuando está inactivo
 * @param thumbActiveColor Color de la pelota cuando está activo
 * @param thumbInactiveColor Color de la pelota cuando está inactivo
 * @param borderColor Color del borde del switch
 * @param style Estilo adicional para el contenedor
 */
interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  thumbActiveColor?: string;
  thumbInactiveColor?: string;
  borderColor?: string;
  style?: ViewStyle;
}

const SWITCH_WIDTH = 50;
const SWITCH_HEIGHT = 30;
const THUMB_SIZE = 26;
const PADDING = 2;

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  activeColor = Colors.secondaryGreenDark,
  inactiveColor = Colors.gray[700], // iOS gray
  thumbActiveColor = Colors.secondaryGreen,
  thumbInactiveColor = Colors.gray[300], // iOS gray
  borderColor = 'transparent',
  style,
}) => {
  const progress = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { damping: 18, stiffness: 180 });
  }, [value]);

  const animatedTrackStyle = useAnimatedStyle(() => ({
    backgroundColor: value ? activeColor : inactiveColor,
    opacity: disabled ? 1 : 1,
    borderColor: borderColor,
    borderWidth: borderColor !== 'transparent' ? 1 : 0,
  }));

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: progress.value * (SWITCH_WIDTH - THUMB_SIZE - PADDING * 2),
      },
    ],
    backgroundColor: value ? thumbActiveColor : thumbInactiveColor,
  }));

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, style]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View style={[styles.track, animatedTrackStyle]} />
      <Animated.View style={[styles.thumb, animatedThumbStyle]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    justifyContent: 'center',
    padding: PADDING,
    backgroundColor: 'transparent',
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SWITCH_HEIGHT / 2,
    backgroundColor: '#E5E5EA',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFF',
    position: 'absolute',
    top: PADDING,
    left: PADDING,
  },
}); 