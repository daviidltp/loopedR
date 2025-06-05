import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

interface ButtonProps {
  onPress: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      duration: 150,
      dampingRatio: 0.8,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      duration: 150,
      dampingRatio: 0.8,
    });
  };

  const handlePress = () => {
    if (!disabled) {
      runOnJS(onPress)();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [
      styles.base,
      styles[size],
      fullWidth && styles.fullWidth,
    ];

    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary];
      case 'secondary':
        return [...baseStyle, styles.secondary];
      case 'ghost':
        return [...baseStyle, styles.ghost];
      default:
        return [...baseStyle, styles.primary];
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = [styles.baseText, styles[`${size}Text`]];

    switch (variant) {
      case 'primary':
        return [...baseTextStyle, styles.primaryText];
      case 'secondary':
        return [...baseTextStyle, styles.secondaryText];
      case 'ghost':
        return [...baseTextStyle, styles.ghostText];
      default:
        return [...baseTextStyle, styles.primaryText];
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        animatedStyle,
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
    >
      {children || (
        <Text style={[getTextStyle(), textStyle, disabled && styles.disabledText]}>
          {title}
        </Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },

  // Variants
  primary: {
    backgroundColor: Colors.spotifyGreen,
  },
  secondary: {
    backgroundColor: Colors.gray[800],
    borderWidth: 1,
    borderColor: Colors.gray[700],
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Text base
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Text variants
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  ghostText: {
    color: Colors.spotifyGreen,
  },

  // Disabled states
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
}); 