import React, { useRef, useState } from 'react';
import { Animated, TextInput as RNTextInput, StyleSheet, Text, TextInputProps, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { CheckIcon } from '../../icons/CheckIcon';
import { CrossIcon } from '../../icons/CrossIcon';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  isValid?: boolean;
  showUserPrefix?: boolean;
  showFixedAtSymbol?: boolean;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  isValid,
  showUserPrefix = false,
  showFixedAtSymbol = false,
  onFocus,
  onBlur,
  value,
  onChangeText,
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

  // Función para manejar cambios en el texto (permitir todos los caracteres)
  const handleTextChange = (text: string) => {
    // Siempre permitir escribir cualquier caracter, la validación se hace después
    onChangeText?.(text);
  };

  // Color neutral para todos los estados - sin cambio de color en focus
  const getBorderColor = () => {
    return Colors.backgroundUltraSoft; // Siempre el mismo color
  };

  const shadowOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.1],
  });

  const shadowRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.backgroundSoft, Colors.appleRed],
  });

  const prefixFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const prefixColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.gray[400], Colors.gray[300]],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View 
        style={[
          styles.inputContainer, 
          { 
            borderColor: getBorderColor(),
            backgroundColor,
            shadowColor: Colors.background,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity,
            shadowRadius,
            elevation: isFocused ? 2 : 0,
          }
        ]}
      >

        {/* @ fijo para showFixedAtSymbol */}
        {showFixedAtSymbol && (
          <Text style={styles.fixedAtSymbol}>@</Text>
        )}

        <RNTextInput
          {...props}
          value={value}
          onChangeText={handleTextChange}
          style={[
            styles.input,
            showUserPrefix && { paddingLeft: shouldShowPrefixUp ? 18 : 35 },
            showFixedAtSymbol && { paddingLeft: 35 },
            (error || isValid) && { paddingRight: 45 } // Espacio para el icono
          ]}
          placeholderTextColor={Colors.gray[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={Colors.gray[300]}
        />
        
        {/* Icono de validación */}
        {(error || isValid) && (
          <View style={styles.validationIcon}>
            {error ? (
              <CrossIcon size={20} color={Colors.appleRed} />
            ) : isValid ? (
              <CheckIcon size={20} color={Colors.spotifyGreen} />
            ) : null}
          </View>
        )}
      </Animated.View>
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
    borderRadius: 12,
    backgroundColor: Colors.backgroundSoft,
    borderWidth: 1,
    position: 'relative',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 18,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '400',
    includeFontPadding: false,
    textAlignVertical: 'center',

  },
  fixedAtSymbol: {
    position: 'absolute',
    left: 18,
    fontSize: 16,
    paddingBottom: 5,
    fontWeight: '500',
    color: Colors.gray[300],
    zIndex: 1,
  },
  validationIcon: {
    position: 'absolute',
    right: 18,
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