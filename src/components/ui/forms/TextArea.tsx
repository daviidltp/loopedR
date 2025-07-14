import { textStyles } from '@/src/constants';
import React, { forwardRef, useState } from 'react';
import { Animated, TextInput as RNTextInput, StyleSheet, TextInputProps, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { CheckIcon } from '../../icons/CheckIcon';
import { CrossIcon } from '../../icons/CrossIcon';
import { AppText } from '../Text/AppText';

interface TextAreaProps extends Omit<TextInputProps, 'multiline' | 'numberOfLines'> {
  label?: string;
  description?: string;
  error?: string;
  isValid?: boolean;
  helperText?: string;
  minHeight?: number;
  maxHeight?: number;
  showCharacterCount?: boolean;
}

export const TextArea = forwardRef<RNTextInput, TextAreaProps>(({
  label,
  description,
  error,
  isValid,
  helperText,
  minHeight = 100,
  maxHeight = 200,
  showCharacterCount = false,
  onFocus,
  onBlur,
  value,
  onChangeText,
  maxLength,
  style: customStyle,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [textHeight, setTextHeight] = useState(minHeight);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, height + 32)); // +32 para padding
    setTextHeight(newHeight);
  };

  return (
    <View style={styles.container}>
      {label && <AppText variant='body' fontFamily='inter' color={Colors.white} style={styles.label}>{label}</AppText>}
      
      {/* Header con descripción y contador */}
      <View style={styles.headerSection}>
        {description && (
          <AppText variant='bodySmall' fontFamily='inter' color={Colors.mutedWhite} style={styles.description}>
            {description}
          </AppText>
        )}
        
        {showCharacterCount && maxLength && (
          <AppText 
            variant='bodySmall' 
            style={[
              styles.characterCount,
              value && value.length > maxLength * 0.9 && styles.characterCountWarning
            ]}
          >
            {value?.length || 0}/{maxLength}
          </AppText>
        )}
      </View>
      
      <View style={styles.inputWrapper}>
        <Animated.View 
          style={[
            styles.inputContainer,
            { 
              backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.07)',
              height: textHeight,
            }
          ]}
        >
          <RNTextInput
            {...props}
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            multiline={true}
            scrollEnabled={textHeight >= maxHeight}
            style={[
              styles.input,
              (error || isValid) && { paddingRight: 45 }, // Espacio para el icono
              customStyle
            ]}
            placeholderTextColor={Colors.gray[400]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onContentSizeChange={handleContentSizeChange}
            selectionColor={Colors.gray[300]}
            maxLength={maxLength}
            textAlignVertical="top"
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
        
        {/* Texto de ayuda */}
        <View style={styles.footerSection}>
          <AppText 
            variant='bodySmall' 
            style={[
              styles.helperText,
              error && styles.errorText
            ]}
          >
            {error || helperText || ''}
          </AppText>
        </View>
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
  description: {
    flex: 1,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputContainer: {
    borderRadius: 16,
    position: 'relative',
    paddingLeft: 5,
    paddingTop: 8,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: textStyles.bodyLarge.fontSize,
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    includeFontPadding: false,
    lineHeight: 22,
  },
  validationIcon: {
    position: 'absolute',
    right: 18,
    top: 18,
    zIndex: 1,
  },
  footerSection: {
    paddingTop: 8,
  },
  helperText: {
    color: Colors.mutedWhite,
  },
  errorText: {
    color: Colors.appleRed,
    opacity: 1,
  },
  characterCount: {
    color: Colors.mutedWhite,
    fontSize: 12,
  },
  characterCountWarning: {
    color: Colors.gold,
  },
}); 