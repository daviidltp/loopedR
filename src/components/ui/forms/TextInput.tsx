import { textStyles } from '@/src/constants';
import React, { forwardRef, useRef, useState } from 'react';
import { Animated, TextInput as RNTextInput, StyleSheet, TextInputProps, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { CheckIcon } from '../../icons/CheckIcon';
import { CrossIcon } from '../../icons/CrossIcon';
import { AppText } from '../Text/AppText';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isValid?: boolean;
  showUserPrefix?: boolean;
  showFixedAtSymbol?: boolean;
  helperText?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}

export const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(({
  label,
  error,
  isValid,
  showUserPrefix = false,
  showFixedAtSymbol = false,
  helperText,
  textTransform,
  onFocus,
  onBlur,
  value,
  onChangeText,
  ...props
}, ref) => {
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

  return (
    <View style={styles.container}>
      {label && <AppText variant='body' fontFamily='inter' color={Colors.white} style={styles.label}>{label}</AppText>}
      <View style={styles.inputWrapper}>
        <Animated.View 
          style={[
            styles.inputContainer, 
            { 
              backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.07)',
            }
          ]}
        >
          {showFixedAtSymbol && (
            <AppText variant='body' fontFamily='inter' fontWeight='regular' style={styles.fixedAtSymbol} color={Colors.mutedWhite}>@</AppText>
          )}

          <RNTextInput
            {...props}
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            style={[
              styles.input,
              showUserPrefix && { paddingLeft: shouldShowPrefixUp ? 18 : 35 },
              showFixedAtSymbol && { paddingLeft: 35 },
              (error || isValid) && { paddingRight: 45 }, // Espacio para el icono
              textTransform && { textTransform }
            ]}
            placeholderTextColor={Colors.gray[400]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectionColor={Colors.gray[300]}
            //autoCapitalize={'characters'}
            
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
        <AppText 
          variant='bodySmall' 
          style={[
            styles.helperText,
            error && styles.errorText
          ]}
        >
          {error || helperText}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputContainer: {
    height: 52,
    borderRadius: 16,
    position: 'relative',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 18,
    fontSize: textStyles.bodyLarge.fontSize, // bodyLarge, no queda de otra que poner esto porque no es un AppText propio
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  fixedAtSymbol: {
    position: 'absolute',
    left: 18,
    paddingBottom: 1,
    zIndex: 1,
    textAlignVertical: 'center',
  },
  validationIcon: {
    position: 'absolute',
    right: 18,
    zIndex: 1,
  },
  helperText: {
    paddingTop: 20,
    color: Colors.mutedWhite,
  },
  errorText: {
    color: Colors.appleRed,
    opacity: 1,
  },
}); 