import { forwardRef, useRef, useState } from 'react';
import { Animated, TextInput as RNTextInput, StyleSheet, TextInputProps, TouchableOpacity, View } from 'react-native';
import { textStyles } from '../../../constants';
import { Colors } from '../../../constants/Colors';
import { CheckIcon } from '../../icons/CheckIcon';
import { CrossIcon } from '../../icons/CrossIcon';
import { AppText } from '../Text/AppText';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  description?: string;
  error?: string;
  isValid?: boolean;
  showUserPrefix?: boolean;
  showFixedAtSymbol?: boolean;
  helperText?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  showCharacterCount?: boolean;
  maxLength?: number;
  inputHeight?: number;
  readOnly?: boolean;
  onReadOnlyPress?: () => void;
  backgroundColor?: string;
  showCharacterCountInInput?: boolean;
  maxFontSizeMultiplier?: number;
  fontSize?: number;
}

export const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(({ 
  label,
  description,
  error,
  isValid,
  showUserPrefix = false,
  showFixedAtSymbol = false,
  helperText,
  textTransform,
  fontSize,
  backgroundColor,
  onFocus,
  onBlur,
  value = '',
  onChangeText,
  style: customStyle,
  showCharacterCount = false,
  maxLength,
  multiline,
  numberOfLines,
  inputHeight,
  readOnly = false,
  onReadOnlyPress,
  showCharacterCountInInput = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const shouldShowPrefixUp = isFocused || (value && value.length > 0);

  const handleFocus = (e: any) => {
    if (readOnly) return;
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
    if (readOnly) return;
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

  const handleReadOnlyPress = () => {
    console.log(`Campo ${label} presionado`);
    onReadOnlyPress?.();
  };

  const inputContent = (
    <View style={styles.inputWrapper}>
      <Animated.View 
        style={[
          styles.inputContainer, 
          { 
            backgroundColor: backgroundColor || (readOnly ? 'rgba(255, 255, 255, 0.05)' : (isFocused ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.07)')),
            height: inputHeight || (multiline ? 'auto' : 52),
            minHeight: inputHeight || (multiline ? 52 : 52),
            justifyContent: inputHeight ? 'flex-start' : 'center',
          },
          multiline && { paddingVertical: 10 },
        ]}
      >
        {showFixedAtSymbol && (
          <AppText variant='body' fontFamily='inter' fontWeight='regular' style={styles.fixedAtSymbol} color={Colors.mutedWhite}>@</AppText>
        )}

        {readOnly ? (
            <RNTextInput
              {...props}
              ref={ref}
              value={value}
              style={[
                styles.input,
                { fontSize: fontSize || textStyles.bodyLarge.fontSize },
                showUserPrefix && { paddingLeft: shouldShowPrefixUp ? 18 : 35 },
                showFixedAtSymbol && { paddingLeft: 35 },
                (error || isValid) && { paddingRight: 45 },
                textTransform && { textTransform },
                inputHeight !== undefined && { 
                  textAlignVertical: 'top', 
                  paddingTop: 16,
                  paddingBottom: 16
                },
                multiline && { 
                  minHeight: inputHeight || 52, 
                  textAlignVertical: 'top', 
                  paddingTop: 10, 
                  paddingBottom: 10 
                },
                readOnly && { color: Colors.mutedWhite },
                customStyle
              ]}
              placeholderTextColor={Colors.gray[400]}
              multiline={multiline}
              numberOfLines={numberOfLines}
              maxLength={maxLength}
              editable={false}
              showSoftInputOnFocus={false}
              pointerEvents="none"
            />
        ) : (
          <RNTextInput
            {...props}
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            style={[
              styles.input,
              { fontSize: fontSize || textStyles.bodyLarge.fontSize },
              showUserPrefix && { paddingLeft: shouldShowPrefixUp ? 18 : 35 },
              showFixedAtSymbol && { paddingLeft: 35 },
              (error || isValid) && { paddingRight: 45 },
              textTransform && { textTransform },
              inputHeight !== undefined && { 
                textAlignVertical: 'top', 
                paddingTop: 16,
                paddingBottom: 16
              },
              multiline && { 
                minHeight: inputHeight || 52, 
                textAlignVertical: 'top', 
                paddingTop: 10, 
                paddingBottom: 10 
              },
              customStyle
            ]}
            placeholderTextColor={Colors.gray[400]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectionColor={Colors.gray[300]}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            editable={true}
          />
        )}
        {/* Icono de validación */}
        {(error || isValid) && !readOnly && (
          <View style={styles.validationIcon}>
            {error ? (
              <CrossIcon size={20} color={Colors.appleRed} />
            ) : isValid ? (
              <CheckIcon size={20} color={Colors.spotifyGreen} />
            ) : null}
          </View>
        )}
        {/* Character count dentro del input, abajo a la derecha */}
        {showCharacterCountInInput && showCharacterCount && maxLength && !readOnly && (
          <View style={styles.characterCountInInput}>
            <AppText style={[styles.characterCount, value.length === maxLength && { color: Colors.appleRed }]}>
              {value.length}/{maxLength}
            </AppText>
          </View>
        )}
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Character count en la label, solo si no está en el input */}
      <View style={styles.labelContainer}>
        {label && <AppText variant='bodySmall' fontFamily='inter' color={Colors.white} style={styles.label}>{label}</AppText>}
        {showCharacterCount && maxLength && !readOnly && !showCharacterCountInInput && (
          <AppText style={[styles.characterCount, value.length === maxLength && { color: Colors.appleRed }]}> 
            {value.length}/{maxLength}
          </AppText>
        )}
      </View>
      {description && <AppText variant='bodySmall' fontFamily='inter' color={Colors.mutedWhite} style={styles.description}>{description}</AppText>}
      {readOnly ? (
        <TouchableOpacity onPress={handleReadOnlyPress} activeOpacity={0.7}>
          {inputContent}
        </TouchableOpacity>
      ) : (
        inputContent
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 0,
  },
  characterCount: {
    color: Colors.mutedWhite,
    fontSize: 12,
  },
  characterCountInInput: {
    position: 'absolute',
    right: 12,
    bottom: 6,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  description: {
    marginBottom: 0,
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
  helperTextContainer: {
    paddingTop: 20,
    paddingHorizontal: 4,
  },
}); 