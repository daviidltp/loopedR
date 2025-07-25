import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import SearchIcon from '../../../../assets/icons/search.svg';
import { textStyles } from '../../../constants';
import { Colors } from '../../../constants/Colors';
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon';
import { PlatformIconButton } from '../buttons';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearchPress?: () => void;
  onFocus?: () => void;
  showSoftInputOnFocus?: boolean; // Para controlar si se muestra el teclado
  autoFocus?: boolean; // Para autoenfoque
  disableFocusBackgroundChange?: boolean; // Para deshabilitar cambio de color al enfocarse
}

export const SearchBar = forwardRef<any, SearchBarProps>(({
  placeholder = "Buscar",
  value,
  onChangeText,
  onSearchPress,
  onFocus,
  showSoftInputOnFocus = true,
  autoFocus = false,
  disableFocusBackgroundChange = false,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Exponer el método focus al componente padre
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    clear: () => {
      if (onChangeText) {
        onChangeText('');
      }
    }
  }));

  // Si no hay onChangeText NI onFocus, hacer todo el componente clickeable
  // Si hay onFocus, debe comportarse como input normal
  const isReadOnly = !onChangeText && !onFocus;

  const handleContainerPress = () => {
    if (isReadOnly && onSearchPress) {
      onSearchPress();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClearText = () => {
    if (onChangeText) {
      onChangeText('');
    }
  };

  const handleArrowPress = () => {
    inputRef.current?.blur();
  };

  // Determinar el color de fondo
  const backgroundColor = disableFocusBackgroundChange 
    ? 'rgba(255, 255, 255, 0.07)' // Color fijo
    : isFocused 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.07)';

  const searchBarContent = (
    <View 
      style={[
        styles.inputContainer, 
        { backgroundColor }
      ]}
    >
      {/* Icono de búsqueda a la izquierda */}
      <SearchIcon width={16} height={16} fill={Colors.mutedWhite} style={styles.searchIcon} />

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.mutedWhite}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        selectionColor={Colors.mutedWhite}
        editable={!isReadOnly}
        pointerEvents={isReadOnly ? 'none' : 'auto'}
        showSoftInputOnFocus={showSoftInputOnFocus}
        autoFocus={autoFocus}
      />
      
      {/* Icono de cruz a la derecha (solo si hay texto) */}
      {value && value.length > 0 && (
        <IconButton icon='close' size={20} onPress={handleClearText} iconColor={Colors.mutedWhite}/>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ArrowLeftIcon que aparece cuando está enfocado */}
      {isFocused && (
        <PlatformIconButton 
          onPress={handleArrowPress}
          icon={<ArrowLeftIcon 
            size={24} 
            color={Colors.white} 
            weight={2}
          />}
          size={20}
        />
      )}
      
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused
      ]}>
        {isReadOnly ? (
          <TouchableOpacity 
            style={styles.clickableContainer}
            onPress={handleContainerPress}
            activeOpacity={0.8}
          >
            {searchBarContent}
          </TouchableOpacity>
        ) : (
          searchBarContent
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputWrapper: {
    position: 'relative',
    flex: 1,
  },
  inputWrapperFocused: {
    flex: 1,
  },
  clickableContainer: {
    // Container para hacer clickeable todo el SearchBar
  },
  inputContainer: {
    height: 44,
    borderRadius: 16,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 12,
  },
  searchIcon: {
    padding: 4,
    marginRight: 8, // Padding de 4 entre lupa y texto
  },
  input: {
    flex: 1,
    fontSize: textStyles.body.fontSize,
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontWeight: '400', // Añadido fontWeight normal
  },
  clearIcon: {
    padding: 4,
    marginLeft: 4,
  },
}); 