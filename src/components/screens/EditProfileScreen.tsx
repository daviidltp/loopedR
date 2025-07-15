import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    BackHandler,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { currentUser } from '../../utils/mockData';
import { DefaultAvatar } from '../ui/Avatar/DefaultAvatar';
import { UploadButton } from '../ui/Avatar/UploadButton';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { TextArea } from '../ui/forms/TextArea';
import { TextInput } from '../ui/forms/TextInput';
import { DefaultHeader } from '../ui/headers/DefaultHeader';
import { Layout } from '../ui/layout/Layout';
import { PlatformTouchable } from '../ui/PlatformTouchable';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const bioInputRef = useRef(null);
  
  // Estados del formulario - inicializados con datos del usuario actual
  const [name, setName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  
  // Estados de validación
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Avatar states
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatarUrl);

  // Animaciones
  const buttonBottom = useSharedValue(20);

  // Validaciones
  const validateName = useCallback((value: string) => {
    if (!value.trim()) {
      setNameError('El nombre es requerido');
      return false;
    }

    if (value.length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    const validChars = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s.-]*$/;
    if (!validChars.test(value)) {
      setNameError('El nombre no puede contener caracteres especiales');
      return false;
    }

    setNameError('');
    return true;
  }, []);

  const validateUsername = useCallback((value: string) => {
    if (!value.trim()) {
      setUsernameError('El nombre de usuario es requerido');
      return false;
    }

    if (value.length < 3) {
      setUsernameError('El nombre de usuario debe tener al menos 3 caracteres');
      return false;
    }

    const validChars = /^[a-zA-Z0-9._]*$/;
    if (!validChars.test(value)) {
      setUsernameError('El nombre de usuario no puede contener caracteres especiales');
      return false;
    }

    setUsernameError('');
    return true;
  }, []);

  // Handlers de inputs
  const handleNameChange = useCallback((value: string) => {
    setName(value);
    validateName(value);
  }, [validateName]);

  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    validateUsername(value);
  }, [validateUsername]);

  const handleBioChange = useCallback((value: string) => {
    setBio(value);
  }, []);

  // Efectos del teclado - igual que CreateProfileScreen
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
        // Botón pegado al teclado - igual que CreateProfileScreen
        buttonBottom.value = withTiming(e.endCoordinates.height + 20, {
          duration: 250,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1.0)
        });
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
        // Botón en posición normal
        buttonBottom.value = withTiming(20, {
          duration: 250,
          easing: Easing.bezier(0.6, 0.5, 0.25, 0.5)
        });
      }
    );

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);



  // Navegación hacia atrás
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackPress();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // Validación del formulario
  const isFormValid = 
    name.trim().length >= 2 && 
    username.trim().length >= 3 && 
    !nameError && 
    !usernameError;

  // Handler para guardar cambios
  const handleSaveChanges = useCallback(async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    
    try {
      // Validar antes de guardar
      const isNameValid = validateName(name);
      const isUsernameValid = validateUsername(username);
      
      if (!isNameValid || !isUsernameValid) {
        setIsLoading(false);
        return;
      }

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Perfil actualizado:', { name, username, bio, selectedAvatar });
      
      // Regresar a settings
      navigation.goBack();
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isFormValid, name, username, bio, selectedAvatar, validateName, validateUsername, navigation]);

  // Handler para cambiar avatar
  const handleAvatarPress = useCallback(() => {
    console.log('Avatar pressed - abrir selector de avatar');
    // TODO: Implementar selector de avatar
  }, []);

  // Estilos animados
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    bottom: buttonBottom.value,
  }));

  return (
    <Layout>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          {/* Header */}
          <DefaultHeader
            title="Editar perfil"
            onBackPress={handleBackPress}
          />
          
          {/* ScrollView con manejo automático del teclado */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={true}
          >
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <PlatformTouchable 
                  style={styles.avatarContainer}
                  onPress={handleAvatarPress}
                  rippleColor={Colors.backgroundSoft}
                  borderless={true}
                >
                  <View style={styles.avatarWrapper}>
                    <DefaultAvatar 
                      name={name} 
                      size={120}
                      selectedImage={selectedAvatar ? { uri: selectedAvatar } : undefined}
                    />
                  </View>
                </PlatformTouchable>
                
                {/* Botón de upload fuera del avatar */}
                <View style={styles.uploadButtonContainer}>
                  <UploadButton size={32} />
                </View>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <TextInput
                  description="Nombre"
                  value={name}
                  onChangeText={handleNameChange}
                  placeholder="Tu nombre"
                  maxLength={50}
                  autoCapitalize="words"
                  autoCorrect={false}
                  error={nameError}
                />

                <TextInput
                  description="Nombre de usuario"
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="username"
                  maxLength={20}
                  autoCapitalize="none"
                  autoCorrect={false}
                  showFixedAtSymbol={true}
                  error={usernameError}
                  keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                  textTransform="lowercase"
                />

                <TextArea
                  ref={bioInputRef}
                  description="Biografía"
                  value={bio}
                  onChangeText={handleBioChange}
                  placeholder="Cuéntanos sobre ti..."
                  maxLength={150}
                  minHeight={80}
                  maxHeight={140}
                  autoCapitalize="sentences"
                  autoCorrect={true}
                  showCharacterCount={true}
                />
              </View>
              
              {/* Espacio adicional para evitar que el botón tape el contenido */}
              <View style={{ height: 30 }} />
            </ScrollView>
            
            {/* Botón guardar */}
            <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
              <ResizingButton
                onPress={handleSaveChanges}
                title="Guardar cambios"
                backgroundColor={Colors.white}
                textColor={Colors.background}
                isDisabled={!isFormValid}
                isLoading={isLoading}
              />
            </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexGrow: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
    position: 'relative',
  },
  avatarContainer: {
    borderRadius: 60,
  },
  avatarWrapper: {
    position: 'relative',
  },
  uploadButtonContainer: {
    position: 'absolute',
    right: '32%',
    bottom: '20%',
    zIndex: 10,
    elevation: 10,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 2,
  },
  formSection: {
    flex: 1,
    gap: 0,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
}); 