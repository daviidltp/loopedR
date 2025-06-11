import React, { useRef, useState } from 'react';
import { Animated, TextInput as RNTextInput, StyleSheet, Text, TextInputProps, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  isValid?: boolean;
  showUserPrefix?: boolean;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  isValid,
  showUserPrefix = false,
  onFocus,
  onBlur,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const shouldShowPrefixUp = isFocused || (value && value.length > 0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (showUserPrefix) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: false,
        tension: 150,
        friction: 8,
      }).start();
    }
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (showUserPrefix && (!value || value.length === 0)) {
      Animated.spring(animatedValue, {
        toValue: 0,
        useNativeDriver: false,
        tension: 150,
        friction: 8,
      }).start();
    }
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return Colors.appleRed;
    if (isValid) return Colors.spotifyGreen;
    return Colors.backgroundUltraSoft;
  };

  const getActiveColor = () => {
    if (error) return Colors.appleRed;
    if (isValid) return Colors.spotifyGreen;
    return Colors.white;
  };

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [getBorderColor(), getActiveColor()],
  });

  const borderWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const shadowOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  const shadowRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.backgroundUltraSoft, Colors.backgroundSoft],
  });

  const prefixTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -8],
  });

  const prefixFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const prefixColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.gray[400], Colors.white],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, { borderColor: getBorderColor() }]}>
        {showUserPrefix && (
          <Animated.Text
            style={[
              styles.prefix,
              {
                top: prefixTop,
                fontSize: prefixFontSize,
                color: prefixColor,
              }
            ]}
          >
            @
          </Animated.Text>
        )}
        <RNTextInput
          {...props}
          value={value}
          style={[
            styles.input,
            showUserPrefix && { paddingLeft: shouldShowPrefixUp ? 18 : 35 }
          ]}
          placeholderTextColor={Colors.gray[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={isValid ? Colors.spotifyGreen : Colors.white}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 8,
  },
  inputContainer: {
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.backgroundUltraSoft,
    borderWidth: 1,
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingHorizontal: 18,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  prefix: {
    position: 'absolute',
    left: 18,
    fontWeight: '500',
    zIndex: 1,
  },
  errorText: {
    fontSize: 14,
    color: Colors.appleRed,
    marginTop: 6,
    fontWeight: '500',
    marginLeft: 4,
  },
}); 