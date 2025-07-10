import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import SearchIcon from '../../../../assets/icons/search.svg';
import { Colors } from '../../../constants/Colors';

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
  placeholder = "Buscar amigos",
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

  // Determinar el color de fondo
  const backgroundColor = disableFocusBackgroundChange 
    ? 'rgba(255, 255, 255, 0.05)' // Color fijo
    : isFocused 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.05)';

  const searchBarContent = (
    <View 
      style={[
        styles.inputContainer, 
        { backgroundColor }
      ]}
    >
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray[400]}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
        selectionColor={Colors.gray[300]}
        editable={!isReadOnly}
        pointerEvents={isReadOnly ? 'none' : 'auto'}
        showSoftInputOnFocus={showSoftInputOnFocus}
        autoFocus={autoFocus}
      />
      
      {/* Icono de búsqueda */}
      <TouchableOpacity style={styles.searchIcon} onPress={onSearchPress}>
        <SearchIcon width={20} height={20} fill={Colors.gray[400]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
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
    // Sin marginHorizontal para que ocupe todo el ancho disponible
  },
  inputWrapper: {
    position: 'relative',
  },
  clickableContainer: {
    // Container para hacer clickeable todo el SearchBar
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
    paddingRight: 55, // Espacio para el icono de búsqueda
    fontSize: 18,
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  searchIcon: {
    position: 'absolute',
    right: 18,
    zIndex: 1,
    padding: 4, // Para mejor área de toque
  },
}); 